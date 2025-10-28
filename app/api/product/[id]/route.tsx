import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProductSchema } from "@/lib/zod";
import { VariantDataWithDbId } from "@/types/types";
import { del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import z from "zod";

const revalidateProduct = () => {
  revalidatePath("/");
  revalidatePath("/product");
  revalidatePath("/product/page/[page]", "page");
  revalidatePath("/dashboard/admin/product");
};

const generateSku = (productSlug: string, variantOptions: { typeName: string; optionValue: string }[]): string => {
  const optionCode = variantOptions.map((opt) => opt.optionValue.substring(0, 3).toUpperCase()).join("-");
  const baseSlug = productSlug.substring(0, 15);
  const hash = Math.random().toString(36).substring(2, 6).toUpperCase();

  return `${baseSlug}-${optionCode}-${hash}`.toUpperCase();
};

export const PUT = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const productId = (await params).id;

  const session = await auth();
  if (!session || !session.user || session.user.role !== "ADMIN")
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();

  const variantsJson = formData.get("variants") as string | null;
  let variantsData: VariantDataWithDbId[] = [];

  if (variantsJson) {
    try {
      variantsData = JSON.parse(variantsJson);
    } catch (error) {
      console.log(error);
      return Response.json({ error: "Data varian tidak valid (JSON)." }, { status: 400 });
    }
  }

  const updatedVariantsData: VariantDataWithDbId[] = variantsData.map((variant) => {
    const variantKey = `variantImage_${variant.options.map((o) => o.optionValue).join("_")}`;
    const fileVariant = formData.get(variantKey) as File | null;
    const variantImageFile = fileVariant instanceof File && fileVariant.size > 0 ? fileVariant : null;

    return { ...variant, variantImage: variantImageFile };
  });

  const file = formData.get("image") as File | null;
  const mainImageFile = file instanceof File && file.size > 0 ? file : null;
  const tags = formData.getAll("tags");
  const removeMainImage = formData.get("removeMainImage") === "true";

  const rawData = Object.fromEntries(formData.entries());
  const dataForValidation = { ...rawData, image: mainImageFile, tags, variants: updatedVariantsData };

  const validatedFields = ProductSchema.safeParse(dataForValidation);

  if (!validatedFields.success) {
    return Response.json({ errors: z.treeifyError(validatedFields.error) }, { status: 400 });
  }

  const { name, slug, description, variants, tags: validatedTags } = validatedFields.data;
  const variantsToProcess = variants as VariantDataWithDbId[];
  try {
    const oldProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        name: true,
        slug: true,
        imageUrl: true,
        ProductVariant: { select: { id: true, variantImageUrl: true } },
      },
    });

    if (!oldProduct) {
      return Response.json({ error: "Produk tidak ditemukan." }, { status: 404 });
    }

    const existingProductByName = await prisma.product.findFirst({ where: { name, id: { not: productId } } });
    if (existingProductByName) {
      return Response.json({ error: "Nama produk sudah ada" }, { status: 409 });
    }

    let imageUrlUpdate = oldProduct.imageUrl;
    if (removeMainImage) {
      if (oldProduct.imageUrl) {
        await del(oldProduct.imageUrl);
      }
      imageUrlUpdate = null;
    } else if (mainImageFile) {
      if (oldProduct.imageUrl) {
        await del(oldProduct.imageUrl);
      }
      const blob = await put(`product-main-${Date.now()}-${mainImageFile.name}`, mainImageFile, {
        access: "public",
        multipart: true,
      });
      imageUrlUpdate = blob.url;
    }

    // 4. PENANGANAN GAMBAR VARIAN (UPLOAD/DELETE BLOB DI LUAR TRANSAKSI)
    const variantImageUrlsMap = new Map<string, string | null>();

    const uploadPromises = variantsToProcess.map(async (variant) => {
      const variantFile = variant.variantImage instanceof File ? variant.variantImage : null;
      const dbId = variant.dbId;

      const tempId = dbId || variant.options.map((o) => o.optionValue).join("_");

      const oldVariant = dbId ? oldProduct.ProductVariant.find((v) => v.id === dbId) : null;
      const oldVariantUrl = oldVariant?.variantImageUrl;

      let newVariantUrl: string | null = oldVariantUrl || null;

      if (variantFile && variantFile.size > 0) {
        if (dbId && oldVariantUrl) {
          await del(oldVariantUrl);
        }

        const blob = await put(`product-variant-${Date.now()}-${variantFile.name}`, variantFile, {
          access: "public",
          multipart: true,
        });
        newVariantUrl = blob.url;
      }

      // Simpan hasil URL menggunakan KUNCI UNIK (dbId atau tempId)
      variantImageUrlsMap.set(tempId, newVariantUrl);
    });

    await Promise.all(uploadPromises);

    await prisma.$transaction(
      async (tx) => {
        const updatedProduct = await tx.product.update({
          where: { id: productId },
          data: {
            name,
            slug,
            description,
            imageUrl: imageUrlUpdate,
            categoryId: validatedFields.data.categoryId,
            tags: validatedTags as string[],
          },
        });

        const incomingVariantIds = variantsToProcess.map((v) => v.dbId).filter((id): id is string => !!id);

        await tx.productVariant.deleteMany({
          where: {
            productId: productId,
            id: { notIn: incomingVariantIds },
          },
        });

        const createdTypes = new Map<string, string>();
        const createdOptions = new Map<string, string>();

        for (const variant of variantsToProcess) {
          for (const option of variant.options) {
            const typeKey = option.typeName;
            const optionKey = `${typeKey}:${option.optionValue}`;

            if (!createdTypes.has(typeKey)) {
              let existingType = await tx.variationType.findFirst({
                where: { name: typeKey, productId: updatedProduct.id },
              });
              if (!existingType) {
                existingType = await tx.variationType.create({ data: { name: typeKey, productId: updatedProduct.id } });
              }
              createdTypes.set(typeKey, existingType.id);
            }

            const typeId = createdTypes.get(typeKey)!;

            if (!createdOptions.has(optionKey)) {
              let existingOption = await tx.variationOption.findFirst({
                where: { value: option.optionValue, variationTypeId: typeId },
              });
              if (!existingOption) {
                existingOption = await tx.variationOption.create({
                  data: { value: option.optionValue, variationTypeId: typeId },
                });
              }
              createdOptions.set(optionKey, existingOption.id);
            }
          }
        }

        for (const variant of variantsToProcess) {
          const variantDbId = variant.dbId;
          const tempId = variantDbId || variant.options.map((o) => o.optionValue).join("_");

          const urlFromMap = variantImageUrlsMap.get(tempId);
          const finalVariantImageUrl = urlFromMap !== undefined ? urlFromMap : null;

          const variantDataToSave = {
            productId: updatedProduct.id,
            price: variant.price,
            stock: variant.stock,
            variantImageUrl: finalVariantImageUrl, // Menggunakan URL yang sudah diproses
            sku: variant.sku || generateSku(updatedProduct.slug, variant.options),
          };

          let savedVariant;
          if (variantDbId) {
            savedVariant = await tx.productVariant.update({
              where: { id: variantDbId },
              data: variantDataToSave,
            });
          } else {
            savedVariant = await tx.productVariant.create({
              data: variantDataToSave,
            });
          }

          // Delete old connections and create new ones
          await tx.productVariantOption.deleteMany({
            where: { productVariantId: savedVariant.id },
          });

          const optionsToConnect = variant.options.map((option) => {
            const optionKey = `${option.typeName}:${option.optionValue}`;
            const optionId = createdOptions.get(optionKey);
            if (!optionId) throw new Error("Internal: Variation Option ID not found.");

            return {
              productVariantId: savedVariant.id,
              variationOptionId: optionId,
            };
          });

          await tx.productVariantOption.createMany({
            data: optionsToConnect,
          });
        }
      },
      {
        timeout: 10000,
      }
    );

    revalidateProduct();
    return Response.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product with variants:", error);
    return Response.json({ error: "Gagal memperbarui produk dan variannya karena kesalahan server." }, { status: 500 });
  }
};

// --- Handler DELETE ---

export const DELETE = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const productId = (await params).id;

  const session = await auth();
  if (!session || !session.user || session.user.role !== "ADMIN")
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, imageUrl: true, ProductVariant: { select: { variantImageUrl: true } } },
    });

    if (!existingProduct) {
      return Response.json({ error: "Produk tidak ditemukan." }, { status: 404 });
    }

    const urlsToDelete: string[] = [];
    if (existingProduct.imageUrl) {
      urlsToDelete.push(existingProduct.imageUrl);
    }

    existingProduct.ProductVariant.forEach((v) => {
      if (v.variantImageUrl) {
        urlsToDelete.push(v.variantImageUrl);
      }
    });

    if (urlsToDelete.length > 0) {
      try {
        await del(urlsToDelete);
      } catch (blobError) {
        console.error("Failed to delete Vercel blobs:", blobError);
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.productVariantOption.deleteMany({ where: { ProductVariant: { productId: productId } } });
      await tx.productVariant.deleteMany({ where: { productId: productId } });
      const variantTypes = await tx.variationType.findMany({ where: { productId: productId }, select: { id: true } });
      await tx.variationOption.deleteMany({ where: { variationTypeId: { in: variantTypes.map((vt) => vt.id) } } });
      await tx.variationType.deleteMany({ where: { productId: productId } });
      await tx.product.delete({ where: { id: productId } });
    });

    revalidateProduct();
    return Response.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return Response.json({ error: "Gagal menghapus produk karena kesalahan server." }, { status: 500 });
  }
};

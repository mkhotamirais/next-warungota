import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProductSchema, VariantSchema } from "@/lib/zod";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import z from "zod";

// --- Tipe Data ---
type VariantData = z.infer<typeof VariantSchema>;

// --- Helper Functions ---
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

export const POST = async (req: Request) => {
  const session = await auth();
  if (!session || !session.user || session.user.role !== "ADMIN")
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  const userId = session.user.id as string;
  const formData = await req.formData();

  const variantsJson = formData.get("variants") as string | null;
  let variantsData: VariantData[] = []; // Menggunakan VariantData

  if (variantsJson) {
    try {
      variantsData = JSON.parse(variantsJson);
    } catch (error) {
      console.error(error);
      return Response.json({ error: "Data varian tidak valid (JSON)." }, { status: 400 });
    }
  }

  // 1. Injeksi File Varian
  const updatedVariantsData: VariantData[] = variantsData.map((variant) => {
    const variantKey = `variantImage_${variant.options.map((o) => o.optionValue).join("_")}`;
    const fileVariant = formData.get(variantKey) as File | null;
    const variantImageFile = fileVariant instanceof File && fileVariant.size > 0 ? fileVariant : null;

    return { ...variant, variantImage: variantImageFile };
  });

  const file = formData.get("image") as File | null;
  const mainImageFile = file instanceof File && file.size > 0 ? file : null;
  const tags = formData.getAll("tags");

  const rawData = Object.fromEntries(formData.entries());
  const dataForValidation = { ...rawData, image: mainImageFile, tags, variants: updatedVariantsData };

  const validatedFields = ProductSchema.safeParse(dataForValidation);
  if (!validatedFields.success) {
    return Response.json({ errors: z.treeifyError(validatedFields.error) }, { status: 400 });
  }

  const { name, price, stock, slug, description, variants, tags: validatedTags } = validatedFields.data;
  const variantsToProcess = variants as VariantData[]; // Deklarasi yang benar

  try {
    let categoryId = validatedFields.data.categoryId;
    const existingCategory = await prisma.productCategory.findUnique({ where: { id: categoryId } });
    if (!existingCategory) {
      const defaultCategory = await prisma.productCategory.findFirst({ where: { isDefault: true } });
      if (!defaultCategory)
        return Response.json({ error: "Tidak ada kategori default dan juga kategori terpilih" }, { status: 404 });
      categoryId = defaultCategory.id;
    }

    const existingProduct = await prisma.product.findFirst({ where: { name } });
    if (existingProduct) {
      return Response.json({ error: "Nama produk sudah ada" }, { status: 409 });
    }

    let imageUrl: string | null = null;
    if (mainImageFile) {
      const blob = await put(`product-main-${Date.now()}-${mainImageFile.name}`, mainImageFile, {
        access: "public",
        multipart: true,
      });
      imageUrl = blob.url;
    }

    const variantImageUrlsMap = new Map<string, string>();

    const uploadPromises = variantsToProcess.map(async (variant) => {
      const variantFile = variant.variantImage as File | null;
      console.log(variantFile);
      if (variantFile && variantFile.size > 0) {
        const key = variant.options.map((o) => o.optionValue).join("_");
        const blob = await put(`product-variant-${Date.now()}-${variantFile.name}`, variantFile, {
          access: "public",
          multipart: true,
        });
        variantImageUrlsMap.set(key, blob.url);
        console.log("blob", blob);
        console.log("blob.url", blob.url);
      }
    });
    await Promise.all(uploadPromises); // Jalankan semua upload secara paralel

    // 4. EKSEKUSI TRANSAKSI DATABASE (OPTIMAL)
    await prisma.$transaction(
      async (tx) => {
        const newProduct = await tx.product.create({
          data: {
            name,
            price,
            stock,
            slug,
            description,
            imageUrl,
            userId,
            categoryId,
            tags: validatedTags as string[],
          },
        });

        const uniqueTypeNames = new Set(variantsToProcess.flatMap((v) => v.options.map((o) => o.typeName)));

        const typeCreationPromises = Array.from(uniqueTypeNames).map((typeName) =>
          tx.variationType.create({
            data: { name: typeName, productId: newProduct.id },
          })
        );
        const createdTypes = await Promise.all(typeCreationPromises);
        const typeIdMap = new Map<string, string>();
        createdTypes.forEach((t) => typeIdMap.set(t.name, t.id));

        const optionToCreate: { value: string; variationTypeId: string }[] = [];
        const processedOptions = new Set<string>();

        for (const variant of variantsToProcess) {
          for (const option of variant.options) {
            const optionKey = `${option.typeName}:${option.optionValue}`;

            if (!processedOptions.has(optionKey)) {
              const typeId = typeIdMap.get(option.typeName);

              if (!typeId) {
                throw new Error(`Internal: VariationType ID for "${option.typeName}" not found.`);
              }

              optionToCreate.push({
                value: option.optionValue,
                variationTypeId: typeId,
              });
              processedOptions.add(optionKey);
            }
          }
        }

        await tx.variationOption.createMany({ data: optionToCreate });

        const createdOptions = await tx.variationOption.findMany({
          where: { variationTypeId: { in: createdTypes.map((t) => t.id) } },
          select: { id: true, value: true, variationTypeId: true },
        });
        const optionIdMap = new Map<string, string>(); // Key: "Warna:Merah", Value: optionId
        createdOptions.forEach((o) => {
          const typeName = createdTypes.find((t) => t.id === o.variationTypeId)?.name;
          if (typeName) optionIdMap.set(`${typeName}:${o.value}`, o.id);
        });

        // F. Persiapkan ProductVariant dan ProductVariantOption
        const productVariantsToCreate = [];
        const productVariantOptionsToCreate: { productVariantId: string; variationOptionId: string }[] = [];

        console.log("variantToProcess", variantsToProcess);
        for (const variant of variantsToProcess) {
          const key = variant.options.map((o) => o.optionValue).join("_");
          const variantImageUrl = variantImageUrlsMap.get(key) || null;

          const generatedSku = generateSku(slug, variant.options);

          productVariantsToCreate.push({
            productId: newProduct.id,
            price: variant.price,
            stock: variant.stock,
            variantImageUrl,
            sku: generatedSku,
          });
        }

        // G. Buat ProductVariant secara massal (createManyAndReturn)
        const newVariants = await tx.productVariant.createManyAndReturn({ data: productVariantsToCreate });

        // H. Hubungkan ProductVariant dengan VariationOption
        newVariants.forEach((newVariant) => {
          // Asumsi: Kita harus mencocokkan varian berdasarkan SKU, karena urutan createMany tidak dijamin
          const originalVariant = variantsToProcess.find((v) =>
            v.options.every((vo) => newVariant.sku?.includes(vo.optionValue.substring(0, 3).toUpperCase()))
          );

          if (originalVariant) {
            originalVariant.options.forEach((option) => {
              const optionKey = `${option.typeName}:${option.optionValue}`;
              const optionId = optionIdMap.get(optionKey);

              if (optionId) {
                productVariantOptionsToCreate.push({
                  productVariantId: newVariant.id,
                  variationOptionId: optionId,
                });
              }
            });
          }
        });

        // I. Buat ProductVariantOption secara massal (createMany)
        await tx.productVariantOption.createMany({ data: productVariantOptionsToCreate });
      },
      {
        // 🔥 Mengatasi Timeout: Meningkatkan batas waktu menjadi 10 detik
        timeout: 10000,
      }
    );

    revalidateProduct();
    return Response.json({ message: "Product created successfully" });
  } catch (error) {
    console.error("Error creating product with variants:", error);
    return Response.json({ error: "Gagal membuat produk dan variannya karena kesalahan server." }, { status: 500 });
  }
};

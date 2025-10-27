"use client";

import Input from "@/components/form/Input";
import Select from "@/components/form/Select";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { FaTrash } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import Msg from "@/components/form/Msg";
import Button from "@/components/ui/Button";
import { useProduct } from "@/hooks/useProduct";
import TiptapEditor from "@/components/form/tiptap/TiptapEditor";
import InputMultiple from "@/components/form/InputMultiple";
import VariantRow from "../../VariantRow";
import { Variant, VariantOption, VariationTypeState, EditProductFormProps } from "@/types/types";
import VariationManager from "../../VariantManager";

interface VariationOptionData {
  value: string;
  VariationType: { id: string; name: string };
}

interface ProductVariantOptionData {
  VariationOption: VariationOptionData;
}

interface ProductVariantFromDB {
  id: string;
  price: number;
  stock: number;
  sku: string | null;
  variantImageUrl: string | null;
  Options: ProductVariantOptionData[];
}

interface ProductWithVariantsAndTypes extends Omit<EditProductFormProps["product"], "Variants"> {
  Variants: ProductVariantFromDB[];
}

// interface VariantDataToSubmit extends Omit<Variant, "id" | "variantImage" | "sku"> {
//   dbId?: string;
//   variantImage: string | null;
//   sku?: string | null | undefined;
// }

const transformProductToState = (
  product: ProductWithVariantsAndTypes
): {
  initialVariationTypes: VariationTypeState[];
  initialVariantsState: Variant[];
} => {
  const typeMap = new Map<string, VariationTypeState>();
  const initialVariantsState: Variant[] = [];

  product.ProductVariant.forEach((variant) => {
    variant.Options.forEach((pvo) => {
      const typeName = pvo.VariationOption.VariationType.name;
      const optionValue = pvo.VariationOption.value;
      const typeDbId = pvo.VariationOption.VariationType.id; // Ambil ID Tipe Variasi

      if (!typeMap.has(typeName)) {
        typeMap.set(typeName, { name: typeName, options: [], dbId: typeDbId }); // 🔥 Isi dbId di sini
      }

      const type = typeMap.get(typeName)!;
      if (!type.options.includes(optionValue)) {
        type.options.push(optionValue);
      }
    });
  });

  const initialVariationTypes: VariationTypeState[] = Array.from(typeMap.values());

  product.ProductVariant.forEach((v, index) => {
    initialVariantsState.push({
      id: index,
      dbId: v.id,
      options: v.Options.map((pvo) => ({
        typeName: pvo.VariationOption.VariationType.name,
        optionValue: pvo.VariationOption.value,
      })) as VariantOption[],
      price: String(v.price),
      stock: Number(v.stock),
      variantImageUrl: v.variantImageUrl,
      variantImageFile: null,
      // sku: v.sku,
    });
  });

  return { initialVariationTypes, initialVariantsState };
};

export default function EditProductForm({ productCategories, product: rawProduct }: EditProductFormProps) {
  const product = rawProduct as ProductWithVariantsAndTypes;

  const { initialVariationTypes, initialVariantsState } = transformProductToState(product);

  const [name, setName] = useState<string>(product.name);
  const [description, setDescription] = useState<string>(product.description || "");
  const [categoryId, setCategoryId] = useState<string>(product.categoryId);
  const [tags, setTags] = useState<string[]>(product.tags || []);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(product.imageUrl);
  const [removeMainImage, setRemoveMainImage] = useState<boolean>(false);

  const [variationTypes, setVariationTypes] = useState<VariationTypeState[]>(initialVariationTypes);
  const [variantsState, setVariantsState] = useState<Variant[]>(initialVariantsState);

  const { errors, setErrors, setSuccessMsg, errorMsg, setErrorMsg } = useProduct();

  const [pending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const productCategoriesOptions = productCategories.map((category) => ({ label: category.name, value: category.id }));

  const isBlobUrl = (url: string | null) => url?.startsWith("blob:");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (imageUrl && isBlobUrl(imageUrl)) {
      URL.revokeObjectURL(imageUrl);
    }

    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setRemoveMainImage(false);
  };

  const handleRemoveImage = () => {
    if (imageUrl && isBlobUrl(imageUrl)) {
      URL.revokeObjectURL(imageUrl);
    }

    setImageFile(null);
    setImageUrl(null);
    setRemoveMainImage(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleVariantChange = (index: number, updatedVariant: Variant) => {
    const oldVariant = variantsState[index];
    if (oldVariant.variantImage instanceof File && isBlobUrl(URL.createObjectURL(oldVariant.variantImage))) {
      URL.revokeObjectURL(URL.createObjectURL(oldVariant.variantImage));
    }
    setVariantsState((prev) => prev.map((v, i) => (i === index ? updatedVariant : v)));
  };

  const handleRemoveVariant = (index: number) => {
    const variantToRemove = variantsState[index];
    if (variantToRemove.variantImage instanceof File) {
      URL.revokeObjectURL(URL.createObjectURL(variantToRemove.variantImage));
    }
    setVariantsState((prev) => prev.filter((_, i) => i !== index));
  };

  const generateVariants = useCallback((types: VariationTypeState[]) => {
    if (types.length === 0) {
      setVariantsState([]);
      return;
    }

    const combinations: VariantOption[][] = [];

    const generate = (index: number, current: VariantOption[]) => {
      if (index === types.length) {
        combinations.push(current);
        return;
      }
      const type = types[index];
      for (const optionValue of type.options.filter((o) => o.trim() !== "")) {
        generate(index + 1, [...current, { typeName: type.name, optionValue }]);
      }
    };

    generate(0, []);

    setVariantsState((prevVariants) => {
      const newVariants: Variant[] = combinations.map((combination, id) => {
        const existingVariant = prevVariants.find(
          (v) =>
            v.options.every((vo) =>
              combination.some((c) => c.typeName === vo.typeName && c.optionValue === vo.optionValue)
            ) &&
            combination.every((c) =>
              v.options.some((vo) => vo.typeName === c.typeName && vo.optionValue === c.optionValue)
            )
        );

        const dbId = existingVariant?.dbId;
        // const variantImage = existingVariant ? existingVariant.variantImage : null;
        const price = existingVariant ? String(existingVariant.price) : "0";
        const stock = existingVariant ? Number(existingVariant.stock) : 0;
        // const sku = existingVariant ? existingVariant.sku : null;

        return {
          id: id,
          dbId: dbId,
          options: combination,
          price: price,
          stock: stock,
          variantImageFile: null,
          variantImageUrl: null,
          // sku: sku,
        } as Variant;
      });
      return newVariants;
    });
  }, []);

  useEffect(() => {
    generateVariants(variationTypes);
  }, [variationTypes, generateVariants]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("categoryId", categoryId);
    formData.append("removeMainImage", String(removeMainImage));

    if (imageFile) {
      formData.append("image", imageFile as Blob);
    }
    tags.map((tag) => {
      formData.append("tags", tag);
    });

    // const variantsToSubmit: VariantDataToSubmit[] = [];
    const variantsToSubmit = [];

    for (const variant of variantsState) {
      const dataToSubmit = {
        dbId: variant.dbId,
        options: variant.options,
        price: variant.price,
        stock: variant.stock,
        // sku: variant.sku,
        // Jika File, kirim namanya untuk di-match di backend. Jika string/null, kirim saja.
        // variantImage: variant.variantImage instanceof File ? variant.variantImage.name : variant.variantImage,
      };
      variantsToSubmit.push(dataToSubmit);

      if (variant.variantImageFile instanceof File) {
        formData.append(
          `variantImage_${variant.options.map((o) => o.optionValue).join("_")}`,
          variant.variantImageFile as Blob
        );
      }
    }

    formData.append("variants", JSON.stringify(variantsToSubmit));

    startTransition(async () => {
      const res = await fetch(`/api/product/${product.id}`, { method: "PUT", body: formData });
      const result = await res.json();

      if (result?.errors || result?.error || result?.message) {
        setErrors(undefined);
        setErrorMsg(null);
        setSuccessMsg(null);
      }

      if (result?.errors) {
        setErrors(result.errors.properties);
        return;
      }

      if (result?.error) {
        setErrorMsg(result.error);
        return;
      }

      setSuccessMsg(result.message);

      router.push("/dashboard/admin/product");
      router.refresh();
    });
  };

  return (
    <>
      {errorMsg ? <Msg msg={errorMsg} error /> : null}
      <form onSubmit={handleUpdate}>
        {/* ... (Markup Gambar Utama) ... */}
        <Input
          ref={fileInputRef}
          id="image"
          label="Image Utama Produk"
          type="file"
          onChange={handleFileChange}
          error={errors?.image?.errors}
        />
        {imageUrl && (
          <div className="relative mb-6">
            <Image
              src={imageUrl}
              alt="preview"
              width={500}
              height={300}
              className="w-full h-56 object-contain object-center bg-gray-100 rounded border border-gray-300"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              aria-label="remove image"
              className="absolute right-3 top-3 p-2 rounded border border-red-500 text-red-500"
            >
              <FaTrash />
            </button>
          </div>
        )}

        {/* ... (Detail Produk Induk) ... */}
        <Input
          id="name"
          label="Nama Produk"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors?.name?.errors}
        />

        <TiptapEditor
          label="Description"
          value={description}
          onChange={setDescription}
          error={errors?.description?.errors}
        />

        <Select
          id="productCategory"
          label="Category"
          options={productCategoriesOptions}
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          error={errors?.categoryId?.errors}
        />
        <InputMultiple label="Tags" id="tags" value={tags} onChange={setTags} />

        <hr className="my-8" />

        <h3 className="text-xl font-bold mb-4">Pengaturan Varian Produk</h3>

        <VariationManager variationTypes={variationTypes} setVariationTypes={setVariationTypes} />

        <hr className="my-8" />

        <h3 className="text-xl font-bold mb-4">Daftar SKU ({variantsState.length} Varian)</h3>

        {variantsState.map((variant, index) => {
          const variantErrors = errors;
          return (
            <VariantRow
              key={variant.id}
              variant={variant}
              index={index}
              onChange={handleVariantChange}
              onRemove={handleRemoveVariant}
              errors={variantErrors}
            />
          );
        })}

        {errors?.variants?.errors && variantsState.length === 0 && (
          <p className="text-sm text-red-600 mb-4">{errors.variants.errors[0]}</p>
        )}

        <Button type="submit" disabled={pending || variantsState.length === 0}>
          {pending ? "Updating..." : "Update Product"}
        </Button>
      </form>
    </>
  );
}

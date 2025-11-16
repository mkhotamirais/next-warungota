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
import VariantRow from "../VariantRow";
import { Variant, VariantOption, VariationTypeState, CreateProductFormProps } from "@/types/types";
import VariationManager from "../VariantManager";

export default function CreateProductForm({ productCategories }: CreateProductFormProps) {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [variationTypes, setVariationTypes] = useState<VariationTypeState[]>([]);
  const [variantsState, setVariantsState] = useState<Variant[]>([]);

  const { errors, setErrors, setSuccessMsg, errorMsg, setErrorMsg } = useProduct();

  const [pending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const productCategoriesOptions = productCategories.map((category) => ({ label: category.name, value: category.id }));
  const defaultCategory = productCategories.find((category) => category.isDefault)!;

  useEffect(() => {
    if (defaultCategory && !categoryId) {
      setCategoryId(defaultCategory.id);
    }
  }, [defaultCategory, categoryId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImage(null);
    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleVariantChange = (index: number, updatedVariant: Variant) => {
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

        return {
          id: id,
          options: combination,
          price: existingVariant ? String(existingVariant.price) : "0",
          stock: existingVariant ? Number(existingVariant.stock) : 0,
          variantImageFile: existingVariant ? existingVariant.variantImageFile : null,
        } as Variant;
      });
      return newVariants;
    });
  }, []);

  useEffect(() => {
    generateVariants(variationTypes);
  }, [variationTypes, generateVariants]);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("description", description);
    formData.append("categoryId", categoryId);

    if (image) {
      formData.append("image", image as Blob);
    }
    tags.map((tag) => {
      formData.append("tags", tag);
    });

    const variantsToSubmit = [];

    for (const variant of variantsState) {
      const dataToSubmit = {
        options: variant.options,
        price: variant.price,
        stock: variant.stock,
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
      const res = await fetch("/api/product", { method: "POST", body: formData });
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

      setName("");
      setDescription("");
      setTags([]);
      setCategoryId(defaultCategory.id);
      setImage(null);
      setImagePreview(null);
      setVariationTypes([]);
      setVariantsState([]);

      if (fileInputRef.current) fileInputRef.current.value = "";

      router.push("/dashboard/admin/product");
      router.refresh();

      setTimeout(() => {
        setSuccessMsg(null);
      }, 3000);
    });
  };

  return (
    <>
      {errorMsg ? <Msg msg={errorMsg} error /> : null}
      <form onSubmit={handleCreate}>
        {/* Gambar Utama */}
        <Input
          ref={fileInputRef}
          id="image"
          label="Image Utama Produk"
          type="file"
          onChange={handleFileChange}
          error={errors?.image?.errors}
        />
        {imagePreview && (
          <div className="relative mb-6">
            <Image
              src={imagePreview}
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

        <Input
          id="name"
          label="Nama Produk"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors?.name?.errors}
        />
        <div className="flex flex-row gap-2">
          <Input
            id="price"
            label="Price"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Price Product"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            error={errors?.price?.errors}
            className="w-3/4"
          />

          <Input
            id="stok"
            label="Stok"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Stok produk"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            error={errors?.stock?.errors}
            className="w-1/4"
          />
        </div>

        <TiptapEditor
          label="Description"
          value={description}
          onChange={setDescription}
          error={errors?.description?.errors}
        />

        {/* Kategori dan Tags */}
        <Select
          id="productCategory"
          label="Category"
          options={productCategoriesOptions}
          value={categoryId || defaultCategory.id}
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
          // const variantErrors = errors?.variants?.errors?.[index]?.properties;
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

        <Button type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create Product"}
        </Button>
      </form>
    </>
  );
}

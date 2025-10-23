"use client";

import Input from "@/components/form/Input";
import Select from "@/components/form/Select";
// import Textarea from "@/components/form/Textarea";
import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { FaTrash } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { ProductCategory } from "@prisma/client";
import Msg from "@/components/form/Msg";
import Button from "@/components/ui/Button";
import { useProduct } from "@/hooks/useProduct";
import TiptapEditor from "@/components/form/tiptap/TiptapEditor";
import InputMultiple from "@/components/form/InputMultiple";

interface CreateProductFormProps {
  productCategories: ProductCategory[];
}

export default function CreateProductForm({ productCategories }: CreateProductFormProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("description", description);
    formData.delete("tags");
    formData.append("categoryId", categoryId);
    if (image) {
      formData.append("image", image as Blob);
    }
    tags.map((tag) => {
      formData.append("tags", tag);
    });

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
      setPrice("");
      setStock("");
      setDescription("");
      setTags([]);
      setCategoryId(defaultCategory.id);
      setImage(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      router.push("/dashboard/admin/product");
      router.refresh();
    });
  };

  return (
    <>
      {/* {successMsg ? <Msg msg={successMsg} /> : null} */}
      {errorMsg ? <Msg msg={errorMsg} error /> : null}
      <form onSubmit={handleCreate}>
        <Input
          ref={fileInputRef}
          id="image"
          label="Image"
          type="file"
          onChange={handleFileChange}
          error={errors?.image?.errors}
        />
        {imagePreview && (
          <div className="relative">
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
          label="Name"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors?.name?.errors}
        />
        <div className="flex gap-2">
          <Input
            id="price"
            label="Price"
            placeholder="Price"
            value={price}
            onChange={(e) => {
              const value = e.target.value;
              if (!/^\d*$/.test(value)) {
                alert("Input hanya boleh angka");
                return;
              }
              setPrice(value);
            }}
            error={errors?.price?.errors}
            className="w-3/4"
          />
          <Input
            id="stock"
            label="Stock"
            placeholder="Stock"
            value={stock.toString()}
            onChange={(e) => {
              const value = e.target.value;
              if (!/^\d*$/.test(value)) {
                alert("Input hanya boleh angka");
                return;
              }
              setStock(value);
            }}
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
        {/* <Textarea
          id="content"
          label="Content"
          type="text"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          error={errors?.content?.errors}
        /> */}
        <Select
          id="productCategory"
          label="Category"
          options={productCategoriesOptions}
          value={categoryId || defaultCategory.id}
          onChange={(e) => setCategoryId(e.target.value)}
          error={errors?.categoryId?.errors}
        />
        <InputMultiple label="Tags" id="tags" value={tags} onChange={setTags} />

        <Button type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create"}
        </Button>
      </form>
    </>
  );
}

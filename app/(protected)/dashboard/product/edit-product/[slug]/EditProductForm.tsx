"use client";

import Input from "@/components/form/Input";
import Select from "@/components/form/Select";
// import Textarea from "@/components/form/Textarea";
import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { FaTrash } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { ProductCategory } from "@prisma/client";
import { ProductProps } from "@/types/types";
import Msg from "@/components/form/Msg";
import Button from "@/components/ui/Button";
import { useProduct } from "@/hooks/useProduct";
import TiptapEditor from "@/components/form/tiptap/TiptapEditor";
import InputMultiple from "@/components/form/InputMultiple";

interface UpdateProductFormProps {
  productCategories: ProductCategory[];
  product: ProductProps;
}

export default function EditProductForm({ productCategories, product }: UpdateProductFormProps) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price.toString());
  const [stock, setStock] = useState(product.stock.toString());
  const [description, setDescription] = useState(product.description || "");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { errors, setErrors, setSuccessMsg, errorMsg, setErrorMsg } = useProduct();

  const [pending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const productCategoriesOptions = productCategories.map((category) => ({ label: category.name, value: category.id }));

  useEffect(() => {
    if (product) {
      setTags(product.tags!);
      setCategoryId(product.categoryId!);
      setImagePreview(product.imageUrl!);
    }
  }, [product]);

  const defaultCategory = productCategories.find((category) => category.isDefault)!;

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

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    // formData.append("title", title);
    // formData.append("content", content);
    formData.append("categoryId", categoryId);
    if (image) {
      formData.append("image", image as Blob);
    }

    startTransition(async () => {
      const res = await fetch(`/api/product/${product.id}`, { method: "PATCH", body: formData });
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
      // setTitle("");
      // setContent("");
      setCategoryId(defaultCategory.id);
      setImage(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      router.push("/dashboard/product");
    });
  };

  return (
    <>
      {/* {successMsg ? <Msg msg={successMsg} /> : null} */}
      {errorMsg ? <Msg msg={errorMsg} error /> : null}

      <form onSubmit={handleUpdate}>
        {/* image */}
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
          // value="<p>halo</p>"
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
          {pending ? "Updating..." : "Update"}
        </Button>
      </form>
    </>
  );
}

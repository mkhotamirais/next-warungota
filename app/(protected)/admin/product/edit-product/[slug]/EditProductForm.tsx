"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { ProductCategory } from "@/lib/generated/prisma";
import { SingleProductProps } from "@/types/product";
import { toast } from "sonner";
import { useProduct } from "@/hooks/tanstack/useProduct";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { productSchema } from "@/lib/schemas/product";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import TiptapEditor from "@/components/ui/custom/tiptap/TiptapEditor";
import MultiInput from "@/components/ui/custom/MultiInput";

type inferSchema = z.infer<typeof productSchema>;

export interface EditProductFormProps {
  productCategories: ProductCategory[];
  product: SingleProductProps;
}

export default function EditProductForm({ productCategories, product }: EditProductFormProps) {
  const form = useForm<inferSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: String(product?.price) || "",
      stock: String(product?.stock) || "",
      tags: product?.tags.map((tag) => tag) || [],
      categoryId: product?.categoryId || "",
      image: undefined,
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(product?.imageUrl || null);
  const [removeImage, setRemoveImage] = useState(false);

  const { updateProduct, isUpdating: pending } = useProduct();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const productCategoriesOptions = productCategories
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((category) => ({ label: category.name, value: category.id }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (file: File | null) => void) => {
    const file = e.target.files?.[0] || null;

    onChange(file);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setRemoveImage(false);
    } else {
      setImagePreview(null);
    }
  };

  const handleRemoveImage = (onChange: (file: null) => void) => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    onChange(null);
    setImagePreview(null);
    setRemoveImage(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: inferSchema) => {
    const { name, price, stock, description, categoryId, image, tags } = data;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("description", description || "");
    formData.append("categoryId", categoryId);
    formData.append("removeImage", String(removeImage));

    if (image) {
      formData.append("image", image as Blob);
    }
    tags.map((tag) => {
      formData.append("tags", tag);
    });

    const result = await updateProduct({ slug: product.slug, formData });

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success(result?.message);
    router.refresh();
    router.back();
  };

  return (
    <form id="blog-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="image"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="image">Image</FieldLabel>
              <div className="space-y-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  aria-invalid={fieldState.invalid}
                  ref={(e) => {
                    field.ref(e);
                    fileInputRef.current = e;
                  }}
                  onChange={(e) => handleFileChange(e, field.onChange)}
                />

                {/* {fieldState.invalid && <FieldError errors={[fieldState.error]} />} */}

                {imagePreview && (
                  <div className="relative mt-2">
                    <Image
                      src={imagePreview}
                      alt="preview"
                      width={500}
                      height={300}
                      className="w-full h-56 object-contain rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveImage(field.onChange)}
                      className="absolute right-3 top-3"
                    >
                      <FaTrash />
                    </Button>
                  </div>
                )}
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input {...field} id="name" aria-invalid={fieldState.invalid} placeholder="Blog title" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="flex gap-2 items-center">
          <Controller
            name="price"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="price">Price</FieldLabel>
                <Input {...field} id="price" aria-invalid={fieldState.invalid} placeholder="Product price" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="stock"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="stock">Stock</FieldLabel>
                <Input {...field} id="stock" aria-invalid={fieldState.invalid} placeholder="Stock" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <TiptapEditor value={field.value} onChange={field.onChange} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="categoryId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="categoryId">Category</FieldLabel>
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih category" />
                </SelectTrigger>
                <SelectContent>
                  {productCategoriesOptions?.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>{" "}
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="tags"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="mt-4">
              <FieldLabel htmlFor="tags">Tags</FieldLabel>
              <MultiInput value={field.value} onChange={field.onChange} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit" className="mt-4" disabled={pending}>
        {pending && <Spinner />}
        Save
      </Button>
    </form>
  );
}

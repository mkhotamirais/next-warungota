"use client";

import Input from "@/components/form/Input";
import Select from "@/components/form/Select";
// import Textarea from "@/components/form/Textarea";
import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { FaTrash } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { BlogCategory } from "@prisma/client";
import Msg from "@/components/form/Msg";
import Button from "@/components/ui/Button";
import { useBlog } from "@/hooks/useBlog";
import TiptapEditor from "@/components/form/tiptap/TiptapEditor";

interface CreateBlogFormProps {
  blogCategories: BlogCategory[];
}

export default function CreateBlogForm({ blogCategories }: CreateBlogFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { errors, setErrors, setSuccessMsg, errorMsg, setErrorMsg } = useBlog();

  const [pending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const blogCategoriesOptions = blogCategories.map((category) => ({ label: category.name, value: category.id }));

  const defaultCategory = blogCategories.find((category) => category.isDefault)!;
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
    formData.append("title", title);
    formData.append("content", content);
    formData.append("categoryId", categoryId);
    if (image) {
      formData.append("image", image as Blob);
    }

    startTransition(async () => {
      const res = await fetch("/api/blog", { method: "POST", body: formData });
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
      setTitle("");
      setContent("");
      setCategoryId(defaultCategory.id);
      setImage(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      router.push("/dashboard/admin/blog");
      router.refresh();
    });
  };

  return (
    <>
      {/* {successMsg ? <Msg msg={successMsg} /> : null} */}
      {errorMsg ? <Msg msg={errorMsg} error /> : null}
      <form onSubmit={handleCreate}>
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
          id="title"
          label="Title"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors?.title?.errors}
        />
        <TiptapEditor label="Content" value={content} onChange={setContent} error={errors?.content?.errors} />
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
          id="blogCategory"
          label="Category"
          options={blogCategoriesOptions}
          value={categoryId || defaultCategory.id}
          onChange={(e) => setCategoryId(e.target.value)}
          error={errors?.categoryId?.errors}
        />

        <Button type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create"}
        </Button>
      </form>
    </>
  );
}

"use client";

import Input from "@/components/form/Input";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Button from "@/components/ui/Button";
import { useProductCategory } from "@/hooks/useProductCategory";

export default function Create() {
  const { setSuccessMsg, setErrorMsg, errors, setErrors } = useProductCategory();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const res = await fetch("/api/product-category", { method: "POST", body: JSON.stringify({ name }) });

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

      router.refresh();
    });
  };

  return (
    <>
      <form onSubmit={handleCreate} className="space-y-4 p-3 border border-gray-200 mb-4">
        <Input
          id="name"
          label="Create Product Category"
          placeholder="Product Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors?.name?.errors}
        />
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Creating..." : "Create"}
        </Button>
      </form>
    </>
  );
}

"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { FaTrash } from "react-icons/fa6";
import { useTransition } from "react";
import Modal, { ModalClose } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useBlogCategory } from "@/lib/useBlogCategory";
import { BlogCategory } from "@prisma/client";

export default function Delete({ category }: { category: BlogCategory }) {
  const [pending, startTransition] = useTransition();
  const { setSuccessMsg, setErrorMsg, setErrors } = useBlogCategory();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const res = await fetch(`/api/blog-category/${category.id}`, { method: "DELETE" });

      const result = await res.json();

      if (result?.errors || result?.error || result?.message) {
        setErrors(undefined);
        setErrorMsg(null);
        setSuccessMsg(null);
      }

      if (result?.error) {
        setErrorMsg(result.error);
        return;
      }
      setSuccessMsg(result.message);

      router.refresh();
    });
  };

  return (
    // <button type="button" onClick={handleDelete} aria-label="Delete" className="text-red-500 p-2 border rounded">
    //   {pending ? <FaSpinner className="animate-spin" /> : <FaTrash />}
    // </button>
    <Modal
      trigger={
        <div aria-label="Delete" className="text-red-500 p-2 rounded border flex border-red-500">
          <FaTrash />
        </div>
      }
      triggerDisabled={category.isDefault === true}
      title="Delete Blog"
    >
      <p>
        Delete <b>{category.name}</b>, this action cannot be undone, are you sre?
      </p>
      <div className="flex gap-2 mt-4">
        <ModalClose asChild>
          <Button type="button" variant="danger" disabled={pending} onClick={handleDelete}>
            {pending ? "Deleting..." : "Delete"}
          </Button>
        </ModalClose>
        <ModalClose asChild>
          <Button type="button" variant="gray">
            Cancel
          </Button>
        </ModalClose>
      </div>
    </Modal>
  );
}

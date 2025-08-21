"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { useTransition } from "react";
import Modal, { ModalClose } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useProductTag } from "@/hooks/useProductTag";
import { ProductTag } from "@prisma/client";

export default function Delete({ tag }: { tag: ProductTag }) {
  const [pending, startTransition] = useTransition();
  const { setSuccessMsg, setErrorMsg, setErrors } = useProductTag();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const res = await fetch(`/api/product-tag/${tag.id}`, { method: "DELETE" });

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
      setIsModalOpen(false);

      router.refresh();
    });
  };

  return (
    <Modal
      modalOpen={isModalOpen}
      onModalOpenChange={setIsModalOpen}
      trigger={
        <div aria-label="Delete" className="text-red-500 p-2 rounded border flex border-red-500">
          <FaTrash />
        </div>
      }
      title="Delete Product"
    >
      <p>
        Delete <b>{tag.name}</b>, this action cannot be undone, are you sre?
      </p>
      <div className="flex gap-2 mt-4">
        <Button type="button" variant="danger" disabled={pending} onClick={handleDelete}>
          {pending ? "Deleting..." : "Delete"}
        </Button>
        <ModalClose asChild>
          <Button type="button" variant="gray">
            Cancel
          </Button>
        </ModalClose>
      </div>
    </Modal>
  );
}

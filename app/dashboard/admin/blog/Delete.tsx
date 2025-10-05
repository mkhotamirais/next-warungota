"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { BlogProps } from "@/types/types";
import Modal, { ModalClose } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useBlog } from "@/hooks/useBlog";

interface DeleteProps {
  blog: BlogProps;
  closeMoreOptions: () => void;
}

export default function Delete({ blog, closeMoreOptions }: DeleteProps) {
  const [pending, startTransition] = useTransition();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { setSuccessMsg, setErrorMsg, setErrors } = useBlog();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const res = await fetch(`/api/blog/${blog.id}`, {
        method: "DELETE",
        body: JSON.stringify({ imageUrl: blog.imageUrl }),
      });
      const result = await res.json();

      if (result?.errors || result?.error || result?.message) {
        setSuccessMsg(null);
        setErrorMsg(null);
        setErrors(undefined);
      }

      if (result?.error) setErrorMsg(result.error);
      if (result?.message) setSuccessMsg(result.message);

      setIsOpenModal(false);
      closeMoreOptions();
      router.refresh();
    });
  };
  return (
    <Modal
      modalOpen={isOpenModal}
      onModalOpenChange={setIsOpenModal}
      trigger={
        <Button as={"div"} variant="danger">
          Delete
        </Button>
      }
      title="Delete Blog"
    >
      <p>
        Delete <b>{blog.title}</b>, this action cannot be undone, are you sre?
      </p>
      <div className="flex gap-2 mt-4">
        <Button type="button" variant="danger" disabled={pending} onClick={handleDelete}>
          {pending ? "loading..." : "Delete"}
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

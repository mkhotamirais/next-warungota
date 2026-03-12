"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProductCategory } from "@/lib/generated/prisma";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { FaTrash } from "react-icons/fa6";
import { useProductCategory } from "@/hooks/tanstack/useProductCategory";

interface DeleteProps {
  category: ProductCategory;
}

export default function Delete({ category }: DeleteProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { deleteCategory, isDeleting: pending } = useProductCategory();

  const handleDelete = async () => {
    const result = await deleteCategory(category.id);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    setOpen(false);
    router.refresh();
    toast.success(result.message);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon" disabled={category.isDefault} aria-label="delete trigger">
          <FaTrash />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Category {category.name}</DialogTitle>
          <DialogDescription>
            Delete <b>{category.name}</b>, this action cannot be undone, are you sure?
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 mt-4">
          <Button variant="destructive" type="button" disabled={pending} onClick={handleDelete} className="w-28">
            {pending && <Spinner />}
            Delete
          </Button>
          <DialogClose asChild>
            <Button type="button" className="w-28">
              Cancel
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

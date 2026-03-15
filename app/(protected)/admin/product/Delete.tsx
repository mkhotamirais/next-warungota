"use client";

import { ProductProps } from "@/types/product";
import React, { useState } from "react";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// import { deleteProduct } from "@/actions/product";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useProduct } from "@/hooks/tanstack/useProduct";

interface DeleteProps {
  product: ProductProps;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Delete({ product, setOpen }: DeleteProps) {
  const [openDialog, setOpenDialog] = useState(false);

  const router = useRouter();
  const { deleteProduct, isDeleting: pending } = useProduct();

  const handleDelete = async () => {
    const result = await deleteProduct(product.slug);

    if (result?.error) {
      toast.error(result.error);
      return;
    }
    setOpen(false);
    setOpenDialog(false);
    toast.success(result.message);
    router.refresh();
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} className="flex-1 text-red-500 hover:text-red-400 justify-start w-full px-2">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete Product <b>{product.name}</b>
          </DialogTitle>
          <DialogDescription>
            Delete <b>{product.name}</b>, this action cannot be undone, are you sure?
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mt-4">
          <Button type="button" variant="destructive" disabled={pending} onClick={handleDelete} className="w-28">
            {pending && <Spinner />}
            Delete
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="w-28">
              Cancel
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

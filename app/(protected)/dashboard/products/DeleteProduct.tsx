"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Trash } from "lucide-react";
import { deleteDoc, doc } from "firebase/firestore";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { IProduct } from "@/lib/types";
import { firestore } from "@/lib/firebase";
import { useProductStore } from "@/lib/hooks/useProductStore";

export default function DeleteProduct({ product }: { product: IProduct }) {
  const { products, setProducts } = useProductStore();
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    setPending(true);
    try {
      await deleteDoc(doc(firestore, "posts", product.id));
      toast.success(`Delete ${product.name} success!`);
      setProducts(products.filter((p: IProduct) => p.id !== product.id));
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="destructive" aria-label="Delete">
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete <span className="italic text-destructive">{product.name}</span>, Are you absolutely sure?
          </DialogTitle>
          <DialogDescription>This action cannot be undone!</DialogDescription>
          <div className="inline-flex justify-center sm:justify-start gap-2">
            <Button disabled={pending} variant="destructive" onClick={onDelete}>
              {pending && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              Delete
            </Button>
            <DialogClose asChild>
              <Button disabled={pending} variant="outline" size={"sm"}>
                Cancel
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

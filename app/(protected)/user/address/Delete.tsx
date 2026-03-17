"use client";

import { Address } from "@/lib/generated/prisma";
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
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAddress } from "@/hooks/tanstack/useAddress";

interface IDelete {
  address: Address;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Delete({ address, setOpen }: IDelete) {
  const [openDialog, setOpenDialog] = useState(false);
  const { deleteAddress, isDeleting: pending } = useAddress();
  const router = useRouter();

  const handleDelete = async () => {
    const result = await deleteAddress(address.id);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success(result.message);
    setOpen(false);
    setOpenDialog(false);
    router.refresh();
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} className="text-red-500 hover:text-red-400 justify-start w-full px-2 h-8">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete <b>{address.label}</b>
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <p>This action cannot be undone, are you sure?</p>
        <div className="flex gap-2 mt-2">
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

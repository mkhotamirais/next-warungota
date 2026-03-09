import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTodo3 } from "./useTodo3";

interface Props {
  checkedLength: number;
  todosLength: number;
}

export default function DeleteAllChecked({ checkedLength, todosLength }: Props) {
  const { delChecked } = useTodo3();

  const deleteChecked = () => {
    delChecked();
  };

  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="py-1.5 px-2 h-full w-full text-left">Delete Checked</DialogTrigger>
      <DialogContent>
        <DialogTitle>
          Delete <i>{checkedLength}</i> of <i>{todosLength}</i>
        </DialogTitle>
        <DialogDescription className="">Are you sure? this action cannot be undone!</DialogDescription>
        <div className="flex gap-2 mt-4">
          <Button variant={"destructive"} onClick={() => deleteChecked()}>
            Delete
          </Button>
          <DialogClose asChild>
            <Button variant={"ghost"}>Cancel</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

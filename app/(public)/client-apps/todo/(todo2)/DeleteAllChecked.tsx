import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Todo2Context } from "./Provider";
import { toast } from "sonner";

interface Props {
  checkedLength: number;
  todosLength: number;
}

export default function DeleteAllChecked({ checkedLength, todosLength }: Props) {
  const context = useContext(Todo2Context);
  if (!context) throw Error("Data must be used");
  const { todos, dispatch } = context;

  const [open, setOpen] = useState(false);

  const deleteChecked = () => {
    const checked = todos.filter((t) => t.checked);
    if (checked.length === todos.length) {
      toast.success(`Delete all data success, total deleted ${todos.length} data`);
    } else {
      toast.success(`Delete ${todos.length - checked.length} data success`);
    }
    dispatch({ type: "DELETE_CHECKED" });
  };
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

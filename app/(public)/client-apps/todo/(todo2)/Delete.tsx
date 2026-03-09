import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useContext, useState } from "react";
import { InitialTodo } from "../types";
import { Button } from "@/components/ui/button";
import { Todo2Context } from "./Provider";
import { toast } from "sonner";

export default function Delete({ todo }: { todo: InitialTodo }) {
  const context = useContext(Todo2Context);
  if (!context) throw Error("Data must be used");
  const { dispatch } = context;

  const deleteTodo = () => {
    dispatch({ type: "DELETE", payload: todo.id });
    toast.success(`Delete ${todo.text} success`);
  };

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="py-1.5 px-2 h-full w-full text-left">Delete</DialogTrigger>
      <DialogContent>
        <DialogTitle>
          Delete <i>{todo.text}</i>
        </DialogTitle>
        <DialogDescription className="">Are you sure? this action cannot be undone!</DialogDescription>
        <div className="flex gap-2 mt-4">
          <Button variant={"destructive"} onClick={deleteTodo}>
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

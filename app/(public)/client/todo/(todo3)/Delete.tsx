import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { InitialTodo } from "../types";
import { Button } from "@/components/ui/button";
import { useTodo3 } from "./useTodo3";
import { toast } from "sonner";

interface Props {
  todo: InitialTodo;
}

export default function Delete({ todo }: Props) {
  const { delTodo } = useTodo3();

  const deleteTodo = () => {
    delTodo(todo.id);
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

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

interface Props {
  todo: InitialTodo;
  deleteTodo: (id: string) => void;
}

export default function Delete({ todo, deleteTodo }: Props) {
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
          <Button variant={"destructive"} onClick={() => deleteTodo(todo.id)}>
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

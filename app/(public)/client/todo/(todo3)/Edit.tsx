"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useRef, useState } from "react";
import { InitialTodo } from "../types";
import { useTodo3 } from "./useTodo3";
import { toast } from "sonner";

interface Props {
  todo: InitialTodo;
}

export default function Edit({ todo }: Props) {
  const { todos, editTodo, isEdit, setIsEdit } = useTodo3();

  const [newText, setNewText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEdit === todo.id) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isEdit, todo.id]);

  const updateTodo = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newText = e.target.text.value;
    const id = todo.id;

    if (!newText) return toast.error(`Input required`);
    const duplicate = todos.find((t) => t.text.toLowerCase() === newText.toLowerCase() && t.id !== id);
    if (duplicate) return toast.error(`Todo "${newText}" registered`);

    editTodo(id, newText);

    setIsEdit(null);
    toast.success(`Update ${newText} success`);
  };

  return (
    <form onSubmit={updateTodo} className="w-full flex justify-between gap-1 items-center">
      <input type="hidden" name="id" value={todo.id} />
      <Input
        ref={inputRef}
        value={newText}
        id="text"
        name="text"
        onChange={(e) => setNewText(e.target.value)}
        className="w-full"
      />
      <div className="flex gap-1">
        <Button type="submit" size={"sm"}>
          Save
        </Button>
        <Button type="button" variant={"secondary"} size={"sm"} onClick={() => setIsEdit(null)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

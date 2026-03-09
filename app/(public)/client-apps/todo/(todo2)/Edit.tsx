"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useContext, useEffect, useRef, useState } from "react";
import { InitialTodo } from "../types";
import { Todo2Context } from "./Provider";
import { toast } from "sonner";

interface Props {
  todo: InitialTodo;
}

export default function Edit({ todo }: Props) {
  const context = useContext(Todo2Context);
  if (!context) throw Error("Data must be used");
  const { todos, dispatch, isEdit, setIsEdit } = context;

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
    const text = e.target.text.value;
    const id = todo.id;

    if (!newText) return toast.error(`Input required`);
    const duplicate = todos.find((t) => t.text.toLowerCase() === newText.toLowerCase() && t.id !== id);
    if (duplicate) return toast.error(`Todo "${newText}" registered`);

    dispatch({ type: "UPDATE", payload: { id, text } });

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
        <Button
          type="button" // Pastikan type button agar tidak trigger submit
          variant={"secondary"}
          size={"sm"}
          onClick={() => setIsEdit(null)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

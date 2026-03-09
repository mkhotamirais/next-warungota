"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useRef, useState } from "react";
import { InitialTodo } from "../types";

interface Props {
  todo: InitialTodo;
  isEdit: string | null;
  setIsEdit: React.Dispatch<React.SetStateAction<string | null>>;
  updateTodo: (e: React.SubmitEvent<HTMLFormElement>) => void;
}

export default function Edit({ todo, isEdit, setIsEdit, updateTodo }: Props) {
  const [newText, setNewText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEdit === todo.id) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isEdit, todo.id]);

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

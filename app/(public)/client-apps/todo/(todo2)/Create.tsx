"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContext } from "react";
import { Todo2Context } from "./Provider";
import { toast } from "sonner";

export default function Create() {
  const context = useContext(Todo2Context);
  if (!context) throw Error("Data must be used");
  const { todos, dispatch, text, setText } = context;

  const createTodo = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return toast.error(`Input required`);

    const duplicate = todos.find((t) => t.text.toLowerCase() === text.toLowerCase());
    if (duplicate) return toast.error(`Todo "${text}" registered`);

    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();

    dispatch({
      type: "CREATE",
      payload: { id: `${Date.now()}`, text, checked: false, createdAt, updatedAt },
    });
    setText("");

    e.target.reset();
    toast.success(`Create ${text} success`);
  };

  return (
    <div>
      <h3>Add Todo</h3>
      <form onSubmit={createTodo} className="flex gap-2 items-center">
        <Input value={text} id="text" placeholder="Create todo" onChange={(e) => setText(e.target.value)} />
        <Button>Add Todo</Button>
      </form>
    </div>
  );
}

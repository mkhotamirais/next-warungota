"use client";

import { useState } from "react";
import { InitialTodo } from "../types";
import { Button } from "@/components/ui/button";
import Create from "./Create";
import { toast } from "sonner";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Edit from "./Edit";
import Delete from "./Delete";
import DeleteAllChecked from "./DeleteAllChecked";

export default function Todo1() {
  const [todos, setTodos] = useState<InitialTodo[]>(() => {
    if (typeof window !== "undefined") {
      const storage = localStorage.getItem("todo1");
      return storage ? JSON.parse(storage) : [];
    }
    return [];
  });
  const [text, setText] = useState("");
  const [isEdit, setIsEdit] = useState<string | null>(null);
  const [checkedAll, setCheckedAll] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const storage = localStorage.getItem("todo1");
      return storage ? JSON.parse(storage).some((t: InitialTodo) => t.checked) : false;
    }
    return false;
  });
  // const [delCheck, setDelCheck] = useState(false);

  const checkedLength = todos.filter((t) => t.checked).length;
  const todosLength = todos.length;

  const setResult = (result: InitialTodo[]) => {
    setTodos(result);
    localStorage.setItem("todo1", JSON.stringify(result));
  };

  const createTodo = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = e.target.text.value;

    if (!text) return toast.error(`Input required`);

    const duplicate = todos.find((t) => t.text.toLowerCase() === text.toLowerCase());
    if (duplicate) return toast.error(`Todo "${text}" registered`);

    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    const result = [...todos, { id: `${Date.now()}`, text, checked: false, createdAt, updatedAt }];
    setResult(result);

    setText("");
    e.target.reset();
    toast.success(`Create ${text} success`);
  };

  const updateTodo = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const target = e.currentTarget as typeof e.currentTarget & {
      id: { value: string };
      text: { value: string };
    };
    const newText = target.text.value;
    const id = target.id.value;

    if (!newText) return toast.error(`Input required`);
    const duplicate = todos.find((t) => t.text.toLowerCase() === newText.toLowerCase() && t.id !== id);
    if (duplicate) return toast.error(`Todo "${newText}" registered`);

    const others = todos.filter((t) => t.id !== id);
    const match = todos.find((t) => t.id === id);
    if (match && newText) {
      match.text = newText;
      match.updatedAt = new Date().toISOString();
      const result = [...others, match];
      setResult(result);
      setIsEdit(null);
    }

    setIsEdit(null);
    toast.success(`Update ${newText} success`);
  };

  const deleteTodo = (id: string) => {
    const result = todos.filter((t) => t.id !== id);
    setResult(result);
    toast.success(`Delete todo success`);
  };

  const checkTodo = (id: string) => {
    setIsEdit(null);
    const result = todos.map((t) => (t.id === id ? { ...t, checked: !t.checked } : t));
    setResult(result);
    if (result.filter((t) => t.checked).length === result.length) setCheckedAll(true);
    else setCheckedAll(false);
  };

  const checkAll = () => {
    setIsEdit(null);
    setCheckedAll((prev) => !prev);
    const result = todos.map((t) => (checkedAll ? { ...t, checked: false } : { ...t, checked: true }));
    setResult(result);
  };

  const deleteChecked = () => {
    const checked = todos.filter((t) => t.checked);
    if (checked.length === todos.length) {
      toast.success(`Delete all data success, total deleted ${todos.length} data`);
    } else {
      toast.success(`Delete ${todos.length - checked.length} data success`);
    }
    setResult(checked);
  };

  return (
    <div className="border rounded-xl p-4">
      <h2 className="mt-0 mb-0">Todo1</h2>
      <p className="text-muted-foreground">useState, useEffect, useRef</p>
      <Create createTodo={createTodo} text={text} setText={setText} />
      <div>
        <h3>Todo List</h3>
        {todos?.length && todos?.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-2 border-b pb-2 pl-3">
              <div>
                <input
                  title="checkAll"
                  type="checkbox"
                  id="checkAllData"
                  checked={checkedAll}
                  className="mr-2"
                  onChange={checkAll}
                />
                <label htmlFor="checkAllData" className="font-semibold py-2 text-sm">
                  Check All
                </label>
              </div>
              {checkedLength > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"outline"} size={"icon"}>
                      <MoreVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    onCloseAutoFocus={(e) => {
                      if (isEdit) e.preventDefault();
                    }}
                  >
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={(e) => e.preventDefault()}
                      className="p-0 rounded-md"
                    >
                      <DeleteAllChecked
                        checkedLength={checkedLength}
                        todosLength={todosLength}
                        deleteChecked={deleteChecked}
                      />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            {todos
              .sort((t1, t2) => t2.updatedAt.localeCompare(t1.updatedAt))
              .map((todo) => (
                <div key={todo.id} className="mb-2 flex gap-1 items-center w-full justify-between">
                  <div className="w-full">
                    {isEdit === todo.id ? (
                      <Edit todo={todo} isEdit={isEdit} setIsEdit={setIsEdit} updateTodo={updateTodo} />
                    ) : (
                      <div className="border rounded-lg flex px-3">
                        <input
                          disabled={isEdit === todo.id}
                          title="input todo1"
                          type="checkbox"
                          checked={todo.checked}
                          onChange={() => checkTodo(todo.id)}
                        />
                        <span
                          className="py-2 px-3 text-sm inline-block w-full cursor-text"
                          onClick={() => setIsEdit(todo.id)}
                        >
                          {todo.text}
                        </span>
                      </div>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={"outline"} size={"icon"}>
                        <MoreVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      onCloseAutoFocus={(e) => {
                        if (isEdit) e.preventDefault();
                      }}
                    >
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          setIsEdit(todo.id);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={(e) => e.preventDefault()}
                        className="p-0 rounded-md"
                      >
                        <Delete todo={todo} deleteTodo={deleteTodo} />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
          </>
        ) : (
          <div>No data</div>
        )}
      </div>
    </div>
  );
}

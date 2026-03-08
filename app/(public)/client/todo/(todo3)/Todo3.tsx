"use client";

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
import { useTodo3 } from "./useTodo3";
import Create from "./Create";
import { Button } from "@/components/ui/button";

export default function Todo3() {
  const { todos, isEdit, toggleCheck, setIsEdit, checkAllTodo, checkedAll, setCheckedAll } = useTodo3();

  const checkedLength = todos.filter((t) => t.checked).length;
  const todosLength = todos.length;

  const checkTodo = (id: string) => {
    setIsEdit(null);
    const result = todos.map((t) => (t.id === id ? { ...t, checked: !t.checked } : t));
    if (result.filter((t) => t.checked).length === result.length) setCheckedAll(true);
    else setCheckedAll(false);
    toggleCheck(id);
  };

  const checkAll = () => {
    setIsEdit(null);
    setCheckedAll(!checkAll);
    checkAllTodo(checkedAll);
  };

  return (
    <div className="border rounded-xl p-4">
      <h2 className="mt-0 mb-0">Todo3</h2>
      <p className="text-muted-foreground">zustand</p>
      <Create />
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
                      <DeleteAllChecked checkedLength={checkedLength} todosLength={todosLength} />
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
                      <Edit todo={todo} />
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
                        <Delete todo={todo} />
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

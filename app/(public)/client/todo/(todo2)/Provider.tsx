"use client";

import React, { createContext, Dispatch, useReducer, useState } from "react";
import { InitialTodo } from "../types";

type Actions =
  | { type: "CREATE"; payload: InitialTodo }
  | { type: "DELETE"; payload: string }
  | { type: "TOGGLE_CHECK"; payload: string }
  | { type: "UPDATE"; payload: { id: string; text: string } }
  | { type: "CHECK_ALL"; payload: boolean }
  | { type: "DELETE_CHECKED" };

interface TodoContextProps {
  todos: InitialTodo[];
  dispatch: Dispatch<Actions>;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  isEdit: string | null;
  setIsEdit: React.Dispatch<React.SetStateAction<string | null>>;
  checkedAll: boolean;
  setCheckedAll: React.Dispatch<React.SetStateAction<boolean>>;
}

const setLocal = (result: InitialTodo[]) => {
  localStorage.setItem("todo2", JSON.stringify(result));
};

const todoReducer = (state: InitialTodo[], action: Actions): InitialTodo[] => {
  switch (action.type) {
    case "CREATE": {
      const result = [...state, action.payload];
      setLocal(result);
      return result;
    }
    case "DELETE": {
      const result = state.filter((todo) => todo.id !== action.payload);
      setLocal(result);
      return result;
    }
    case "TOGGLE_CHECK": {
      const result = state.map((todo) => (todo.id === action.payload ? { ...todo, checked: !todo.checked } : todo));
      setLocal(result);
      return result;
    }
    case "UPDATE": {
      const updatedAt = new Date().toISOString();
      const result = state.map((todo) =>
        todo.id === action.payload.id ? { ...todo, text: action.payload.text, updatedAt } : todo,
      );
      setLocal(result);
      return result;
    }
    case "CHECK_ALL": {
      const result = state.map((todo) => (action.payload ? { ...todo, checked: false } : { ...todo, checked: true }));
      setLocal(result);
      return result;
    }
    case "DELETE_CHECKED": {
      const result = state.filter((todo) => !todo.checked);
      setLocal(result);
      return result;
    }
    default:
      return state;
  }
};

let initialTodo: InitialTodo[];
const storage = localStorage.getItem("todo2");
if (storage) {
  initialTodo = JSON.parse(storage) || [];
} else initialTodo = [];

export const Todo2Context = createContext<TodoContextProps | undefined>(undefined);

export default function Todo2Provider({ children }: { children: React.ReactNode }) {
  const [todos, dispatch] = useReducer(todoReducer, initialTodo);
  const [text, setText] = useState("");
  const [isEdit, setIsEdit] = useState<string | null>(null);
  const [checkedAll, setCheckedAll] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const storage = localStorage.getItem("todo1");
      return storage ? JSON.parse(storage).some((t: InitialTodo) => t.checked) : false;
    }
    return false;
  });

  return (
    <Todo2Context.Provider value={{ todos, dispatch, text, setText, isEdit, setIsEdit, checkedAll, setCheckedAll }}>
      {children}
    </Todo2Context.Provider>
  );
}

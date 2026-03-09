import { create } from "zustand";
import { InitialTodo } from "../types";

interface TodoState {
  text: string;
  setText: (text: string) => void;
  todos: InitialTodo[];
  setTodos: (todos: InitialTodo[]) => void;
  isEdit: string | null;
  setIsEdit: (isEdit: string | null) => void;
  addTodo: (text: string) => void;
  delTodo: (id: string) => void;
  toggleCheck: (id: string) => void;
  editTodo: (id: string, text: string) => void;
  checkedAll: boolean;
  setCheckedAll: (checkedAll: boolean) => void;
  checkAllTodo: (check: boolean) => void;
  delChecked: () => void;
}

const setLocal = (todo: InitialTodo[]) => {
  localStorage.setItem("todo3", JSON.stringify(todo));
};

let todos: InitialTodo[];
let checkedAll: boolean;
const storage = localStorage.getItem("todo3");
if (storage) {
  todos = JSON.parse(storage);
  checkedAll = todos.some((t: InitialTodo) => t.checked);
} else todos = [];

export const useTodo3 = create<TodoState>((set) => ({
  text: "",
  setText: (text) => set({ text }),
  todos,
  isEdit: null,
  setIsEdit: (isEdit) => set({ isEdit }),
  setTodos: (todos) => set({ todos }),
  addTodo: (text) => {
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    const newTodo = { id: `${Date.now()}`, text, checked: false, createdAt, updatedAt };
    set((state) => {
      const result = [...state.todos, newTodo];
      setLocal(result);
      return { todos: result };
    });
  },
  delTodo: (id) => {
    set((state) => {
      const result = state.todos.filter((t) => t.id !== id);
      setLocal(result);
      return { todos: result };
    });
  },
  toggleCheck: (id) => {
    set((state) => {
      const result = state.todos.map((t) => (t.id === id ? { ...t, checked: !t.checked } : t));
      setLocal(result);
      return { todos: result };
    });
  },
  editTodo: (id, text) => {
    const updatedAt = new Date().toISOString();
    set((state) => {
      const result = state.todos.map((t) => (t.id === id ? { ...t, text, updatedAt } : t));
      setLocal(result);
      return { todos: result };
    });
  },
  checkedAll,
  setCheckedAll: (checkedAll) => set({ checkedAll }),
  checkAllTodo: (check) => {
    set((state) => {
      const result = state.todos.map((t) => (check ? { ...t, checked: false } : { ...t, checked: true }));
      setLocal(result);
      return { todos: result };
    });
  },
  delChecked: () => {
    set((state) => {
      const result = state.todos.filter((t) => !t.checked);
      setLocal(result);
      return { todos: result };
    });
  },
}));

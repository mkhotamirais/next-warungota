import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTodo3 } from "./useTodo3";
import { toast } from "sonner";

export default function Create() {
  const { todos, addTodo, text, setText } = useTodo3();

  const createTodo = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return toast.error(`Input required`);

    const duplicate = todos.find((t) => t.text.toLowerCase() === text.toLowerCase());
    if (duplicate) return toast.error(`Todo "${text}" registered`);

    addTodo(text);
    toast.success(`Create ${text} success`);
    setText("");
    e.target.reset();
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

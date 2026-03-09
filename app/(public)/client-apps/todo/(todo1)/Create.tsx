import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  createTodo: (e: React.SubmitEvent<HTMLFormElement>) => void;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
}
export default function Create({ createTodo, text, setText }: Props) {
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

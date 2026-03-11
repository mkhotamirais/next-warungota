import { CodeBlockWithCopy } from "@/components/ui/custom/CodeBlockWithCopy";
import UsingMultiInput from "./UsingMultiInput";
import UsingMultiSelect from "./UsingMultiSelect";
import Link from "next/link";

export default function Components() {
  return (
    <div>
      <div className="container">
        <div className="prose">
          <h1>Components</h1>
          <div>
            <h2>Multi Input</h2>
            <UsingMultiInput />
          </div>
          <div>
            <h2>Codeblock Copy</h2>
            <CodeBlockWithCopy code={`npx create-next-app@latest`} />
          </div>
          <div>
            <h2>Multi Select</h2>
            <UsingMultiSelect />
          </div>
          <div>
            <h2>Pagination</h2>
            <Link href="/public-api/dummyjson">Lihat Dummyjson</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

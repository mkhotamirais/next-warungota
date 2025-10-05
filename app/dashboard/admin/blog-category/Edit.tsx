import Input from "@/components/form/Input";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { FaCheck, FaSpinner, FaXmark } from "react-icons/fa6";
import { BlogCategory } from "@prisma/client";
import { useBlogCategory } from "@/hooks/useBlogCategory";

interface EditProps {
  category: BlogCategory;
  setIsEdit: Dispatch<SetStateAction<string | null>>;
}

export default function Edit({ category, setIsEdit }: EditProps) {
  const [name, setName] = useState(category.name);
  const [pending, startTransition] = useTransition();
  const { setErrorMsg, setSuccessMsg, errors, setErrors } = useBlogCategory();
  const router = useRouter();

  const cancelEdit = () => {
    setIsEdit(null);
    setName(category.name);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const res = await fetch(`/api/blog-category/${category.id}`, { method: "PATCH", body: JSON.stringify({ name }) });
      const result = await res.json();

      if (result?.errors || result?.error || result?.message) {
        setErrors(undefined);
        setErrorMsg(null);
        setSuccessMsg(null);
      }

      if (result?.errors) {
        setErrors(result.errors.properties);
        return;
      }

      if (result?.error) {
        setErrorMsg(result.error);
        return;
      }
      setSuccessMsg(result.message);
      setName(name);
      setIsEdit(null);

      router.refresh();
    });
  };

  return (
    <form onSubmit={handleUpdate} className="flex gap-2 items-center w-full">
      <input type="hidden" name="id" value={category.id} />
      <Input
        id="name"
        label=""
        placeholder="Blog Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus={true}
        error={errors?.name?.errors}
        className="w-full !py-1 !mb-1"
      />
      <div className="flex gap-2">
        <button type="submit" disabled={pending} aria-label="Save" className="border rounded p-2 text-green-500">
          {pending ? <FaSpinner className="animate-spin" /> : <FaCheck />}
        </button>
        <button type="button" onClick={cancelEdit} className="border rounded p-2 text-red-500" aria-label="Cancel">
          <FaXmark />
        </button>
      </div>
    </form>
  );
}

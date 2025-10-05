"use client";

import { useState } from "react";
import { FaPenToSquare } from "react-icons/fa6";
import Edit from "./Edit";
import Delete from "./Delete";
import { BlogCategory } from "@prisma/client";
import Msg from "@/components/form/Msg";
import { useBlogCategory } from "@/hooks/useBlogCategory";

export default function List({ blogCategories }: { blogCategories: BlogCategory[] | undefined }) {
  const [isEdit, setIsEdit] = useState<string | null>(null);

  const { successMsg, errorMsg } = useBlogCategory();

  if (!blogCategories?.length) return <h2 className="h2">No Blog Category</h2>;

  return (
    <div>
      {successMsg ? <Msg msg={successMsg} /> : null}
      {errorMsg ? <Msg msg={errorMsg} error /> : null}

      <h2 className="h2 mb-4">Blog Category List</h2>
      {blogCategories?.map((category) => (
        <div key={category.id} className="flex items-center gap-2 mb-1">
          <div className="w-full">
            {isEdit === category.id ? (
              <Edit category={category} setIsEdit={setIsEdit} />
            ) : (
              <div
                className="border py-2 px-3 rounded border-gray-200 w-full cursor-text"
                onClick={() => {
                  if (!category.isDefault) setIsEdit(category.id);
                }}
              >
                {category.name}
              </div>
            )}
          </div>
          {isEdit !== category.id ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Edit"
                className="text-blue-500 p-2 border rounded disabled:opacity-50"
                onClick={() => setIsEdit(category?.id)}
                disabled={category.isDefault}
              >
                <FaPenToSquare />
              </button>
              <Delete category={category} />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

"use client";

import { useState } from "react";
import { FaPenToSquare } from "react-icons/fa6";
import Edit from "./Edit";
import Delete from "./Delete";
import { ProductTag } from "@prisma/client";
import Msg from "@/components/form/Msg";
import { useProductTag } from "@/hooks/useProductTag";

export default function List({ productTags }: { productTags: ProductTag[] | undefined }) {
  const [isEdit, setIsEdit] = useState<string | null>(null);

  const { successMsg, errorMsg } = useProductTag();

  if (!productTags?.length) return <h2 className="h2">No Product Tag</h2>;

  return (
    <div>
      {successMsg ? <Msg msg={successMsg} /> : null}
      {errorMsg ? <Msg msg={errorMsg} error /> : null}

      <h2 className="h2 mb-4">Product Tag List</h2>
      {productTags?.map((tag) => (
        <div key={tag.id} className="flex items-center gap-2 mb-1">
          <div className="w-full">
            {isEdit === tag.id ? (
              <Edit tag={tag} setIsEdit={setIsEdit} />
            ) : (
              <div className="border py-2 px-3 rounded border-gray-200 w-full cursor-text">{tag.name}</div>
            )}
          </div>
          {isEdit !== tag.id ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Edit"
                className="text-blue-500 p-2 border rounded disabled:opacity-50"
                onClick={() => setIsEdit(tag?.id)}
              >
                <FaPenToSquare />
              </button>
              <Delete tag={tag} />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { LuSearch } from "react-icons/lu";
import Input from "../form/Input";
import { useRouter } from "next/navigation";

export default function SearchAllProducts() {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!keyword || keyword === "") {
      router.replace("/");
    } else {
      router.push(`/search?keyword=${keyword}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <Input
        // ref={searchInputRef}
        label=""
        id="keyword"
        type="search"
        placeholder="Search"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        autoFocus={true}
        className="w-full !mb-1"
      />
      <div className="">
        <button type="submit" aria-label="search all" className="border p-2.5 rounded text-primary">
          <LuSearch />
        </button>
      </div>
    </form>
  );
}

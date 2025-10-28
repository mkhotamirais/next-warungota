"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import Modal, { ModalClose } from "../ui/Modal";
import Input from "../form/Input";

export default function SearchBtn() {
  const [keyword, setKeyword] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const searchInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (modalOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [modalOpen]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!keyword || keyword === "") {
      router.replace("/");
    } else {
      router.push(`/search?keyword=${keyword}`);
    }
  };

  return (
    <div className="">
      <Modal
        modalOpen={modalOpen}
        onModalOpenChange={setModalOpen}
        trigger={<LuSearch />}
        title="Cari Semua"
        ariaLabel="search"
      >
        <form onSubmit={handleSubmit} className="flex items-center">
          <Input
            ref={searchInputRef}
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
            <ModalClose asChild>
              <button type="submit" aria-label="search all" className="border p-2.5 rounded text-primary">
                <LuSearch />
              </button>
            </ModalClose>
          </div>
        </form>
      </Modal>
    </div>
  );
}

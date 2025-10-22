"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import Modal, { ModalClose } from "../ui/Modal";
import Input from "../form/Input";
import Button from "../ui/Button";

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

    router.push(`/search?keyword=${keyword}`);
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
        <form onSubmit={handleSubmit}>
          <Input
            ref={searchInputRef}
            label=""
            id="keyword"
            type="text"
            placeholder="Search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            autoFocus={true}
          />
          <div className="flex justify-end">
            <ModalClose asChild>
              <Button type="submit" aria-label="search all" icon={<LuSearch />} className="btn btn-primary">
                Cari
              </Button>
            </ModalClose>
          </div>
        </form>
      </Modal>
    </div>
  );
}

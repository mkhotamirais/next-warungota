"use client";

import Button from "@/components/ui/Button";
import { useGlobal } from "@/hooks/useGlobal";
import { capitalize } from "@/lib/utils";
import { Address } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { HiDotsVertical } from "react-icons/hi";
import Delete from "./Delete";

interface AddressCardProps {
  address: Address;
}

export default function AddressCard({ address }: AddressCardProps) {
  const village = address.village.split("-")[1];
  const district = address.district.split("-")[1];
  const regency = address.regency.split("-")[1];
  const province = address.province.split("-")[1];
  const fullAddress = `${address.street}, DESA/KEL ${village}, KEC. ${district}, ${regency}, PROV. ${province}, ${address.postalCode}`;
  const { setOpenLayer, openMoreAddressOption, setOpenMoreAddressOption } = useGlobal();

  const router = useRouter();

  const openMoreOptions = (id: string) => {
    setOpenMoreAddressOption(id);
    setOpenLayer(true);
  };

  const closeMoreOptions = () => {
    setOpenMoreAddressOption(null);
    setOpenLayer(false);
  };

  const editAddress = () => {
    closeMoreOptions();
    router.push(`/dashboard/account/address/edit-address/${address.id}`);
  };

  return (
    <div className="relative border p-2 rounded border-gray-300 mb-2">
      <div className="w-full">
        <div>
          <span>{address.label}</span>{" "}
          <span className="text-primary text-sm">{address.isDefault ? "(Default Address)" : ""}</span>
        </div>
        <div>
          {address.recipient} - {address.phone}
        </div>
        <address className="">{capitalize(fullAddress)}</address>
      </div>
      <div className="absolute right-1 top-1">
        <button
          onClick={() => openMoreOptions(address.id)}
          type="button"
          className="p-2 m-2 h-full hover:bg-gray-200 rounded"
          aria-label="more"
        >
          <HiDotsVertical />
        </button>
        <div
          className={`${
            openMoreAddressOption === address.id ? "visible opacity-100" : "invisible opacity-0"
          } absolute flex flex-col gap-1 top-full right-0 bg-white border border-gray-300 rounded p-2 z-50`}
        >
          <Button onClick={editAddress}>Edit</Button>
          <Delete address={address} closeMoreOptions={closeMoreOptions} />
        </div>
      </div>
    </div>
  );
}

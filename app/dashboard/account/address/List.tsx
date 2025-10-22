"use client";

import { Address } from "@prisma/client";
import React from "react";
import AddressCard from "./AddressCard";

interface ListProps {
  addresses: Address[];
}

export default function List({ addresses }: ListProps) {
  return (
    <div>
      {addresses?.map((address) => (
        <AddressCard key={address.id} address={address} />
      ))}
    </div>
  );
}

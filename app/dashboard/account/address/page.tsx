import { getUserAddresses } from "@/actions/address";
import Button from "@/components/ui/Button";
import Link from "next/link";
import React from "react";
import List from "./List";

export default async function AccountAddress() {
  const addresses = await getUserAddresses();

  const defaultAddressToFirst = [...addresses].sort((a, b) => {
    if (a.isDefault === b.isDefault) return 0;
    return a.isDefault ? -1 : 1;
  });

  return (
    <div className="space-y-4">
      <Button as={Link} href={"/dashboard/account/address/create-address"}>
        Add Address
      </Button>
      <div>
        <List addresses={defaultAddressToFirst} />
      </div>
    </div>
  );
}

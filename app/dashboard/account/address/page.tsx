import { getUserAddresses } from "@/actions/address";
import Button from "@/components/ui/Button";
import Link from "next/link";
import React from "react";

export default async function AccountAddress() {
  const addresses = await getUserAddresses();
  console.log(addresses);
  return (
    <div>
      <p>Address List</p>
      <Button as={Link} href={"/dashboard/account/address/create-address"}>
        Add Address
      </Button>
      <div></div>
    </div>
  );
}

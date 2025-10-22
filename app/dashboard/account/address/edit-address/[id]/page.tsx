import React, { Suspense } from "react";
import EditAddressForm from "./EditAddressForm";
import { getUserAddressById } from "@/actions/address";
import { redirect } from "next/navigation";

export default async function EditAddress({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const address = await getUserAddressById(id);

  if (!address) redirect("/dashboard/account/address");

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditAddressForm address={address} />
      </Suspense>
    </div>
  );
}

"use client";

import { useAddressDetail } from "@/hooks/tanstack/useAddress";
import { useParams } from "next/navigation";
import EditAddressForm from "./EditAddressForm";
import Load from "@/components/fallbacks/Load";

export default function EditAddressWrapper() {
  const params = useParams();
  const id = params.id as string;
  const { data: address, isPending } = useAddressDetail(id);

  if (isPending) return <Load />;

  return <EditAddressForm key={address?.id} address={address} />;
}

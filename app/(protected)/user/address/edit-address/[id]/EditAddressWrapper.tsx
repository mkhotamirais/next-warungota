"use client";

import { useAddressDetail } from "@/hooks/tanstack/useAddress";
import EditAddressForm from "./EditAddressForm";
import Load from "@/components/fallbacks/Load";

export default function EditAddressWrapper({ id }: { id: string }) {
  const { data: address, isPending } = useAddressDetail(id);

  if (isPending) return <Load />;

  return <EditAddressForm key={address?.id} address={address} />;
}

"use client";

import { useAddress } from "@/hooks/tanstack/useAddress";
import List from "./List";
import AuthTitleHeader from "../../AuthTitleHeader";

export default function BasePage({ page, limit }: { page: number; limit: number }) {
  const { data } = useAddress({ page, limit });
  const { addresses, totalPages, totalAddressCount } = data || {};

  if (!addresses) return null;

  return (
    <>
      <AuthTitleHeader
        title="Address List"
        totalCount={totalAddressCount}
        url="/user/address/create-address"
        label="Create Address"
      />
      <List
        addresses={addresses}
        limit={limit}
        page={page}
        totalPages={totalPages}
        totalAddresssCount={totalAddressCount}
      />
    </>
  );
}

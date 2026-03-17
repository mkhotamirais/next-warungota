"use client";

import { Address } from "@/lib/generated/prisma";
import { capitalize } from "@/lib/utils";
import { HiDotsVertical } from "react-icons/hi";
import Delete from "./Delete";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";

interface AddressCardProps {
  address: Address;
}

export default function AddressCard({ address }: AddressCardProps) {
  const village = address.village.split("-")[1];
  const district = address.district.split("-")[1];
  const regency = address.regency.split("-")[1];
  const province = address.province.split("-")[1];
  const fullAddress = `${address.street}, DESA/KEL ${village}, KEC. ${district}, ${regency}, PROV. ${province}, ${address.postalCode}`;
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const isUserAddressPath = pathname.startsWith("/user/address");

  return (
    <div className="flex justify-between rounded border-gray-300 mb-2">
      <div className="w-full">
        <div>
          <span className="capitalize">{address.label}</span>{" "}
          {isUserAddressPath && (
            <span className="capitalize text-primary text-sm">{address.isDefault ? "(Default Address)" : ""}</span>
          )}
        </div>
        <div>
          {address.recipient} - {address.phone}
        </div>
        <address className="text-muted-foreground text-sm">{capitalize(fullAddress)}</address>
        <Separator className="mt-2" />
      </div>
      {isUserAddressPath && (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" type="button" aria-label="more" size="sm">
              <HiDotsVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/user/address/edit-address/${address.id}`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Delete address={address} setOpen={setOpen} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

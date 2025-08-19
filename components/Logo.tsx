import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image src="/logo-warungota.png" alt="logo" width={32} height={32} className="h-10 w-auto" />
      <span className="font-bold text-lg tracking-tighter">WarungOta</span>
    </Link>
  );
}

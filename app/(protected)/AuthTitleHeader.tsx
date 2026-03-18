"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import AsideMenuMobile from "./AsideMenuMobile";
import { usePathname } from "next/navigation";
import RefreshData from "./RefreshData";

interface AuthTitleHeaderProps {
  title: string;
  totalCount?: string | number;
  url?: string;
  label?: string;
}

export default function AuthTitleHeader({ title, totalCount, url, label }: AuthTitleHeaderProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2 items-center justify-between mb-4 w-full">
      <div className="flex items-center gap-2">
        <div className="block md:hidden">
          <AsideMenuMobile />
        </div>
        <h1 className="h1">
          {title} {totalCount ? `(${totalCount})` : ""}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        {pathname.startsWith("/admin") ? (
          <Button className="w-fit" asChild>
            <Link href={url || "/"}>{label}</Link>
          </Button>
        ) : null}
        <RefreshData />
      </div>
    </div>
  );
}

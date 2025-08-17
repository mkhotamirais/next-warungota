import React from "react";
import Logo from "./Logo";
import { Session } from "next-auth";
import Link from "next/link";
import { menu as m } from "@/lib/content";
import Button from "@/components/ui/Button";

export default function Header({ session }: { session: Session | null }) {
  return (
    <header className="h-16 bg-white sticky top-0 z-30 border-b border-gray-200">
      <div className="container flex items-center justify-between">
        <Logo />
        {/* nav desktop */}
        <div>
          <div className="flex gap-1">
            {m.mainMenu.map((item) => (
              <Link href={item.url} key={item.label} className="px-3 py-2">
                {item.label}
              </Link>
            ))}
            <div>
              {session?.user ? (
                <Button as={Link} href="/profile">
                  Dashboard
                </Button>
              ) : null}
              <Button as={Link} href="/signin">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

import React from "react";
import { menu as m } from "@/lib/content";
import Link from "next/link";
// import Button from "@/components/ui/Button";
// import { auth } from "@/auth";

export default async function NavDesktop() {
  // const session = await auth();

  return (
    <div className="flex gap-1">
      {m.mainMenu.map((item) => (
        <Link href={item.url} key={item.label} className="px-3 py-2">
          {item.label}
        </Link>
      ))}
      {/* <div>
        {session?.user ? (
          <Button as={Link} href="/profile">
            Dashboard
          </Button>
        ) : null}
        <Button as={Link} href="/signin">
          Sign In
        </Button>
      </div> */}
    </div>
  );
}

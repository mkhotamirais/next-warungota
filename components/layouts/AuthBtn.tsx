"use client";

import Button from "@/components/ui/Button";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AuthBtn() {
  const { data: session } = useSession();
  return (
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
  );
}

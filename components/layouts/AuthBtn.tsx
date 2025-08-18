"use client";

import Button from "@/components/ui/Button";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AuthBtn() {
  const { data: session } = useSession();

  return (
    <div>
      {session?.user ? (
        <Button as={Link} href="/dashboard" className="w-full md:w-auto">
          Dashboard
        </Button>
      ) : (
        <Button as={Link} href="/signin" className="w-full md:w-auto">
          Sign In
        </Button>
      )}
    </div>
  );
}

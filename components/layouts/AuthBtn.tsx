"use client";

import Button from "@/components/ui/Button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AuthBtn() {
  const [isMounted, setIsMounted] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div>Loading..</div>;
  }

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

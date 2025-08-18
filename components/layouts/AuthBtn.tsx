"use client";

import Button from "@/components/ui/Button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { LuLoaderCircle } from "react-icons/lu";

export default function AuthBtn() {
  const { data: session, status } = useSession();

  if (status === "loading")
    return (
      <Button as={"div"} className="w-full md:w-auto" icon={<LuLoaderCircle className="animate-spin" />}>
        Pending...
      </Button>
    );

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

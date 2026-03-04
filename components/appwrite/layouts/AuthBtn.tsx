import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function AuthBtn() {
  return (
    <div>
      <Button asChild>
        <Link href="/baas/appwrite/login">Login</Link>
      </Button>
    </div>
  );
}

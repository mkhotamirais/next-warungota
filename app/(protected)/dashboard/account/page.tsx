"use client";

import Button from "@/components/ui/Button";
import { signOut } from "next-auth/react";
import React from "react";

export default function Account() {
  return (
    <>
      Account
      <Button
        type="button"
        variant="secondary"
        onClick={() => signOut({ redirectTo: "/signin" })}
        className="w-full mt-2"
      >
        Sign Out
      </Button>
    </>
  );
}

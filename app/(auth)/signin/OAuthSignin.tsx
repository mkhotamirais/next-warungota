import { signIn } from "@/auth";
import Button from "@/components/ui/Button";
import React from "react";
import { FaGoogle } from "react-icons/fa";

export function GoogleSignin() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/" });
      }}
    >
      <Button type="submit" icon={<FaGoogle />} className="w-full">
        Signin with Google
      </Button>
    </form>
  );
}

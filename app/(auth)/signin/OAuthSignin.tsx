import { signIn } from "@/auth";
import Button from "@/components/ui/Button";
import { cookies } from "next/headers";
import React from "react";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";

export function GoogleSignin() {
  return (
    <form
      action={async () => {
        "use server";
        const cookieStore = await cookies();
        const lastUrl = cookieStore.get("last_visited")?.value || "/";

        await signIn("google", { redirectTo: lastUrl });
      }}
    >
      <Button type="submit" icon={<FaGoogle />} className="w-full">
        Signin with Google
      </Button>
    </form>
  );
}

export function GithubSignin() {
  return (
    <form
      action={async () => {
        "use server";
        const cookieStore = await cookies();
        const lastUrl = cookieStore.get("last_visited")?.value || "/";
        await signIn("github", { redirectTo: lastUrl });
      }}
    >
      <Button type="submit" className="w-full" icon={<FaGithub />}>
        Login With Gihub
      </Button>
    </form>
  );
}

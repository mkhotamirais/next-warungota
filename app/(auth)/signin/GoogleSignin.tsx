"use client";

import React from "react";
import { FaGoogle } from "react-icons/fa";
import SubmitBtn from "./SubmitBtn";
import { signInGoogle } from "@/actions/auth";

export function GoogleSignin() {
  return (
    <form action={signInGoogle}>
      <SubmitBtn icon={<FaGoogle />}>Signin with Google</SubmitBtn>
    </form>
  );
}

// export function GithubSignin() {
//   return (
//     <form
//       action={async () => {
//         "use server";
//         // const cookieStore = await cookies();
//         // const lastUrl = cookieStore.get("last_visited")?.value || "/";
//         await signIn("github", { redirectTo: "/dashboard" });
//       }}
//     >
//       <Button type="submit" className="w-full" icon={<FaGithub />}>
//         Login With Gihub
//       </Button>
//     </form>
//   );
// }

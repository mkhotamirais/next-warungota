import { auth } from "@/auth";
import React from "react";

export default async function Dashboard() {
  const session = await auth();

  return (
    <div>
      <div>Hi, {session?.user?.name}</div>
    </div>
  );
}

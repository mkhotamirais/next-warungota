import UserProviderPage from "@/layouts/UserProviderPage";
import React from "react";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <UserProviderPage>{children}</UserProviderPage>;
}

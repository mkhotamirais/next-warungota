import Header from "@/components/appwrite/layouts/Header";
import React from "react";

export default function AppwriteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky top-16">
      <Header />
      <div>{children}</div>
    </div>
  );
}

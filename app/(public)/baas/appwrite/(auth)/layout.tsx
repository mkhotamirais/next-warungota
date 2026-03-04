import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 py-16">
      <div className="border rounded-xl border-gray-200 p-8 mx-auto max-w-md bg-white">{children}</div>
    </div>
  );
}

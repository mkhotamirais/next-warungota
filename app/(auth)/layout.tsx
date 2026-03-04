import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 py-16 min-h-screen">
      <div className="border max-w-md mx-auto p-8 rounded-xl bg-white">{children}</div>
    </div>
  );
}

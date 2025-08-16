import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="py-12 bg-gray-100">
      <div className="container max-w-md mx-auto">
        <div className="bg-white border rounded p-4">{children}</div>
      </div>
    </section>
  );
}

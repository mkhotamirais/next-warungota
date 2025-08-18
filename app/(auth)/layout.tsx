import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="py-12 bg-gray-100 min-h-[calc(100vh-6rem)]">
      <div className="container max-w-xl mx-auto">
        <div className="bg-white rounded p-4 shadow">{children}</div>
      </div>
    </section>
  );
}

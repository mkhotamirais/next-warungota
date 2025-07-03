"use client";

import { LoaderCircle } from "lucide-react";

export default function PendingPage() {
  return (
    <div className="container flex items-center justify-center my-12">
      <LoaderCircle className="w-10 h-10 animate-spin text-primary" />
    </div>
  );
}

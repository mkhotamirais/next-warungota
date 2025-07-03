"use client";

import { LoaderCircle } from "lucide-react";

export default function PendingPage() {
  return (
    <div className="min-h-screen container flex items-center justify-center py-8">
      <LoaderCircle className="w-10 h-10 animate-spin text-primary" />
    </div>
  );
}

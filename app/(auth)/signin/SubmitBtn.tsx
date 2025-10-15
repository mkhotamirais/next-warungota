"use client";

import Button from "@/components/ui/Button";
import React from "react";
import { useFormStatus } from "react-dom";

interface SubmitBtnProps {
  icon: React.ReactNode;
  children: React.ReactNode;
}

export default function SubmitBtn({ icon, children }: SubmitBtnProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" icon={icon} className="w-full" disabled={pending}>
      {pending ? "Mengarahkan..." : children}
    </Button>
  );
}

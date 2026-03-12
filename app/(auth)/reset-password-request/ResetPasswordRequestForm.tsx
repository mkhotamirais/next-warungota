"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

export default function ResetPasswordRequestForm() {
  const [email, setEmail] = useState("");
  const [pending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await fetch("/api/account/reset-password-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      toast.success(data.message);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Label htmlFor="email">Your email address</Label>
      <Input
        id="email"
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Button type="submit" disabled={pending} className="w-full">
        {pending && <Spinner />}
        Send reset link
      </Button>
    </form>
  );
}

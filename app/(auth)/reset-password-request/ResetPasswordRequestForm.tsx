"use client";

import { Button } from "@/components/ui/button";
import Alert from "@/components/ui/custom/Alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import React, { useState, useRef, useTransition } from "react";

export default function ResetPasswordRequestForm() {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [pending, startTransition] = useTransition();
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  // Gunakan useRef untuk menyimpan timer ID agar bisa di-clear kapan saja
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startCountdown = (seconds: number) => {
    // Bersihkan timer lama jika ada
    if (timerRef.current) clearInterval(timerRef.current);

    setSecondsLeft(seconds);

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setAlert(null); // Bersihkan alert saat waktu habis
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (secondsLeft > 0) return;

    startTransition(async () => {
      try {
        const res = await fetch("/api/account/reset-password-request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, confirm_username: honeypot }),
        });

        const data = await res.json();

        if (!res.ok) {
          setAlert({ type: "error", message: data.message });

          if (res.status === 429 && data.seconds) {
            // Picu countdown secara imperatif
            startCountdown(data.seconds);
          }
          return;
        }

        setAlert({ type: "success", message: data.message });
        setEmail("");

        // Timer sederhana untuk alert sukses (tidak perlu countdown)
        setTimeout(() => setAlert(null), 5000);
      } catch (error) {
        console.log(error);
        setAlert({ type: "error", message: "Something went wrong." });
      }
    });
  };

  return (
    <div className="space-y-4">
      {alert?.message && (
        <Alert variant={alert.type}>
          {alert.message}
          {alert.type === "error" && secondsLeft > 0 && <span className="ml-1 font-bold">({secondsLeft}s)</span>}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Honeypot */}
        <div className="hidden" aria-hidden="true">
          <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} />
        </div>

        <Label htmlFor="email">Your email address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={pending || secondsLeft > 0}
        />

        <Button type="submit" disabled={pending || secondsLeft > 0} className="w-full">
          {pending ? <Spinner className="mr-2" /> : null}
          {secondsLeft > 0 ? `Wait ${secondsLeft}s` : "Send reset link"}
        </Button>
      </form>
    </div>
  );
}

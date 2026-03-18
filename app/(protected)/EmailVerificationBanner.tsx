"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export default function EmailVerificationBanner() {
  const [pending, startTransition] = useTransition();
  const { data: session, status } = useSession();
  const isVerified = !!session?.user?.emailVerified;

  const pathname = usePathname();

  const handleResend = () => {
    startTransition(async () => {
      const res = await fetch("/api/emails/verify-email-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callbackUrl: pathname }),
      });

      const data = await res.json();

      if (data?.error) {
        toast.error(data?.error);
      }
      toast.success(data?.message);
    });
  };

  if (status === "loading") {
    return null;
  }

  if (!isVerified) {
    return (
      <Alert className="mb-4">
        <InfoIcon />
        <AlertTitle>Your email is not verified</AlertTitle>
        <AlertDescription className="flex items-center">
          Please check your inbox or
          <button type="button" onClick={handleResend} className="underline text-link flex items-center gap-1">
            {pending && <Loader2 className="w-4 h-4 animate-spin" />}
            Resend verification email
          </button>
        </AlertDescription>
      </Alert>
    );
  }
  return null;
}

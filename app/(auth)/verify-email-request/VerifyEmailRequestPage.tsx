"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Load from "@/components/fallbacks/Load";
export default function VerifyEmailRequestPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  useEffect(() => {
    if (status === "authenticated" && session?.user?.emailVerified) {
      router.replace("/");
    }
  }, [status, session, router]);

  if (status === "loading") return <Load />;

  const handleResend = async () => {
    setPending(true);
    const res = await fetch(`/api/emails/verify-email-request?callbackUrl=${encodeURIComponent(callbackUrl)}`, {
      method: "POST",
    });
    const data = await res.json();

    if (data?.error) {
      toast.error(data?.error);
      setPending(false);
      return;
    }
    setPending(false);
    toast.success(data?.message);
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-yellow-600 mb-4 text-center">Verifikasi Diperlukan ⚠️</h1>
      <p className="text-gray-700 mb-6">
        Hai **{session?.user?.name || "Pengguna"}**, Akun Anda sudah dibuat, tetapi kami perlu memverifikasi alamat
        email Anda ({session?.user?.email}).
      </p>
      <p className="text-sm text-gray-500 mb-8">Silakan cek email Anda untuk tautan verifikasi yang kami kirimkan.</p>
      <Button type="button" onClick={handleResend} disabled={pending} className="w-full">
        {pending && <Spinner />}
        Kirim Ulang Email Verifikasi
      </Button>
    </>
  );
}

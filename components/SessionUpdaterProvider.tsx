"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function SessionUpdaterProvider() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { update } = useSession();

  const redirected = searchParams.get("redirected");

  useEffect(() => {
    // 🔑 Logika Kunci: Hanya panggil update dan refresh jika sinyal diterima
    if (redirected === "update-email") {
      (async () => {
        // 1. Panggil update() untuk memuat sesi terbaru
        await update({});

        // 2. Refresh halaman untuk memaksa Server Components memuat ulang data
        router.refresh();

        // 3. Opsional: Hapus parameter dari URL agar logic ini tidak berjalan lagi
        //    saat user me-refresh atau pindah tab.
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("redirected");
        // Ganti URL tanpa memicu reload
        router.replace(newUrl.pathname + newUrl.search, { scroll: false });

        console.log("Sesi berhasil disinkronkan setelah perubahan email.");
      })();
    }
  }, [update, redirected, router]);

  return null;
}

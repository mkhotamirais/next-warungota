"use client";

import { FaSpinner } from "react-icons/fa6";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordClientForm({ token, email }: { token: string; email: string }) {
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setMessage(null);

    if (password.length < 8) {
      setMessage({ type: "error", text: "Password minimal 8 karakter." });
      setIsPending(false);
      return;
    }

    try {
      // 🔑 Panggil Route Handler baru
      const res = await fetch("/api/account/reset-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, newPassword: password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: data.message });
        setTimeout(() => router.push("/signin"), 3000);
      } else {
        setMessage({ type: "error", text: data.message || "Gagal mereset password." });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Terjadi kesalahan jaringan." });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4 border rounded shadow">
      <h2 className="h2 text-center mb-4">Reset Password</h2>

      {message && (
        <div
          className={`p-3 mb-4 rounded text-white text-center ${message.type === "success" ? "bg-green-500" : "bg-red-500"}`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="password">Password Baru</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Minimal 8 karakter"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={isPending || message?.type === "success"}
          />
        </div>

        <button
          type="submit"
          disabled={isPending || message?.type === "success"}
          className="w-full py-2 px-4 bg-primary text-white rounded disabled:bg-gray-400 flex items-center justify-center"
        >
          {isPending ? <FaSpinner className="animate-spin mr-2" /> : "Ubah Password"}
        </button>
      </form>
    </div>
  );
}

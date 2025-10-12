"use client";

import { useState } from "react";
import { FaSpinner } from "react-icons/fa6";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setMessage("");

    try {
      const res = await fetch("/api/account/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      console.log(error);
      setMessage("Terjadi kesalahan jaringan.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="container max-w-xl py-8">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto p-4 border rounded shadow">
        <h2 className="h2 text-center">Lupa Password</h2>
        <p className="text-sm text-gray-600 text-center">Masukkan alamat email Anda yang terdaftar.</p>

        <input
          type="email"
          placeholder="Email Anda"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 px-4 bg-primary text-white rounded disabled:bg-gray-400 flex items-center justify-center"
        >
          {isPending ? <FaSpinner className="animate-spin mr-2" /> : "Kirim Tautan Reset"}
        </button>

        {message && <p className="text-sm text-center text-gray-600">{message}</p>}
      </form>
    </div>
  );
}

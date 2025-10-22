"use client";

import { useState } from "react";

interface SummaryProps {
  subtotal: number;
  shippingCost: number;
  finalTotal: number;
}

export default function CheckoutSummary({ subtotal, shippingCost, finalTotal }: SummaryProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleBayar = async () => {
    setIsLoading(true);
    try {
      alert(`Simulasi Pembayaran sebesar ${finalTotal} sukses!`);
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Pembayaran gagal. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 shadow rounded-lg sticky top-8">
      <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>

      <div className="space-y-2 border-b pb-4 mb-4 text-gray-700">
        <div className="flex justify-between">
          <span>Subtotal Barang:</span>
          <span>Rp{subtotal.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between">
          <span>Biaya Kirim:</span>
          <span>Rp{shippingCost.toLocaleString("id-ID")}</span>
        </div>
      </div>

      <div className="flex justify-between font-bold text-lg text-gray-900 mb-6">
        <span>Total Bayar:</span>
        <span>Rp{finalTotal.toLocaleString("id-ID")}</span>
      </div>

      <button
        onClick={handleBayar}
        disabled={isLoading}
        className={`w-full py-3 rounded-lg text-white font-bold transition-colors ${
          isLoading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {isLoading ? "Memproses..." : "Bayar"} 🛒
      </button>
    </div>
  );
}

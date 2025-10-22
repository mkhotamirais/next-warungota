"use client";

import { useState } from "react";
import { Address } from "@prisma/client";

interface AddressSelectorProps {
  initialAddresses: Address[];
  defaultAddress: Address | null;
  onAddressSelect?: (addressId: string) => void;
}

export default function AddressSelector({ initialAddresses, defaultAddress, onAddressSelect }: AddressSelectorProps) {
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddress?.id || "");

  const handleSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    if (onAddressSelect) {
      onAddressSelect(addressId);
    }
  };

  const currentAddress = initialAddresses.find((addr) => addr.id === selectedAddressId);

  if (initialAddresses.length === 0) {
    return (
      <div className="text-center p-4 border rounded-lg bg-yellow-50 text-yellow-700">
        ⚠️ Anda belum memiliki alamat tersimpan. Silakan tambahkan alamat di halaman Akun.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-green-500 rounded-lg p-4 bg-green-50 shadow-sm">
        <h3 className="font-bold text-lg text-green-700 mb-2">
          Alamat Tujuan: {currentAddress?.label || "Pilih Alamat"}
          {currentAddress?.isDefault && (
            <span className="ml-2 text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">Default</span>
          )}
        </h3>
        {currentAddress ? (
          <div className="text-sm text-gray-700">
            <p className="font-semibold">
              {currentAddress.recipient} ({currentAddress.phone})
            </p>
            <p>{currentAddress.street}</p>
            <p>{`${currentAddress.village}, ${currentAddress.district}, ${currentAddress.regency}, ${currentAddress.province}`}</p>
            <p>Kode Pos: {currentAddress.postalCode}</p>
          </div>
        ) : (
          <p className="text-red-500">Pilih salah satu alamat dari daftar di bawah.</p>
        )}
      </div>

      <div className="max-h-64 overflow-y-auto space-y-3 p-2 border rounded-lg bg-gray-50">
        {initialAddresses.map((address) => (
          <label
            key={address.id}
            htmlFor={`address-${address.id}`}
            className={`block cursor-pointer border rounded-lg p-3 transition-colors ${
              selectedAddressId === address.id
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-200 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-start">
              <input
                type="radio"
                id={`address-${address.id}`}
                name="selectedAddress"
                value={address.id}
                checked={selectedAddressId === address.id}
                onChange={() => handleSelect(address.id)}
                className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <p className="font-semibold">{address.label || "Alamat Tersimpan"}</p>
                <p className="text-sm text-gray-600">
                  {address.recipient} ({address.phone})
                </p>
                <p className="text-xs text-gray-500 truncate">{`${address.street}, ${address.regency}`}</p>
                {address.isDefault && (
                  <span className="text-xs bg-yellow-200 text-yellow-800 px-1.5 py-0.5 rounded-md mt-1 inline-block">
                    Default
                  </span>
                )}
              </div>
            </div>
          </label>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => console.log("Navigasi ke halaman manajemen alamat")}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Ubah atau Tambah Alamat Baru
        </button>
      </div>
    </div>
  );
}

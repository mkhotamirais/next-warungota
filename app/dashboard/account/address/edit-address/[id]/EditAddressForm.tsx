"use client";

import Input from "@/components/form/Input";
import Msg from "@/components/form/Msg";
import Select from "@/components/form/Select";
import Button from "@/components/ui/Button";
import useAddresses from "@/hooks/useAddresses";
import { useAddressForm } from "@/hooks/useAddressForm";
import { Address } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

export default function EditAddressForm({ address }: { address: Address }) {
  const [label, setLabel] = useState("");
  const [recipient, setRecipient] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const { province, setProvince, regency, setRegency, district, setDistrict, village, setVillage } = useAddressForm();
  const [provinces, regencies, districts, villages, pendingProvince, pendingRegency, pendingDistrict] = useAddresses();
  const [postalCode, setPostalCode] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, { errors: string[] }> | undefined>({});
  const [success, setSuccess] = useState("");

  const [pending, startTransation] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (address) {
      setLabel(address?.label || "");
      setRecipient(address.recipient);
      setPhone(address.phone);
      setStreet(address.street);
      setProvince(address.province);
      setRegency(address.regency);
      setDistrict(address.district);
      setVillage(address.village);
      setPostalCode(address.postalCode);
      setIsDefault(address.isDefault);
    }
  }, [address, setDistrict, setProvince, setRegency, setStreet, setVillage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransation(async () => {
      const res = await fetch(`/api/account/address/${address.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label,
          recipient,
          phone,
          street,
          province,
          regency,
          district,
          village,
          postalCode,
          isDefault,
        }),
      });
      const result = await res.json();

      if (result?.errors || result?.error || result?.message) {
        setErrors(undefined);
        setError("");
        setSuccess("");
      }

      if (result?.errors) {
        setErrors(result.errors);
        return;
      }

      if (result?.error) {
        setError(result.error);
        return;
      }

      setSuccess(result.message);
      toast.success(result.message);
      router.push("/dashboard/account/address");
    });
  };

  return (
    <div>
      {success ? <Msg msg={success} /> : null}
      {error ? <Msg msg={error} error /> : null}

      <form onSubmit={handleSubmit}>
        <Input
          id="Label"
          label="Label"
          placeholder="Misal: Rumah, Kantor"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <Input
          id="Nama Penerima"
          label="Nama Penerima"
          placeholder="Nama penerima"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          error={errors?.recipient?.errors}
        />
        <Input
          id="Nomor Telepon"
          label="Nomor Telepon"
          placeholder="Nomor telepon"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={errors?.phone?.errors}
        />
        <Input
          id="Alamat Jalan"
          label="Kampung / Jalan"
          placeholder="Alamat kampung atau jalan"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          error={errors?.street?.errors}
        />
        <Select
          id="Provinsi"
          label="Provinsi"
          value={province}
          options={provinces}
          onChange={(e) => setProvince(e.target.value)}
          placeholder="--Select Province"
          error={errors?.province?.errors}
        />
        <Select
          id="kabupaten-kota"
          label="Kabupaten/Kota"
          value={regency}
          options={regencies}
          onChange={(e) => setRegency(e.target.value)}
          disabled={pendingProvince || !province}
          placeholder="--Select Regency"
          error={errors?.regency?.errors}
        />
        <Select
          id="kecamatan"
          label="Kecamatan"
          value={district}
          options={districts}
          onChange={(e) => setDistrict(e.target.value)}
          disabled={pendingRegency || !regency}
          placeholder="--Select District"
          error={errors?.district?.errors}
        />
        <Select
          id="desa-kelurahan"
          label="Desa/Kelurahan"
          value={village}
          options={villages}
          onChange={(e) => setVillage(e.target.value)}
          disabled={pendingDistrict || !district}
          placeholder="--Select Village"
          error={errors?.village?.errors}
        />
        <Input
          id="Kode Pos"
          label="Kode Pos"
          placeholder="Kode pos"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          error={errors?.postalCode?.errors}
        />
        <label htmlFor="isDefault" className="flex gap-2 items-center mb-3">
          <input id="isDefault" type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
          <span>Set sebagai alamat utama</span>
        </label>
        <Button type="submit" disabled={pending}>
          {pending ? "Loading..." : "Simpan"}
        </Button>
      </form>
    </div>
  );
}

"use client";

import Input from "@/components/form/Input";
import Msg from "@/components/form/Msg";
import Button from "@/components/ui/Button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import { FaCheck } from "react-icons/fa6";

const normalizeValue = (value: string | undefined | null) => {
  if (value === null || value === undefined || value.trim() === "") {
    return undefined;
  }
  return value;
};

export default function UpdateDataForm() {
  const { data: session, update } = useSession();
  const user = session?.user;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, { errors: string[] }> | undefined>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, startTransition] = useTransition();

  const router = useRouter();

  useEffect(() => {
    setName(user?.name || "");
    setPhone(user?.phone || "");
    setEmail(user?.email || "");
  }, [user]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await fetch("/api/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
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
      await update({});
      router.refresh();

      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });
  };

  const isNameUnchanged = normalizeValue(name) === normalizeValue(user?.name);
  const isPhoneUnchanged = normalizeValue(phone) === normalizeValue(user?.phone);
  const isEmailUnchanged = normalizeValue(email) === normalizeValue(user?.email);

  const isDataUnchanged = isNameUnchanged && isPhoneUnchanged && isEmailUnchanged;

  return (
    <div className="mb-4">
      <h2 className="h2 mb-2">Your Data</h2>
      {success ? <Msg msg={success} /> : null}
      {error ? <Msg msg={error} error /> : null}

      <form onSubmit={handleSubmit}>
        <Input
          label="Name"
          id="name"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors?.name?.errors}
        />
        <div>
          <Input
            label="Email"
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors?.email?.errors}
            className="!mb-1"
          />
          <div className="mb-3">
            {user?.emailVerified ? (
              <div className="flex items-center gap-1 text-sm text-primary">
                <FaCheck className="" />
                verified
              </div>
            ) : (
              <div className="inline-flex items-center gap-1 text-sm text-red-600">
                <FaCheck />
                <p>{user?.pendingEmail || "Email"} is unverified</p>
              </div>
            )}
          </div>
        </div>
        <Input
          label="Phone"
          id="phone"
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={errors?.phone?.errors}
        />
        <Button type="submit" disabled={pending || isDataUnchanged}>
          {pending ? "Saving..." : "Save"}
        </Button>
      </form>
    </div>
  );
}

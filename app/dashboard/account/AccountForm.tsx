"use client";

import Input from "@/components/form/Input";
import Button from "@/components/ui/Button";
import { useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";

export default function AccountForm() {
  const { data: session } = useSession();
  const user = session?.user;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setPhone(user?.phone || "");
    const isEmailVerified = !!user?.emailVerified;
    setIsVerified(isEmailVerified);
  }, [user]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const res = await fetch("/api/account", {
        method: "PATCH",
        body: JSON.stringify({ name, email, phone }),
      });
      const data = await res.json();
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Input label="Name" id="name" type="text" placeholder="Name" defaultValue={name} />
        <Input label="Email" id="email" type="email" placeholder="Email" defaultValue={email} disabled={true} />
        {!isVerified ? (
          <div className="text-red-500">Email belum diverifikasi</div>
        ) : (
          <div>Email sudah diverifikasi</div>
        )}
        <Input label="Phone" id="phone" type="text" placeholder="Phone" defaultValue={phone} />
        <Button type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create"}
        </Button>
      </form>
    </div>
  );
}

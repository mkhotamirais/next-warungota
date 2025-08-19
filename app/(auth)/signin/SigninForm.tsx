"use client";

import Input from "@/components/form/Input";
import Msg from "@/components/form/Msg";
import Button from "@/components/ui/Button";
import { SigninSchema } from "@/lib/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import z from "zod";

export default function SigninForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, { errors: string[] }> | undefined>({});
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = { email, password };
    const validatedFields = SigninSchema.safeParse(formData);

    if (!validatedFields.success) {
      const errors = z.treeifyError(validatedFields.error).properties;
      setErrors(errors);
      return;
    }

    startTransition(async () => {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) {
        if (res.error === "CredentialsSignin") {
          setError("Email atau password salah.");
        } else {
          setError("Terjadi kesalahan yang tidak diketahui.");
        }
      } else {
        router.push("/dashboard");
      }
    });
  };

  return (
    <>
      {error && <Msg msg={error} status="error" />}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          error={errors?.email?.errors}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
          error={errors?.password?.errors}
        />

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Signing In..." : "Sign In"}
        </Button>
      </form>
    </>
  );
}

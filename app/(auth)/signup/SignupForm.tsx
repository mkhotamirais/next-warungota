"use client";

import Input from "@/components/form/Input";
import Msg from "@/components/form/Msg";
import Button from "@/components/ui/Button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, { errors: string[] }> | undefined>({});
  const [error, setError] = useState("");

  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const res = await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      const data = await res.json();

      if (data?.error || data?.errors) {
        setError(data?.error);
        setErrors(data?.errors);
        return;
      }

      await signIn("credentials", { email, password, redirect: false });

      router.push("/dashboard");
    });
  };

  return (
    <>
      {error ? <Msg msg={error} status="error" /> : null}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="name"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          error={errors?.name?.errors}
        />
        <Input
          id="email"
          label="Email"
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
        <Input
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="********"
          error={errors?.confirmPassword?.errors}
        />

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Signing Up..." : "Sign Up"}
        </Button>
      </form>
    </>
  );
}

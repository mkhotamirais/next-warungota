"use client";

import { signUp } from "@/actions/auth";
import Input from "@/components/form/Input";
import Msg from "@/components/form/Msg";
import Button from "@/components/ui/Button";
import { useActionState } from "react";

export default function SignupForm() {
  const [state, formAction, pending] = useActionState(signUp, null);

  return (
    <form action={formAction} className="space-y-4">
      {state?.message ? <Msg msg={state.message} status={state?.status} /> : null}
      <Input
        id="name"
        label="Name"
        placeholder="Your Name"
        defaultValue={state?.values?.name as string}
        error={state?.errors?.name?.errors}
      />
      <Input
        id="email"
        label="Email"
        type="email"
        placeholder="example@email.com"
        defaultValue={state?.values?.email as string}
        error={state?.errors?.email?.errors}
      />
      <Input
        id="password"
        label="Password"
        type="password"
        placeholder="********"
        error={state?.errors?.password?.errors}
      />
      <Input
        id="confirmPassword"
        label="Confirm Password"
        type="password"
        placeholder="********"
        error={state?.errors?.confirmPassword?.errors}
      />

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing Up..." : "Sign Up"}
      </Button>
    </form>
  );
}

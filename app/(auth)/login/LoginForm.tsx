"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { loginSchema } from "@/lib/schemas/auth";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type inferSchema = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const form = useForm<inferSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const pending = form.formState.isSubmitting;
  const router = useRouter();

  const [showPass, setShowPass] = useState(false);

  const onSubmit = async (data: inferSchema) => {
    const { email, password } = data;
    const res = await signIn("credentials", { email, password, redirect: false });
    console.log(res);

    if (res?.error) {
      if (res.code === "credentials") {
        toast.error("Invalid email or password.");
      } else {
        toast.error(res.code);
      }
    }

    form.reset();
    router.refresh();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                id="email"
                aria-invalid={fieldState.invalid}
                placeholder="example@email.com"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="max-w-sm">
              <div className="flex justify-between">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Link href="/reset-password-request" className="text-sm text-primary hover:underline" tabIndex={-1}>
                  Forgot password?
                </Link>
              </div>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="Enter password"
                  aria-invalid={fieldState.invalid}
                />
                <InputGroupAddon align="inline-end">
                  <Button
                    type="button"
                    onClick={() => setShowPass((prev) => !prev)}
                    variant={"ghost"}
                    size={"icon"}
                    tabIndex={-1}
                  >
                    {showPass ? <EyeIcon /> : <EyeOffIcon />}
                  </Button>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit" disabled={pending} className="mt-6 w-full">
        {pending && <Spinner />}
        Login
      </Button>
    </form>
  );
}

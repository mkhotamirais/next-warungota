"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { registerSchema } from "@/lib/schemas/auth";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type inferSchema = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const form = useForm<inferSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });
  const pending = form.formState.isSubmitting;
  const router = useRouter();

  const [showPass, setShowPass] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);

  const onSubmit = async (data: inferSchema) => {
    const res = await fetch("/api/account/register", { method: "POST", body: JSON.stringify(data) });
    const result = await res.json();

    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    form.reset();

    await signIn("credentials", { email: data.email, password: data.password, redirect: false });
    router.refresh();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                {...field}
                id="name"
                aria-invalid={fieldState.invalid}
                placeholder="Your name"
                autoComplete="off"
                autoFocus
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
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
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="Enter password"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
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
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="max-w-sm">
              <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id="confirmPassword"
                  type={showConfPass ? "text" : "password"}
                  placeholder="Enter password"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                />
                <InputGroupAddon align="inline-end">
                  <Button
                    type="button"
                    onClick={() => setShowConfPass((prev) => !prev)}
                    variant={"ghost"}
                    size={"icon"}
                    tabIndex={-1}
                  >
                    {showConfPass ? <EyeIcon /> : <EyeOffIcon />}
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
        Register
      </Button>
    </form>
  );
}

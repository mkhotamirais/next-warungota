"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { ResetPasswordSchema } from "@/lib/schemas/auth";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { EyeIcon, EyeOffIcon } from "lucide-react";

type inferSchema = z.infer<typeof ResetPasswordSchema>;

export default function ResetPasswordForm({ token, email }: { token: string; email: string }) {
  const form = useForm<inferSchema>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { newPassword: "", confirmNewPassword: "" },
  });
  const pending = form.formState.isSubmitting;
  const router = useRouter();

  const [showPass, setShowPass] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);

  const onSubmit = async (data: inferSchema) => {
    const { newPassword, confirmNewPassword } = data;

    const res = await fetch("/api/account/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email, newPassword, confirmNewPassword }),
    });
    const result = await res.json();

    if (result.error) {
      toast.error(result.error);
      return;
    }

    form.reset();
    toast.success(result.message);
    setTimeout(() => router.replace("/login"), 1000);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="newPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="max-w-sm">
              <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id="newPassword"
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
        <Controller
          name="confirmNewPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="max-w-sm">
              <FieldLabel htmlFor="confirmNewPassword">Confirm New Password</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id="confirmNewPassword"
                  type={showConfPass ? "text" : "password"}
                  placeholder="Enter password"
                  aria-invalid={fieldState.invalid}
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
        Reset Password
      </Button>
    </form>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { loginSchema } from "@/lib/schemas/auth";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Alert from "@/components/ui/custom/Alert";

type inferSchema = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [showPass, setShowPass] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string | undefined } | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  // Menggunakan state untuk menyimpan ID interval, bukan useRef
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const router = useRouter();

  const form = useForm<inferSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const pending = form.formState.isSubmitting;

  // Cleanup saat unmount menggunakan state intervalId
  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startCountdown = (seconds: number) => {
    // Bersihkan interval sebelumnya jika ada
    if (intervalId) clearInterval(intervalId);

    setSecondsLeft(seconds);

    const id = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setIntervalId(null);
          setAlert(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setIntervalId(id);
  };

  const onSubmit = async (data: inferSchema) => {
    if (secondsLeft > 0) return;

    const { email, password } = data;

    const res = await signIn("credentials", {
      email,
      password,
      confirm_username: "",
      redirect: false,
    });

    if (res?.error) {
      const errorCode = res.code;

      if (errorCode?.startsWith("LOCKED:")) {
        const secs = parseInt(errorCode.split(":")[1]);
        setAlert({ type: "error", message: "Too many attempts. Account locked." });
        startCountdown(secs);
      } else {
        setAlert({
          type: "error",
          message: errorCode === "credentials" ? "Invalid email or password." : errorCode,
        });
      }
      form.reset({ password: "" });
      return;
    }

    setAlert({ type: "success", message: "Login successful! Redirecting..." });
    router.refresh();
    router.push("/dashboard");
  };

  return (
    <div className="space-y-4">
      {alert && (
        <Alert variant={alert.type}>
          {alert.message}
          {alert.type === "error" && secondsLeft > 0 && (
            <span className="ml-1 font-bold">({formatTime(secondsLeft)})</span>
          )}
        </Alert>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Input type="text" name="confirm_username" className="hidden" tabIndex={-1} autoComplete="off" />
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
                  disabled={pending || secondsLeft > 0}
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
                    disabled={pending || secondsLeft > 0}
                    autoComplete="off"
                  />
                  <InputGroupAddon align="inline-end">
                    <Button
                      type="button"
                      onClick={() => setShowPass((prev) => !prev)}
                      variant={"ghost"}
                      size={"icon"}
                      tabIndex={-1}
                      disabled={pending || secondsLeft > 0}
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
        <Button type="submit" disabled={pending || secondsLeft > 0} className="mt-6 w-full">
          {pending ? <Spinner className="mr-2" /> : null}
          {secondsLeft > 0 ? `Wait ${formatTime(secondsLeft)}` : "Login"}
        </Button>
      </form>
    </div>
  );
}

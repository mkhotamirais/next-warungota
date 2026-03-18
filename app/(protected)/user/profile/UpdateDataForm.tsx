"use client";

// import { updateProfileData } from "@/actions/account";
import FallbackUpdateData from "@/components/fallbacks/FallbackUpdateData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { FaCheck, FaSpinner, FaX } from "react-icons/fa6";
import { toast } from "sonner";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { profileDataSchema } from "@/lib/schemas/user";
import { Spinner } from "@/components/ui/spinner";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

type inferSchema = z.infer<typeof profileDataSchema>;

export default function UpdateDataForm() {
  const { data: session, update, status } = useSession();
  const user = session?.user;

  const form = useForm<inferSchema>({
    resolver: zodResolver(profileDataSchema),
    defaultValues: { name: user?.name || "", phone: user?.phone || "", email: user?.email || "" },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
      });
    }
  }, [user, form]);

  const watchedValues = useWatch({ control: form.control });

  const isDataUnchanged =
    (watchedValues.name || "") === (user?.name || "") &&
    (watchedValues.email || "") === (user?.email || "") &&
    (watchedValues.phone || "") === (user?.phone || "");

  const pending = form.formState.isSubmitting;

  const [pendingResend, startResend] = useTransition();
  const [isResend, setIsResend] = useState(false);

  const router = useRouter();

  const handleResend = () => {
    startResend(async () => {
      const res = await fetch("/api/emails/verify-email-request", { method: "POST" });
      const data = await res.json();

      if (data?.error) {
        toast.error(data?.error);
      }
      toast.success(data?.message);
      setIsResend(true);
      setTimeout(() => {
        setIsResend(false);
      }, 3000);
    });
  };

  const onSubmit = async (data: inferSchema) => {
    const res = await fetch("/api/account/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    // const result = await updateProfileData(data);

    if (result?.error) {
      toast.error(result?.error);
      return;
    }

    toast.success(result?.message);
    await update({});
    router.refresh();

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  let content;

  if (status === "loading") {
    content = <FallbackUpdateData />;
  } else {
    content = (
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
                <FieldDescription>
                  <>
                    {user?.emailVerified ? (
                      <span className="flex items-center gap-1 text-sm text-primary">
                        <FaCheck className="" />
                        verified
                      </span>
                    ) : (
                      <span className="inline-flex flex-wrap items-center gap-1 text-sm">
                        <span className="flex items-center gap-1 text-red-500">
                          <FaX />
                          {user?.pendingEmail || "Email"} is unverified
                        </span>
                        (<span>Check your email or </span>
                        <button
                          disabled={pendingResend}
                          type="button"
                          onClick={handleResend}
                          className="underline text-primary flex items-center gap-1 disabled:opacity-50"
                        >
                          Request Verification {pendingResend && <FaSpinner className="animate-spin" />}{" "}
                          {isResend && <FaCheck className="text-green-500" />}
                        </button>
                        )
                      </span>
                    )}
                  </>
                </FieldDescription>
              </Field>
            )}
          />

          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <Input
                  {...field}
                  id="phone"
                  aria-invalid={fieldState.invalid}
                  placeholder="misal: 081231231231"
                  autoComplete="off"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
        <Button type="submit" disabled={pending || isDataUnchanged} className="mt-4">
          {pending && <Spinner />}
          Save
        </Button>
      </form>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="h2 mb-2">Your Data</h2>
      {content}
    </div>
  );
}

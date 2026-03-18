"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
// import { profileDeleteAccount } from "@/actions/account";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { deleteAccountSchema } from "@/lib/schemas/user";
import { Spinner } from "@/components/ui/spinner";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

type inferSchema = z.infer<typeof deleteAccountSchema>;

export default function DeleteAccount() {
  const [isDel, setIsDel] = useState(false);

  const form = useForm<inferSchema>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { text: "" },
  });

  const pending = form.formState.isSubmitting;
  const text = useWatch({ control: form.control, name: "text" });

  const onSubmit = async (data: inferSchema) => {
    const res = await fetch("/api/account/profile", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: data.text }),
    });
    const result = await res.json();
    // const result = await profileDeleteAccount(data);
    if (result.error) {
      toast.error(result.error);
      return;
    }

    if (result.errors) {
      toast.error("errors");
      return;
    }

    toast.success(result.message);
    setIsDel(false);

    await signOut({ callbackUrl: "/", redirect: true });
  };

  return (
    <div className="mb-6">
      <h2 className="h2 mb-2">Delete Your Account</h2>
      {isDel ? (
        <div>
          <p>
            Type <b>&quot;delete my account&quot;</b> to confirm
          </p>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="text"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="text">Confirm Delete Account</FieldLabel>
                    <Input
                      {...field}
                      id="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="Type confirmation"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>

            <div className="flex gap-1">
              <Button
                type="submit"
                variant="destructive"
                disabled={pending || text !== "delete my account"}
                className="w-fit"
              >
                {pending && <Spinner />}
                Confirm
              </Button>
              <Button type="button" variant="secondary" onClick={() => setIsDel(false)} className="w-fit">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <p className="mb-2">
            If you delete your account, All of your data will be permanently removed from our servers.
          </p>
          <Button className="w-fit" type="button" variant="destructive" onClick={() => setIsDel(true)}>
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}

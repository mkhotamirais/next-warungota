"use client";

// import { profileChangePassword } from "@/actions/account";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { changePasswordSchema } from "@/lib/schemas/user";
import { Spinner } from "@/components/ui/spinner";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

type inferSchema = z.infer<typeof changePasswordSchema>;

export default function UpdatePasswordForm() {
  const form = useForm<inferSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfNewPass, setShowConfNewPass] = useState(false);

  const watchedValues = useWatch({ control: form.control });

  const isAllPasswordFilled =
    (watchedValues.currentPassword || "") !== "" &&
    (watchedValues.newPassword || "") !== "" &&
    (watchedValues.confirmNewPassword || "") !== "";

  const pending = form.formState.isSubmitting;

  const onSubmit = async (data: inferSchema) => {
    const res = await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      }),
    });
    const result = await res.json();
    // const result = await profileChangePassword(data);
    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success(result.message);
    form.reset();
  };

  return (
    <div className="mb-8">
      <h2 className="h2 mb-2">Change Password</h2>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="currentPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="">
                <FieldLabel htmlFor="currentPassword">Current Password</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id="currentPassword"
                    type={showCurrentPass ? "text" : "password"}
                    placeholder="Enter currentPassword"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  <InputGroupAddon align="inline-end">
                    <Button
                      type="button"
                      onClick={() => setShowCurrentPass((prev) => !prev)}
                      variant={"ghost"}
                      size={"icon"}
                      tabIndex={-1}
                    >
                      {showCurrentPass ? <EyeIcon /> : <EyeOffIcon />}
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="newPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="">
                <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id="newPassword"
                    type={showNewPass ? "text" : "password"}
                    placeholder="Enter password"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  <InputGroupAddon align="inline-end">
                    <Button
                      type="button"
                      onClick={() => setShowNewPass((prev) => !prev)}
                      variant={"ghost"}
                      size={"icon"}
                      tabIndex={-1}
                    >
                      {showNewPass ? <EyeIcon /> : <EyeOffIcon />}
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
              <Field data-invalid={fieldState.invalid} className="">
                <FieldLabel htmlFor="newPassword">Confirm New Password</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id="confirmNewPassword"
                    type={showConfNewPass ? "text" : "password"}
                    placeholder="Enter password"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  <InputGroupAddon align="inline-end">
                    <Button
                      type="button"
                      onClick={() => setShowConfNewPass((prev) => !prev)}
                      variant={"ghost"}
                      size={"icon"}
                      tabIndex={-1}
                    >
                      {showConfNewPass ? <EyeIcon /> : <EyeOffIcon />}
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
        <Button type="submit" disabled={pending || !isAllPasswordFilled} className="mt-2 w-fit">
          {pending && <Spinner />}
          Change Password
        </Button>
      </form>
    </div>
  );
}

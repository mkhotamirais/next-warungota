"use client";

import Input from "@/components/form/Input";
import Msg from "@/components/form/Msg";
import Button from "@/components/ui/Button";
import React, { useState, useTransition } from "react";

export default function UpdatePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, { errors: string[] }> | undefined>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const res = await fetch("/api/account/change-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword }),
      });
      const result = await res.json();
      console.log(result);

      if (result?.errors || result?.error || result?.message) {
        setErrors(undefined);
        setError("");
        setSuccess("");
        setNewPassword("");
        setConfirmNewPassword("");
      }

      if (result?.errors) {
        setErrors(result.errors);
        return;
      }
      if (result?.error) {
        setError(result.error);
        return;
      }

      if (result?.message) {
        setSuccess(result.message);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        return;
      }
    });
  };

  return (
    <div className="mb-4">
      <h2 className="h2 mb-2">Change Password</h2>
      {success ? <Msg msg={success} /> : null}
      {error ? <Msg msg={error} error /> : null}

      <form onSubmit={handleSubmit}>
        <Input
          label="Current Password"
          id="currentPassword"
          type="password"
          placeholder="Enter your current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          error={errors?.currentPassword?.errors}
        />
        <Input
          label="New Password"
          id="newPassword"
          type="password"
          placeholder="Enter your new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={errors?.newPassword?.errors}
        />
        <Input
          label="Confirm New Password"
          id="confirmNewPassword"
          type="password"
          placeholder="Confirm your new password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          error={errors?.confirmNewPassword?.errors}
        />
        <Button
          type="submit"
          disabled={pending || !currentPassword || !newPassword || !confirmNewPassword}
          className="mt-2"
        >
          Change Password
        </Button>
      </form>
    </div>
  );
}

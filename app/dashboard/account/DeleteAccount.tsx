"use client";

import Input from "@/components/form/Input";
import Button from "@/components/ui/Button";
import React, { useState, useTransition } from "react";
import { signOut } from "next-auth/react";

export default function DeleteAccount() {
  const [isDel, setIsDel] = useState(false);
  const [text, setText] = useState("");
  const [errors, setErrors] = useState<Record<string, { errors: string[] }> | undefined>({});
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const res = await fetch("/api/account/delete-account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const result = await res.json();

      if (!res.ok) {
        setErrors(result?.errors);
        return;
      }
      await signOut({ callbackUrl: "/", redirect: true });
      alert("Your account has been deleted");
      setText("");
      setIsDel(false);
    });
  };

  return (
    <div>
      <h2 className="h2 mb-2">Delete Your Account</h2>
      {isDel ? (
        <div>
          <form onSubmit={handleSubmit}>
            <Input
              id="delete-confirmation"
              label="Delete Confirmation"
              placeholder="type 'delete my account' to confirm deletion"
              value={text}
              onChange={(e) => setText(e.target.value)}
              error={errors?.text?.errors}
            />
            <div className="flex gap-1">
              <Button type="submit" disabled={pending || !text}>
                Confirm
              </Button>
              <Button type="button" variant="secondary" onClick={() => setIsDel(false)}>
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
          <Button type="button" variant="danger" onClick={() => setIsDel(true)}>
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}

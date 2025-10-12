import React from "react";
import UpdateDataForm from "./UpdateDataForm";
import UpdatePasswordForm from "./UpdatePasswordForm";
import { SessionUpdaterProvider } from "@/components/SessionUpdaterProvider";
import DeleteAccount from "./DeleteAccount";

export default function Account() {
  return (
    <div>
      <SessionUpdaterProvider />
      <UpdateDataForm />
      <UpdatePasswordForm />
      <DeleteAccount />
    </div>
  );
}

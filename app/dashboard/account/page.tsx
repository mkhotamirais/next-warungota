import React from "react";
import UpdateDataForm from "./UpdateDataForm";
import UpdatePasswordForm from "./UpdatePasswordForm";
import DeleteAccount from "./DeleteAccount";

export default function Account() {
  return (
    <div>
      <UpdateDataForm />
      <UpdatePasswordForm />
      <DeleteAccount />
    </div>
  );
}

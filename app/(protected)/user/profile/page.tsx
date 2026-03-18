import React from "react";
import UpdateDataForm from "./UpdateDataForm";
import UpdatePasswordForm from "./UpdatePasswordForm";
import DeleteAccount from "./DeleteAccount";
import AuthTitleHeader from "../../AuthTitleHeader";

export default function Profile() {
  return (
    <>
      <AuthTitleHeader title="Profile" />
      <div className="space-y-8">
        <UpdateDataForm />
        <UpdatePasswordForm />
        <DeleteAccount />
      </div>
    </>
  );
}

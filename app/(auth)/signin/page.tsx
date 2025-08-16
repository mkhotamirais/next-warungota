import React from "react";
import { GoogleSignin } from "./OAuthSignin";

export default function Signin() {
  return (
    <>
      <h1 className="h1">Signin</h1>
      <GoogleSignin />
    </>
  );
}

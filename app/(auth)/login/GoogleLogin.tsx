"use client";

import { Button } from "@/components/ui/button";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import React from "react";
import { FaGoogle } from "react-icons/fa6";

export default function GoogleLogin() {
  const onGoogleAuth = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  return (
    <Button className="flex-1" onClick={onGoogleAuth} variant={"outline"}>
      <FaGoogle className="mr-2" /> Login with google
    </Button>
  );
}

import React from "react";
import RegisterForm from "./RegisterForm";
import Link from "next/link";
import { LoginGoogle } from "../login/LoginGoogle";
import { Separator } from "@/components/ui/separator";

export default function Register() {
  return (
    <div>
      <h1 className="h1 text-center mb-4">Register</h1>
      <LoginGoogle label="Register With Google" />
      <Separator className="my-4" />
      <RegisterForm />
      <p className="mt-8 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}

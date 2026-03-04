import React from "react";
import RegisterForm from "./RegisterForm";
import Link from "next/link";

export default function Register() {
  return (
    <div>
      <h1 className="h1 text-center">Register</h1>
      <RegisterForm />
      <p className="mt-8 text-center">
        Already have an account?{" "}
        <Link href="/baas/appwrite/login" className="text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}

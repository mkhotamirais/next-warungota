import React from "react";
import LoginForm from "./LoginForm";
import Link from "next/link";

export default function Login() {
  return (
    <div>
      <h1 className="h1 text-center">Login</h1>
      <LoginForm />
      <p className="mt-8 text-center">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}

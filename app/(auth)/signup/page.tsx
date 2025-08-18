import Link from "next/link";
import SignupForm from "./SignupForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function Signup() {
  return (
    <>
      <h1 className="h1 mb-4">Sign Up</h1>
      <SignupForm />
      <p className="text-sm text-gray-600 mt-3">
        Already have an account?{" "}
        <Link href="/signin" className="link">
          Sign in
        </Link>
      </p>
    </>
  );
}

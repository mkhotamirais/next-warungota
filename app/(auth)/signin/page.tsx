import { Metadata } from "next";
import Link from "next/link";
import SigninForm from "./SigninForm";
import { GithubSignin, GoogleSignin } from "./OAuthSignin";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function Signin() {
  return (
    <>
      <h1 className="h1 mb-4">Sign In</h1>
      <div className="flex flex-col gap-2 sm:flex-row mb-4">
        <div className="flex-1">
          <GoogleSignin />
        </div>
        <div className="flex-1">
          <GithubSignin />
        </div>
      </div>
      <div className="relative text-center mb-4">
        <hr />
        <span className="text-gray-500 px-3 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white">
          or
        </span>
      </div>
      <SigninForm />
      <p className="text-sm text-gray-600 mt-3">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="link">
          Sign up
        </Link>
      </p>
    </>
  );
}

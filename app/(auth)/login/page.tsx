import LoginForm from "./LoginForm";
import Link from "next/link";
import { LoginGoogle } from "./LoginGoogle";
import { Separator } from "@/components/ui/separator";

export default function Login() {
  return (
    <div>
      <h1 className="h1 text-center">Login</h1>
      <LoginGoogle />
      <Separator className="my-6" />
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

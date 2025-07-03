"use client";

import Link from "next/link";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { auth, firestore } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import GoogleLogin from "./GoogleLogin";
import { LoginSchema } from "@/lib/rules";
import ProtectedRouteAuth from "@/layouts/ProtectedRouteAuth";
import { doc, getDoc } from "firebase/firestore";
import { useUserStore } from "@/lib/hooks/useUserStore";

type LoginType = z.infer<typeof LoginSchema>;

export default function Login() {
  const { setUser } = useUserStore();
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const form = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginType) => {
    setPending(true);

    try {
      const res = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = res.user;

      const userRef = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUser({
          id: user.uid,
          name: data.name ?? "",
          email: data.email ?? "",
          photoURL: data.photoURL ?? "",
          role: data.role ?? "user",
          createdAt: data.createdAt.toDate?.() ?? new Date(),
        });
      } else {
        toast.error("User not found");
        return;
      }
      toast.success("Login success");
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <ProtectedRouteAuth>
      <section className="bg-secondary py-12">
        <div className="container">
          <div className="bg-card p-8 rounded-md shadow-md max-w-md mx-auto">
            <div className="mb-4">
              <h1 className="h1">Login</h1>
              <p>
                Do not have an account?{" "}
                <Link href="/register" className="link">
                  Register
                </Link>
              </p>
            </div>

            <div>
              <div className="flex flex-col sm:flex-row gap-2 justify-between">
                <GoogleLogin />
                {/* <GithubLogin /> */}
              </div>

              <div className="relative py-6">
                <p className="z-10 absolute left-1/2 -translate-y-1/2 top-1/2 -translate-x-1/2 text-sm bg-background px-3">
                  Or
                </p>
                <Separator />
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" disabled={pending} placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" disabled={pending} placeholder="******" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={pending || (form.formState.isSubmitted && !form.formState.isValid)}
                    className="w-full"
                  >
                    {pending && <Loader2 className="animate-spin size-4 mr-2" />}
                    Login
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </ProtectedRouteAuth>
  );
}

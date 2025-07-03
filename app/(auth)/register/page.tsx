"use client";

import Link from "next/link";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { auth, firestore } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { RegisterSchema } from "@/lib/rules";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import ProtectedRouteAuth from "@/layouts/ProtectedRouteAuth";
import { useUserStore } from "@/lib/hooks/useUserStore";

type RegisterType = z.infer<typeof RegisterSchema>;

export default function Register() {
  const { setUser } = useUserStore();
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const form = useForm<RegisterType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: RegisterType) => {
    setPending(true);

    try {
      const res = await createUserWithEmailAndPassword(auth, values.email, values.password);
      await updateProfile(res.user, { displayName: values.name });

      const userRef = doc(firestore, "users", res.user.uid);
      await setDoc(userRef, {
        name: values.name,
        email: values.email,
        role: "user",
        photoURL: "",
        createdAt: serverTimestamp(),
      });

      setUser({
        id: res.user.uid,
        name: values.name,
        email: values.email,
        photoURL: "",
        role: "user",
        createdAt: new Date(),
      });

      toast.success("Register success");
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
              <h1 className="h1">Register</h1>
              <p>
                Already have an account?{" "}
                <Link href="/login" className="link">
                  Login
                </Link>
              </p>
            </div>
            <div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input type="text" disabled={pending} placeholder="Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
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
                    Register
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

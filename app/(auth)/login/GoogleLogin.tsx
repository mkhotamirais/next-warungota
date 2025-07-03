"use client";

import { Button } from "@/components/ui/button";
import { auth, firestore, googleProvider } from "@/lib/firebase";
import { useUserStore } from "@/lib/hooks/useUserStore";
import { TUserRole } from "@/lib/types";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import React from "react";
import { FaGoogle } from "react-icons/fa6";
import { toast } from "sonner";

export default function GoogleLogin() {
  const { setUser } = useUserStore();

  const onGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (!user) return;

      const userRef = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName || "",
          email: user.email,
          photoURL: user.photoURL,
          role: "user", // default
          createdAt: serverTimestamp(),
        });

        setUser({
          id: user.uid,
          name: user.displayName || "",
          email: user.email || "",
          photoURL: user.photoURL || "",
          role: "user",
          createdAt: new Date(),
        });
      } else {
        const data = docSnap.data();

        const role = (data.role as TUserRole) ?? "user";

        setUser({
          id: user.uid,
          name: data.name ?? user.displayName ?? "",
          email: data.email ?? user.email ?? "",
          photoURL: data.photoURL ?? user.photoURL ?? "",
          role,
          createdAt: data.createdAt?.toDate?.() ?? new Date(),
        });
      }

      toast.success("Berhasil login dengan Google");
    } catch (error) {
      console.error("Gagal login dengan Google:", error);
    }
  };

  return (
    <Button className="flex-1" onClick={onGoogleAuth} variant={"outline"}>
      <FaGoogle className="mr-2" /> Login with google
    </Button>
  );
}

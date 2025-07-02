"use client";

import { Button } from "@/components/ui/button";
import { auth, firestore, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import React from "react";
import { FaGoogle } from "react-icons/fa6";
import { toast } from "sonner";

export default function GoogleLogin() {
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
          role: "user",
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
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

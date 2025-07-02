"use client";

import Pending from "@/components/Pending";
import { auth } from "@/lib/firebase";
import { useFirebaseStore } from "@/lib/firebaseStore";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const { setUser, isMounted, setIsMounted } = useFirebaseStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setIsMounted(true);
    });

    return () => unsubscribe();
  }, [setUser, setIsMounted]);

  if (!isMounted) return <Pending />;

  return <>{children}</>;
}

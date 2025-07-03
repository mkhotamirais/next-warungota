import { useEffect } from "react";
import { auth, firestore } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useFirebaseStore } from "@/lib/firebaseStore";

export function useAuthListener() {
  const { setUser, setIsMounted } = useFirebaseStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(firestore, "users", user.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};

          setUser({
            id: user.uid,
            email: user.email,
            name: userData.displayName || "",
            role: userData.role || "",
            photoURL: userData.photoURL || "",
            ...userData,
          });
        } catch (error) {
          if (error instanceof Error) console.error(error.message);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsMounted(true);
    });

    return () => unsubscribe();
  }, [setUser, setIsMounted]);
}

import { useCallback, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { IProduct } from "@/lib/types";
import { useProductStore } from "./useProductStore";

export function useFetchProductById(id: string | undefined) {
  const { product, setProduct, pendingProduct, setPendingProduct } = useProductStore();

  const fetchProduct = useCallback(async () => {
    if (!id) return;

    try {
      setPendingProduct(true);
      const docRef = doc(firestore, "products", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() } as IProduct);
      } else {
        setProduct(null);
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setPendingProduct(false);
    }
  }, [id, setProduct, setPendingProduct]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, pendingProduct };
}

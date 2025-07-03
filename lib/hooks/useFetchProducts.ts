import { useCallback, useEffect } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { IProduct } from "@/lib/types";
import { useProductStore } from "./useProductStore";

type Options = {
  category?: string;
  searchTerm?: string;
  sortByPrice?: "asc" | "desc";
};

export function useFetchProducts(options?: Options) {
  const { products, setProducts, pendingProducts, setPendingProducts } = useProductStore();

  const getData = useCallback(async () => {
    try {
      setPendingProducts(true);

      let q = query(collection(firestore, "products"));

      // Filtering
      if (options?.category) {
        q = query(q, where("category", "==", options.category));
      }

      // Sorting
      if (options?.sortByPrice) {
        q = query(q, orderBy("price", options.sortByPrice));
      }

      const querySnapshot = await getDocs(q);

      let data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as IProduct[];

      // Search (client-side)
      if (options?.searchTerm) {
        const term = options.searchTerm.toLowerCase();
        data = data.filter((item) => item.name.toLowerCase().includes(term));
      }

      setProducts(data);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Fetch product error:", error.message);
      }
    } finally {
      setPendingProducts(false);
    }
  }, [options, setPendingProducts, setProducts]);

  useEffect(() => {
    getData();
  }, [getData]);

  return { products, pendingProducts };
}

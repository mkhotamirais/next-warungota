"use client";

import { firestore } from "@/lib/firebase";
import { useFirebaseProductStore } from "@/lib/firebaseProductStore";
import { IProduct } from "@/lib/types";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useCallback, useEffect } from "react";

export default function ShowProduct() {
  const { product, setProduct, pendingProduct, setPendingProduct } = useFirebaseProductStore();

  const params = useParams();
  const { id } = params;

  const getData = useCallback(async () => {
    if (!id) return;
    try {
      setPendingProduct(true);
      const docRef = doc(firestore, "products", id?.toString() ?? "");
      const docSnap = await getDoc(docRef);
      setProduct(docSnap.data() as IProduct);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    } finally {
      setPendingProduct(false);
    }
  }, [id, setPendingProduct, setProduct]);

  useEffect(() => {
    getData();
  }, [getData]);

  let content;
  if (pendingProduct) {
    content = <p>Loading...</p>;
  } else {
    if (product) {
      content = <p>{product.name}</p>;
    } else {
      content = <p>Product not found</p>;
    }
  }
  return (
    <section>
      <div className="container">
        <h1 className="h1">Product Detail</h1>
        {content}
      </div>
    </section>
  );
}

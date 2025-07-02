"use client";

import { Button } from "@/components/ui/button";
import { firestore } from "@/lib/firebase";
import { useFirebaseProductStore } from "@/lib/firebaseProductStore";
import { IProduct } from "@/lib/types";
import { collection, getDocs, query } from "firebase/firestore";
import Link from "next/link";
import React, { useCallback, useEffect } from "react";

export default function Products() {
  const { products, setProducts, pending, setPending } = useFirebaseProductStore();

  const getData = useCallback(async () => {
    try {
      setPending(true);

      const q = query(collection(firestore, "products"));
      const querySnapshot = await getDocs(q);
      const filteredData = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setProducts(filteredData as IProduct[]);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    } finally {
      setPending(false);
    }
  }, [setPending, setProducts]);

  useEffect(() => {
    getData();
  }, [getData]);

  let content;

  if (pending) {
    content = <p>Loading...</p>;
  } else {
    if (products && products.length > 0) {
      content = (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-1 lg:gap-2">
          {products.map((product: IProduct) => (
            <div key={product.id} className="border">
              <h3>{product.name}</h3>
              <p>{product.price}</p>
              <Link href={`/products/show/${product.id}`}>Detail</Link>
            </div>
          ))}
        </div>
      );
    } else {
      content = <p>No products found</p>;
    }
  }
  return (
    <section>
      <div className="container">
        <h1>Products</h1>
        <Link href="/products/create">
          <Button>add product</Button>
        </Link>
        {content}
      </div>
    </section>
  );
}

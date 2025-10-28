import { searchAll } from "@/actions/search-all";
import React from "react";
import ResultProducts from "./ResultProducts";
import ResultBlogs from "./ResultBlogs";

export default async function Results({ keyword = "" }: { keyword?: string | undefined }) {
  const results = await searchAll(keyword);
  const products = results?.products;
  const blogs = results?.blogs;

  return (
    <div className="space-y-3">
      {products?.length === 0 && blogs?.length === 0 ? (
        <p>Tidak ada hasil pencarian</p>
      ) : (
        <div className="space-y-3">
          <ResultProducts products={products} />
          <ResultBlogs blogs={blogs} />
        </div>
      )}
    </div>
  );
}

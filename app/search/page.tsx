import { searchAll } from "@/actions/search-all";
import BlogCardForAll from "@/components/sections/BlogCardForAll";
import ProductCard from "@/components/sections/ProductCard";
import React from "react";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ keyword: string }> }) {
  const keyword = (await searchParams).keyword;

  const results = await searchAll(keyword);
  const products = results?.products;
  const blogs = results?.blogs;

  return (
    <section className="py-8">
      <div className="container space-y-3">
        <h1 className="text-xl">
          Hasil Pencarian <b>`{keyword}`</b>
        </h1>
        <div className="space-y-3">
          {products?.length === 0 && blogs?.length === 0 ? (
            <p>Tidak ada hasil pencarian</p>
          ) : (
            <div className="space-y-3">
              <div>
                {products && products?.length > 0 && (
                  <div>
                    <h2 className="mb-2 font-bold">Hasil dari Produk</h2>
                    <div className="grid-all-list">
                      {products?.map((product) => (
                        <ProductCard key={product.id} item={product} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div>
                {blogs && blogs?.length > 0 ? (
                  <div>
                    <h2 className="mb-2 font-bold">Hasil dari Blog</h2>
                    <div className="grid-all-list">
                      {blogs?.map((blog) => (
                        <BlogCardForAll key={blog.id} blog={blog} />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

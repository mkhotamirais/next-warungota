import { searchAll } from "@/actions/search-all";
import Image from "next/image";
import React from "react";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ keyword: string }> }) {
  const keyword = (await searchParams).keyword;

  const results = await searchAll(keyword);
  const products = results?.products as { id: string; name: string; imageUrl: string; price: number }[];
  const blogs = results?.blogs as { id: string; imageUrl: string; title: string }[];

  return (
    <section className="py-8">
      <div className="container">
        <h1>Hasil Pencarian `{keyword}`</h1>
        <div>
          {!products && !blogs ? (
            <p>Tidak ada hasil pencarian</p>
          ) : (
            <div>
              {products.length > 0 && (
                <div>
                  <h2>Produk</h2>
                  <div>
                    {products?.map((product) => (
                      <div className="border flex items-center justify-between" key={product.id}>
                        <div className="flex items-center">
                          <Image src={product.imageUrl} alt={product.name} width={100} height={100} />
                          <h3>{product.name}</h3>
                        </div>
                        <p>{product.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {blogs?.length > 0 ? (
                <div>
                  <h2>Blog</h2>
                  <ul>
                    {blogs?.map((blog: { id: string; title: string }) => (
                      <li key={blog.id}>{blog.title}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

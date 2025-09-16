// app/blog/page.tsx

import Hero from "@/components/sections/Hero";
import React, { Suspense } from "react";
import { content as c } from "@/lib/content";
import { getBlogs } from "@/actions/blog";
import Load from "@/components/fallbacks/Load";
import Pagination from "@/components/ui/Pagination";
import AsideBlogCategory from "@/components/sections/AsideBlogCategory";
import List from "./List";

const { title, description } = c.blog;

// Definisikan limit per halaman di sini juga agar konsisten
const LIMIT = 3;

// Fungsi ini akan dijalankan saat `next build`
export async function generateStaticParams() {
  // Panggil getBlogs untuk mendapatkan total jumlah blog.
  // Kita hanya butuh totalBlogsCount, jadi set limit kecil (misal 1).
  const { totalBlogsCount } = await getBlogs({ limit: 1 });

  // Hitung total halaman berdasarkan total blog dan limit
  const totalPages = Math.ceil(totalBlogsCount / LIMIT);

  // Buat array params untuk setiap halaman
  // contoh: [{ page: '1' }, { page: '2' }, { page: '3' }]
  const pages = Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString(),
  }));

  // Jika Anda ingin membuat halaman utama tanpa paginasi (root) juga statis,
  // tambahkan params untuk halaman 1.
  return [{ page: "1" }, ...pages];
}

// Gunakan 'params' daripada 'searchParams' karena URL akan menjadi '/blog/[page]'
export default async function Blog({ params }: { params: { page?: string } }) {
  // Ambil nomor halaman dari params. Default ke 1 jika tidak ada
  const page = Number(params.page || 1);

  // Panggil getBlogs untuk mendapatkan data untuk halaman spesifik
  const { blogs, totalPages } = await getBlogs({ page, limit: LIMIT });

  return (
    <>
      <Hero title={title} description={description} />
      <section className="py-12">
        <div className="container flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-3/4">
            {blogs?.length ? (
              <>
                <Suspense fallback={<Load />}>
                  <List blogs={blogs} />
                </Suspense>
                <Pagination totalPages={totalPages} />
              </>
            ) : (
              <h2 className="h2">No Blog Found</h2>
            )}
          </div>
          <div className="w-full md:w-1/4">
            <AsideBlogCategory />
          </div>
        </div>
      </section>
    </>
  );
}

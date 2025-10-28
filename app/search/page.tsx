import React, { Suspense } from "react";
import FallbackSearch from "./FallbackSearch";
import Results from "./Results";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ keyword: string }> }) {
  const keyword = (await searchParams).keyword;

  return (
    <section className="py-8">
      <div className="container space-y-3">
        <h1 className="text-xl">
          Hasil Pencarian <b>`{keyword}`</b>
        </h1>
        <Suspense fallback={<FallbackSearch />}>
          <Results keyword={keyword} />
        </Suspense>
      </div>
    </section>
  );
}

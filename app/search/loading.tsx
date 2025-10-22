import React from "react";
import FallbackSearch from "./FallbackSearch";

export default function Loading() {
  return (
    <section className="py-8">
      <div className="container">
        <h1 className="text-xl">Mencari...</h1>
        <FallbackSearch />
      </div>
    </section>
  );
}

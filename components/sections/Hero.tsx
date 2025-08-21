import React from "react";

export default function Hero({ title, description }: { title: string; description?: string }) {
  return (
    <section className="py-12 bg-gray-100">
      <div className="container text-center">
        <h1 className="h1 mb-4">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
    </section>
  );
}

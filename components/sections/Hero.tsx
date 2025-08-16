import React from "react";

export default function Hero({ title, description }: { title: string; description?: string }) {
  return (
    <section className="py-12 bg-gray-100">
      <div className="container">
        <h1 className="h1">{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}

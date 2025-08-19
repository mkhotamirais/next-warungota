import React from "react";

export default async function BlogSlug({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  return <div>BlogSlug {slug}</div>;
}

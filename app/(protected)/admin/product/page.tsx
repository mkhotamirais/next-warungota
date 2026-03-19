import BasePage from "./BasePage";
import { Suspense } from "react";
import HeaderProductAdmin from "./HeaderProductAdmin";
import FallbackSearchProductsAdmin from "@/components/fallbacks/FallbackSearchProductsAdmin";
import { limits as l } from "@/lib/constants";

interface Props {
  params: Promise<{ page?: string }>;
  // searchParams: Promise<{ keyword?: string; "keyword-admin"?: string }>;
}

export default async function Product({ params }: Props) {
  const page = Number((await params).page) || 1;
  // const keyword = (await searchParams).keyword || undefined;
  // const keywordAdmin = (await searchParams)["keyword-admin"] || undefined;

  // const keys = `${page}-${limit}-${keyword}-${keywordAdmin}`;
  const keys = `${page}-${l.product}`;

  return (
    <>
      <HeaderProductAdmin />
      <Suspense fallback={<FallbackSearchProductsAdmin />} key={keys}>
        {/* <BasePage page={page} limit={limit} keyword={keyword} keywordAdmin={keywordAdmin} /> */}
        <BasePage page={page} limit={l.product} />
      </Suspense>
    </>
  );
}

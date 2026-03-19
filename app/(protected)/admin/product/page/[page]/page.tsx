import BasePage from "../../BasePage";
import HeaderProductAdmin from "../../HeaderProductAdmin";
import FallbackSearchProductsAdmin from "@/components/fallbacks/FallbackSearchProductsAdmin";
import { Suspense } from "react";
import { baseUrl, limits as l } from "@/lib/constants";
// import { getProducts } from "@/actions/product";

interface Props {
  params: Promise<{ page?: string }>;
  // searchParams: Promise<{ keyword?: string; "keyword-admin"?: string }>;
}

export const generateStaticParams = async () => {
  // const { totalProductsCount: totalCount } = await getProducts({ limit: productLimit });
  const { totalProductsCount: totalCount } = await fetch(`${baseUrl}/api/product`, { cache: "no-cache" }).then((res) =>
    res.json(),
  );

  const totalPages = Math.ceil(totalCount / l.product);

  return Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }));
};

export default async function ProductPage({ params }: Props) {
  const page = Number((await params).page || 1);
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

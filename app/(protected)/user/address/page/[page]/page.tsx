import { baseUrl, limits as l } from "@/lib/constants";
import BasePage from "../../BasePage";

export const generateStaticParams = async () => {
  // const { totalProductsCount: totalCount } = await getProducts({ limit: productLimit });
  const { totalProductsCount: totalCount } = await fetch(`${baseUrl}/api/account/address`, { cache: "no-cache" }).then(
    (res) => res.json(),
  );

  const totalPages = Math.ceil(totalCount / l.address);

  return Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }));
};

export default async function AddressPage({ params }: { params: Promise<{ page?: string }> }) {
  const page = Number((await params).page || 1);
  const limit = 8;

  return <BasePage page={page} limit={limit} />;
}

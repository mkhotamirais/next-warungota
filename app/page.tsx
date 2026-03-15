import { getProducts } from "@/actions/product";
import { getProductCategories } from "@/actions/product-category";
import HomeHero from "@/components/home/HomeHero";
import HomeProductCategoryList from "@/components/home/HomeProductCategoryList";
import HomeProductList from "@/components/home/HomeProductList";

export default async function Home() {
  const { products } = await getProducts({ limit: 12 });
  const categories = await getProductCategories();

  return (
    <div className="container">
      <HomeHero />
      <HomeProductCategoryList categories={categories} />
      <HomeProductList products={products} />
    </div>
  );
}

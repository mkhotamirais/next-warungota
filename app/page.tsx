import HomeHero from "@/components/home/HomeHero";
import HomeProductCategoryList from "@/components/home/HomeProductCategoryList";
import HomeProductList from "@/components/home/HomeProductList";
import React from "react";

export default function Home() {
  return (
    <div className="container">
      <HomeHero />
      <HomeProductCategoryList />
      <HomeProductList />
    </div>
  );
}

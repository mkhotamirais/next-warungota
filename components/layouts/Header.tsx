import React from "react";
import AuthBtn from "./AuthBtn";
import Logo from "../Logo";
import CartBtn from "./CartBtn";
import SearchAllProducts from "./SearchAllProducts";
// import NavDesktop from "./NavDesktop";
// import SearchBtn from "./SearchBtn";

export default function Header() {
  return (
    <header className="h-16 bg-white sticky top-0 z-30 border-b border-gray-200">
      <div className="container flex items-center justify-between gap-2">
        <Logo />
        <div className="flex items-center justify-between gap-2">
          <SearchAllProducts />
          <CartBtn />
          <AuthBtn />
        </div>
      </div>
    </header>
  );
}

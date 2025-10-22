import React from "react";
import AuthBtn from "./AuthBtn";
import Logo from "../Logo";
import CartBtn from "./CartBtn";
import NavMobile from "./NavMobile";
import NavDesktop from "./NavDesktop";
import SearchBtn from "./SearchBtn";

export default function Header() {
  return (
    <header className="h-16 bg-white sticky top-0 z-30 border-b border-gray-200">
      <div className="container flex items-center justify-between">
        <Logo />
        {/* nav desktop */}
        <div className="hidden md:flex">
          <div className="flex items-center gap-1">
            <NavDesktop />
            <div className="ml-4">
              <SearchBtn />
            </div>
            <CartBtn />
            <div className="ml-4">
              <AuthBtn />
            </div>
          </div>
        </div>
        {/* nav mobile */}
        <div className="md:hidden flex items-center gap-1 lg:gap-2">
          <SearchBtn />
          <CartBtn />
          <NavMobile />
        </div>
      </div>
    </header>
  );
}

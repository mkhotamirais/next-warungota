import React from "react";
// import AuthBtn from "./AuthBtn";
import Logo from "../Logo";
// import CartBtn from "./CartBtn";
import NavMobile from "./NavMobile";
import NavDesktop from "./NavDesktop";

export default function Header() {
  return (
    <header className="h-16 bg-white sticky top-0 z-30 border-b border-gray-200">
      <div className="container flex items-center justify-between">
        <Logo />
        {/* nav desktop */}
        <div className="hidden md:flex">
          <div className="flex items-center gap-1">
            <NavDesktop />
            {/* <CartBtn /> */}
            <div className="ml-4">{/* <AuthBtn /> */}</div>
          </div>
        </div>
        {/* nav mobile */}
        <NavMobile />
      </div>
    </header>
  );
}

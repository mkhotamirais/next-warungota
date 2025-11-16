import React from "react";
import Logo from "../Logo";
import AuthBtn from "./AuthBtn";
import CartBtn from "./CartBtn";
import SearchBtn2 from "./SearchBtn2";

export default function Header2() {
  return (
    <header className="h-16 bg-white sticky top-0 z-30 border-b border-gray-200">
      <div className="container flex items-center justify-between">
        <div className="flex justify-between w-full">
          <Logo />
          <div className="flex items-center gap-1">
            <SearchBtn2 />
            <CartBtn />
            <AuthBtn />
          </div>
        </div>
      </div>
    </header>
  );
}

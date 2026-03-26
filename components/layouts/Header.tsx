import React from "react";
import Logo from "../Logo";
import NavDesktop from "./NavDesktop";
// import NavMobile from "./NavMobile";
import { menu as m } from "@/lib/constants";
import AuthBtn from "./AuthBtn";
import NavMobilePushBtn from "./NavMobilePushBtn";
import NavMobilePush from "./NavMobilePush";
// import CartBtn from "../CartBtn";

export default function Header() {
  return (
    <header className="sticky top-0 bg-white z-30">
      <div className="container flex gap-8 items-center justify-between h-full min-h-16">
        <Logo />
        <div className="flex-1 flex gap-2 items-cente justify-end md:justify-between">
          <NavDesktop menu={m.main} />
          <div className="flex gap-2 items-center">
            {/* <CartBtn /> */}
            <AuthBtn />
            <NavMobilePushBtn />
          </div>
        </div>
      </div>
      <NavMobilePush />
    </header>
  );
}

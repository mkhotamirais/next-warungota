import React from "react";
import Logo from "../Logo";
import NavDesktop from "./NavDesktop";
import NavMobile from "./NavMobile";
import { menu as m } from "@/lib/constants";
import AuthBtn from "./AuthBtn";

export default function Header() {
  return (
    <header className="h-16 sticky top-0 bg-white z-30">
      <div className="container">
        <div className="flex gap-8 items-center justify-between h-full">
          <Logo />
          <div className="flex-1 flex justify-end gap-2">
            <div className="flex justify-end md:justify-between w-full">
              <NavDesktop menu={m.main} />
              <AuthBtn />
            </div>
            <NavMobile menu={m.main} />
          </div>
        </div>
      </div>
    </header>
  );
}

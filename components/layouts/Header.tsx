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
          <div className="flex-1">
            <NavDesktop menu={m.main} authBtn={<AuthBtn />} />
            <NavMobile menu={m.main} authBtn={<AuthBtn />} />
          </div>
        </div>
      </div>
    </header>
  );
}

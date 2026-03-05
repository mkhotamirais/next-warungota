import React from "react";
import Logo from "../Logo";
import { menu as m } from "@/lib/constants";
import NavDesktop from "@/components/layouts/NavDesktop";
import NavMobile from "@/components/layouts/NavMobile";
import AuthBtn from "./AuthBtn";

export default function Header() {
  return (
    <header className="h-16 sticky top-16 bg-white z-30">
      <div className="container">
        <div className="flex gap-8 items-center justify-between h-full">
          <Logo />
          <div className="flex-1">
            <NavDesktop menu={m.appwrite} authBtn={<AuthBtn />} />
            <NavMobile menu={m.appwrite} />
          </div>
        </div>
      </div>
    </header>
  );
}

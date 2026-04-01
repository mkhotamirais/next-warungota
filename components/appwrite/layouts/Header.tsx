"use client";

import React from "react";
import Logo from "../Logo";
import { menu as m } from "@/lib/constants";
import NavDesktop from "@/components/layouts/NavDesktop";
import AuthBtn from "./AuthBtn";
import NavMobilePushBtn from "@/components/layouts/NavMobilePushBtn";
import { useMenuBar } from "@/hooks/zustand/useMenuBar";
import NavMobilePushContent from "@/components/layouts/NavMobilePushContent";

export default function Header() {
  const { openAppwriteBar, setOpenAppwriteBar } = useMenuBar();
  const menu = m.appwrite;

  return (
    <header className="sticky top-0 bg-white z-30">
      <div className="container flex gap-8 items-center justify-between h-full min-h-16">
        <Logo />
        <div className="flex-1 flex gap-2 items-center justify-end md:justify-between">
          <NavDesktop menu={m.appwrite} />
          <div className="flex gap-2 items-center">
            {/* <CartBtn /> */}
            <AuthBtn />
            <NavMobilePushBtn open={openAppwriteBar} setOpen={setOpenAppwriteBar} />
          </div>
        </div>
      </div>
      <NavMobilePushContent open={openAppwriteBar} setOpen={setOpenAppwriteBar} menu={menu} />
    </header>
  );
}

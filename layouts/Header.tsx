import Logo from "@/components/Logo";
import React from "react";
import NavMobile from "./NavMobile";
import NavDesktop from "./NavDesktop";
import NavUser from "./NavUser";
import UserProvider from "./UserProvider";

export default function Header() {
  return (
    <header className="h-16 sticky top-0 z-50 bg-background">
      <div className="container flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-1 sm:gap-2">
          <NavDesktop />
          <UserProvider>
            <NavUser />
            <NavMobile />
          </UserProvider>
        </div>
      </div>
    </header>
  );
}

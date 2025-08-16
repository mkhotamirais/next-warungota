import React from "react";
import Logo from "./Logo";
import NavDesktop from "./NavDesktop";

export default function Header() {
  return (
    <header className="h-16 bg-white sticky top-0 z-30 border-b border-gray-200">
      <div className="container flex items-center justify-between">
        <Logo />
        <nav>
          <NavDesktop />
        </nav>
      </div>
    </header>
  );
}

"use client";

import { menu } from "./menu";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Menu } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import NavMobileSideAbsolute from "./NavMobileSideAbsolute";
import NavMobileTopPushContent from "./NavMobileTopPushContent";
import NavMobileTopPushBtn from "./NavMobileTopPushBtn";

export default function Navbar1() {
  const [hoveredMenu, setHoveredMenu] = useState("");
  const [hoveredMenu2, setHoveredMenu2] = useState("");

  return (
    <div>
      <header className="border-b sticky top-16">
        <div className="container flex items-center justify-between min-h-16 bg-white">
          <div>Logo</div>

          {/* nav desktop */}
          <nav className="hidden md:flex gap-1">
            {menu.map((item, i) => (
              <motion.div key={i} onMouseEnter={() => setHoveredMenu(item.label)} className="relative">
                {!item.sub_menu ? (
                  <>
                    <Button variant={"ghost"} asChild className="">
                      <Link href={item.url} className="px-2">
                        {item.label}
                      </Link>
                    </Button>
                    {item.label === hoveredMenu ? (
                      <motion.div
                        layoutId="underline"
                        id="underline"
                        className="absolute inset-0 bg-gray-100 -z-10 rounded-lg"
                      />
                    ) : null}
                  </>
                ) : (
                  <div className="relative group/main">
                    <Button variant={"ghost"} className="">
                      {item.label}
                      <ChevronDown className="group-hover/main:rotate-180 transition-transform" />
                    </Button>
                    {item.label === hoveredMenu ? (
                      <motion.div
                        layoutId="underline"
                        id="underline"
                        className="absolute inset-0 bg-gray-100 -z-10 rounded-lg"
                      />
                    ) : null}
                    <div className="invisible opacity-0 translate-y-1.5 group-hover/main:visible group-hover/main:opacity-100 group-hover/main:translate-y-0 flex absolute bg-white p-1 border flex-col rounded-lg transition-transform">
                      {item.sub_menu.map((itm, idx) => (
                        <div key={idx} onMouseEnter={() => setHoveredMenu2(itm.label)} className="relative">
                          {!itm.sub_menu_2 ? (
                            <>
                              <Button key={idx} variant={"ghost"} asChild className="w-full justify-start">
                                <Link href={itm.url} key={idx} className="">
                                  {itm.label}
                                </Link>
                              </Button>
                              {itm.label === hoveredMenu2 ? (
                                <motion.div
                                  layoutId="underline2"
                                  id="underline2"
                                  className="absolute inset-0 bg-gray-100 -z-10 rounded-lg"
                                />
                              ) : null}
                            </>
                          ) : (
                            <div className="relative group/sub">
                              <Button variant={"ghost"}>
                                {itm.label}
                                <ChevronRight className="group-hover/sub:rotate-180 transition-transform" />
                              </Button>
                              {itm.label === hoveredMenu2 ? (
                                <motion.div
                                  layoutId="underline2"
                                  id="underline2"
                                  className="absolute inset-0 bg-gray-100 -z-10 rounded-lg"
                                />
                              ) : null}
                              <div className="invisible opacity-0 translate-x-1.5 group-hover/sub:visible group-hover/sub:opacity-100 group-hover/sub:translate-x-0 flex absolute bg-white p-1 ml-1 border flex-col transition-all rounded-lg top-0 left-full">
                                {itm.sub_menu_2.map((x, y) => (
                                  <div key={y}>
                                    <Button key={y} variant={"ghost"} asChild>
                                      <Link href={x.url} key={y} className="w-max">
                                        {x.label}
                                      </Link>
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </nav>

          {/* nav mobile */}
          <div className="flex gap-2 md:hidden">
            <NavMobileSideAbsolute />
            <NavMobileTopPushBtn />
          </div>
          {/* <NavMobileTopPushContent /> */}
        </div>
        <NavMobileTopPushContent />
      </header>
      <main>
        <div className="container">
          Content Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, laudantium aliquid cum ratione
          velit voluptas eaque assumenda tempora ad minus accusantium inventore placeat iste non id nemo perferendis.
          Vero odit consectetur modi tempore illum magnam blanditiis eum. Molestias illum minus aperiam harum ex
          consectetur, animi fugit nesciunt ab perspiciatis sequi id iste unde quam quaerat tempore sed quis vel ut
          perferendis veniam, omnis error excepturi architecto. Odit aliquid molestiae cum distinctio in quam placeat
          velit reprehenderit quidem incidunt doloribus, ducimus voluptatem cupiditate reiciendis ratione officiis non.
          Illum eveniet reprehenderit adipisci ducimus, repellat non recusandae exercitationem omnis eos, unde,
          doloremque deserunt.
        </div>
      </main>
    </div>
  );
}

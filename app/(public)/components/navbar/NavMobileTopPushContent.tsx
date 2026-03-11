"use client";

import React from "react";
import { useNavMobileTopPush } from "./useNavMobileTopPush";
import { menu } from "./menu";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export default function NavMobileTopPushContent() {
  const { open } = useNavMobileTopPush();

  return (
    <div
      className={`grid transition-all duration-300 ease-in-out md:hidden ${
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="overflow-hidden">
        <div className="p-4">
          <div>
            {menu.map((item, i) => (
              <div key={i} className="mb-2">
                {!item.sub_menu ? (
                  <Button asChild variant={"ghost"} className="block">
                    <Link href={item.url} className="block py-2 px-4 hover:bg-gray-200">
                      {item.label}
                    </Link>
                  </Button>
                ) : (
                  <Accordion type="single" collapsible>
                    <AccordionItem value={item.label}>
                      <AccordionTrigger
                        className={cn(
                          // Kita ambil style 'ghost' dari Button
                          buttonVariants({ variant: "ghost" }),
                          "w-full justify-between hover:no-underline px-4 py-2",
                        )}
                      >
                        {item.label}
                      </AccordionTrigger>
                      {item.sub_menu.map((itm, idx) => (
                        <AccordionContent key={idx} className="pb-0 ml-2">
                          {!itm.sub_menu_2 ? (
                            <Button asChild variant={"ghost"} className="block">
                              <Link href={itm.url}>{itm.label}</Link>
                            </Button>
                          ) : (
                            <Accordion type="single" collapsible>
                              <AccordionItem value={itm.label}>
                                <AccordionTrigger
                                  className={cn(
                                    // Kita ambil style 'ghost' dari Button
                                    buttonVariants({ variant: "ghost" }),
                                    "w-full justify-between hover:no-underline px-4! py-2",
                                  )}
                                >
                                  {itm.label}
                                </AccordionTrigger>
                                {itm.sub_menu_2.map((itms, idxx) => (
                                  <AccordionContent key={idxx} className="pb-0 ml-2">
                                    <Button asChild variant={"ghost"} className="block">
                                      <Link href={itms.url}>{itms.label}</Link>
                                    </Button>
                                  </AccordionContent>
                                ))}
                              </AccordionItem>
                            </Accordion>
                          )}
                        </AccordionContent>
                      ))}
                    </AccordionItem>
                  </Accordion>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

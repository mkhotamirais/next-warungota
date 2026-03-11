"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import React from "react";
import { acc } from "./acc";
import { Separator } from "@/components/ui/separator";

export default function Acc3() {
  return (
    <>
      <h2>Accordion Shadcn</h2>

      {/* <Accordion type="single" collapsible defaultValue="item-1"> */}
      <Accordion type="single" collapsible>
        {acc.map((item, i) => (
          <AccordionItem key={i} value={item.title}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>{item.description}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Separator className="my-4" />

      <Accordion type="multiple">
        {acc.map((item, i) => (
          <AccordionItem key={i} value={item.title}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>{item.description}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}

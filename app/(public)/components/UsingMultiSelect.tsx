"use client";

import { MultiSelect } from "@/components/ui/custom/multi-select";
import React, { useState } from "react";

export default function UsingMultiSelect() {
  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  const [value, setValue] = useState<string[]>(["chocolate"]);
  return <MultiSelect options={options} defaultValue={value} onValueChange={(val) => setValue(val)} />;
}

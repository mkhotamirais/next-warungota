"use client";

import MultiInput from "@/components/ui/custom/multi-input";
import React, { useState } from "react";

export default function UsingMultiInput() {
  const [tags, setTags] = useState<string[]>([]);

  return <MultiInput value={tags} onChange={setTags} placeholder="Contoh: Ayam, Kucing" />;
}

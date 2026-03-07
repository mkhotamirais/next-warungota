"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

type CodeBlockProps = {
  code: string;
  className?: string;
};

export const CodeBlockWithCopy = ({ code, className }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={cn("flex items-center gap-2 border p-2 rounded", className)}>
      {/* Cukup pakai span dengan break-all agar teks turun ke bawah jika kepanjangan */}
      <span className="font-mono text-sm break-all flex-1">{code}</span>

      <Button onClick={handleCopy} variant="ghost" size="icon" className="h-8 w-8 shrink-0">
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
      </Button>
    </div>
  );
};

"use client";

import { useSession } from "next-auth/react";
import React from "react";
import { LuRefreshCcw } from "react-icons/lu";

export default function RefreshData() {
  const { update } = useSession();
  const refreshData = async () => {
    await update({});
  };

  return (
    <button
      type="button"
      onClick={refreshData}
      aria-label="Refresh"
      className="text-lg p-3 bg-gray-100 hover:bg-gray-200 transition-all rounded"
    >
      <LuRefreshCcw />
    </button>
  );
}

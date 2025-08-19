import React from "react";
import clsx from "clsx";

interface MsgProps {
  msg: string;
  status?: string;
}

export default function Msg({ msg, status }: MsgProps) {
  return (
    <div
      className={clsx("text-sm border rounded py-2 mb-1 px-3", {
        "text-red-500 bg-red-100 border-red-500": status === "error",
        "text-green-500 bg-green-100 border-green-500": status === "success",
      })}
    >
      <p>{msg}</p>
    </div>
  );
}

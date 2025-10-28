"use client";

import Msg from "@/components/form/Msg";
import { useProduct } from "@/hooks/useProduct";
import React from "react";

export default function ProductMsg() {
  const { successMsg, errorMsg } = useProduct();

  return (
    <>
      {successMsg ? <Msg msg={successMsg} /> : null}
      {errorMsg ? <Msg msg={errorMsg} error /> : null}
    </>
  );
}

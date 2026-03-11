import React from "react";
import Acc1 from "./Acc1";
import Acc2 from "./Acc2";
import Acc3 from "./Acc3";

export default function AccordionPage() {
  return (
    <div>
      <div className="container">
        <div className="max-w-xl">
          <h1>Accordion</h1>
          <Acc1 />
          <Acc2 />
          <Acc3 />
        </div>
      </div>
    </div>
  );
}

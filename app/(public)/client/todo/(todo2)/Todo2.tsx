"use client";

import Todo2Provider from "./Provider";
import Todo2Home from "./Todo2Home";

export default function Todo2() {
  return (
    <Todo2Provider>
      <Todo2Home />
    </Todo2Provider>
  );
}

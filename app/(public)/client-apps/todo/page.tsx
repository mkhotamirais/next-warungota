import React from "react";
import Todo1 from "./(todo1)/Todo1";
import Todo2 from "./(todo2)/Todo2";
import Todo3 from "./(todo3)/Todo3";

export default function Todo() {
  return (
    <div>
      <div className="container">
        <div className="prose">
          <h1>Todo</h1>
          <div className="space-y-4">
            <Todo3 />
            <Todo2 />
            <Todo1 />
          </div>
        </div>
      </div>
    </div>
  );
}

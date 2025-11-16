import React from "react";

export default function SearchBtn2() {
  return (
    <div className="relative">
      <input
        type="text"
        className="border w-auto sm:w-72 h-full rounded-md px-3 py-2 bg-gray-100 border-gray-300"
        placeholder="Search Product.."
      />
      <div className="absolute">
        <div>keywords</div>
      </div>
    </div>
  );
}

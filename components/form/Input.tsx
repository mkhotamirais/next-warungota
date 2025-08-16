import React from "react";

interface InputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
}

export default function Input({ id, label, type = "text", placeholder }: InputProps) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="block">
        {label}
      </label>
      <input
        type={type}
        name={id}
        id={id}
        placeholder={placeholder}
        className="px-3 py-2 border border-gray-400 w-full rounded"
      />
    </div>
  );
}

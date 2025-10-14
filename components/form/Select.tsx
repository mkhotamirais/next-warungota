import React from "react";

interface SelectProps {
  id: string;
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string | string[] | undefined;
  disabled?: boolean;
  placeholder?: string;
}

export default function Select({
  id,
  onChange,
  label,
  value,
  options,
  error,
  disabled,
  placeholder = "--Select",
}: SelectProps) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="mb-1 block text-sm text-gray-600">
        {label}
      </label>
      <select name={id} id={id} title={id} className="input" value={value} onChange={onChange} disabled={disabled}>
        <option value="">{placeholder}</option>
        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <div aria-live="polite" aria-atomic="true">
        <p className="text-sm text-red-500">{error ? error : ""}</p>
      </div>
    </div>
  );
}

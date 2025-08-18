import React from "react";

interface TextareaProps {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  error?: string[] | undefined;
  value?: string;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  autoFocus?: boolean;
  className?: string;
}

export default function TextareaForm({
  id,
  label,
  placeholder,
  error,
  value,
  defaultValue,
  onChange,
  autoFocus,
  className,
}: TextareaProps) {
  return (
    <div className={`${className} mb-3`}>
      <label htmlFor={id} className="block mb-1 text-sm text-gray-600">
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        className="input"
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        autoFocus={autoFocus}
      />
      <div aria-live="polite" aria-atomic="true">
        <p className="text-sm text-red-500">{error ? error : ""}</p>
      </div>
    </div>
  );
}

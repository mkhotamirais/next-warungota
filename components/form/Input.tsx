import React from "react";

interface InputProps {
  ref?: React.ForwardedRef<HTMLInputElement>;
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  error?: string[] | undefined;
  value?: string;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  autoFocus?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function Input({
  ref,
  id,
  label,
  type = "text",
  placeholder,
  error,
  value,
  defaultValue,
  onChange,
  autoFocus,
  disabled,
  className,
}: InputProps) {
  return (
    <div className={`${className} mb-3`}>
      <label htmlFor={id} className="block mb-1 text-sm text-gray-600">
        {label}
      </label>
      <input
        ref={ref}
        type={type}
        id={id}
        name={id}
        disabled={disabled}
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

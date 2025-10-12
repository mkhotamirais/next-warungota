import React, { useState } from "react";

interface InputProps {
  ref?: React.ForwardedRef<HTMLInputElement>;
  id: string;
  label: string | React.ReactNode;
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
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`${className} mb-3`}>
      <label htmlFor={id} className="block mb-1 text-sm text-gray-600">
        {label}
      </label>
      <div className="relative ">
        <input
          ref={ref}
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          id={id}
          name={id}
          disabled={disabled}
          className={`input ${type === "password" ? "pr-12" : ""}`}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          autoFocus={autoFocus}
        />
        {type === "password" ? (
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-0 top-0 bottom-0 w-12 h-full flex items-center justify-center text-primary"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        ) : null}
      </div>

      <div aria-live="polite" aria-atomic="true">
        <p className="text-sm text-red-500">{error ? error : ""}</p>
      </div>
    </div>
  );
}

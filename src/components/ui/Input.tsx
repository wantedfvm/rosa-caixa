import React, { forwardRef, InputHTMLAttributes, ReactNode, useId } from 'react';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  hint?: ReactNode;
  error?: string | null;
  hideLabel?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, hideLabel, id, className = '', ...rest },
  ref
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label
        htmlFor={inputId}
        className={`text-xs font-semibold text-[#52525B] ${hideLabel ? 'sr-only' : ''}`}
      >
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-[#09090B] placeholder:text-[#A1A1AA] transition-all outline-none focus:ring-2 focus:ring-[#09090B] focus:border-transparent ${
          error ? 'border-[#DC2626] bg-red-50/20' : 'border-[#E4E4E7] hover:border-[#D4D4D8]'
        } ${className}`}
        {...rest}
      />
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-[#DC2626] flex items-center gap-1.5 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-[#71717A]">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

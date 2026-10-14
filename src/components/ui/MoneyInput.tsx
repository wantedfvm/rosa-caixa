'use client';

import React, { forwardRef, useId } from 'react';
import { formatCentsToInputMask, parseCurrencyInputToCents } from '@/lib/calculations';
import { AlertCircle } from 'lucide-react';

export interface MoneyInputProps {
  label: React.ReactNode;
  valueCents: number;
  onChangeCents: (cents: number) => void;
  error?: string | null;
  hint?: React.ReactNode;
  hideLabel?: boolean;
  className?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
}

export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(function MoneyInput(
  { label, valueCents, onChangeCents, error, hint, hideLabel, className = '', disabled, placeholder = '0,00', ...rest },
  ref
) {
  const generatedId = useId();
  const inputId = `money-${generatedId}`;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  const displayValue = valueCents > 0 ? formatCentsToInputMask(valueCents) : '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const cents = parseCurrencyInputToCents(raw);
    onChangeCents(cents);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label
        htmlFor={inputId}
        className={`text-xs font-semibold text-[#52525B] ${hideLabel ? 'sr-only' : ''}`}
      >
        {label}
      </label>
      <div className="relative flex items-center">
        <span className="absolute left-3.5 text-sm font-semibold text-[#71717A] pointer-events-none select-none">
          R$
        </span>
        <input
          ref={ref}
          id={inputId}
          type="text"
          inputMode="numeric"
          disabled={disabled}
          value={displayValue}
          placeholder={placeholder}
          onChange={handleChange}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={`w-full pl-10 pr-3.5 py-3 rounded-xl border bg-white text-[#09090B] font-semibold text-lg placeholder:text-[#A1A1AA] transition-all outline-none focus:ring-2 focus:ring-[#09090B] focus:border-transparent ${
            error ? 'border-[#DC2626] bg-red-50/20' : 'border-[#E4E4E7] hover:border-[#D4D4D8]'
          } ${className}`}
          {...rest}
        />
      </div>
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

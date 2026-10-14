import React, { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'income' | 'expense' | 'ghost' | 'danger';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading, icon, children, className = '', disabled, type = 'button', ...rest },
  ref
) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#09090B] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed touch-target cursor-pointer';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-4 py-2.5 rounded-xl gap-2',
    lg: 'text-base px-5 py-3 rounded-xl gap-2.5',
  }[size];

  const variantClasses = {
    primary: 'bg-[#09090B] text-white hover:bg-[#27272A] active:scale-[0.98] shadow-xs',
    secondary: 'bg-white text-[#09090B] border border-[#E4E4E7] hover:bg-[#F4F4F5] hover:border-[#D4D4D8] active:scale-[0.98] shadow-xs',
    income: 'bg-[#16A34A] text-white hover:bg-[#15803D] active:scale-[0.98] shadow-xs',
    expense: 'bg-[#DC2626] text-white hover:bg-[#B91C1C] active:scale-[0.98] shadow-xs',
    ghost: 'bg-transparent text-[#52525B] hover:text-[#09090B] hover:bg-[#F4F4F5]',
    danger: 'bg-red-50 text-[#DC2626] border border-red-200 hover:bg-red-100 active:scale-[0.98]',
  }[variant];

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading ? 'true' : undefined}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      {...rest}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin text-current" aria-hidden="true" /> : icon}
      <span>{children}</span>
    </button>
  );
});

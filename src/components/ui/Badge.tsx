import React, { ReactNode } from 'react';

export interface BadgeProps {
  children: ReactNode;
  variant?: 'income' | 'expense' | 'neutral' | 'accent';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className = '' }) => {
  const variantClasses = {
    income: 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]',
    expense: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
    neutral: 'bg-[#F4F4F5] text-[#52525B] border-[#E4E4E7]',
    accent: 'bg-[#09090B] text-white border-[#09090B]',
  }[variant];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
};

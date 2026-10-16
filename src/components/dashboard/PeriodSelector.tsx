'use client';

import React, { useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export interface PeriodOption {
  id: string;
  label: string;
}

export const PERIOD_OPTIONS: PeriodOption[] = [
  { id: 'today', label: 'Hoje' },
  { id: '7days', label: '7 Dias' },
  { id: 'current_month', label: 'Mês Atual' },
  { id: 'previous_month', label: 'Mês Anterior' },
  { id: 'year', label: 'Ano Atual' },
  { id: 'all', label: 'Tudo' },
];

export interface PeriodSelectorProps {
  currentPeriod: string;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({ currentPeriod }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSelect = (periodId: string) => {
    if (periodId === currentPeriod && !isPending) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set('period', periodId);

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div className="grid grid-cols-3 sm:flex sm:items-center gap-1.5 sm:gap-2 w-full sm:w-auto select-none">
      {PERIOD_OPTIONS.map((p) => {
        const isActive = currentPeriod === p.id;
        const isLoadingThis = isPending && currentPeriod === p.id;

        return (
          <button
            key={p.id}
            type="button"
            onClick={() => handleSelect(p.id)}
            disabled={isPending}
            className={`py-2.5 px-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center justify-center gap-1.5 touch-target cursor-pointer ${
              isActive
                ? 'bg-[#09090B] text-white border-[#09090B] shadow-xs font-bold'
                : 'bg-white text-[#52525B] border-[#E4E4E7] hover:border-[#D4D4D8] hover:text-[#09090B] active:bg-[#F4F4F5]'
            } ${isPending && !isActive ? 'opacity-50' : ''}`}
          >
            {isLoadingThis ? <Loader2 className="w-3 h-3 animate-spin text-white" /> : null}
            <span>{p.label}</span>
          </button>
        );
      })}
    </div>
  );
};

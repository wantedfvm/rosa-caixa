'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/Button';
import { PeriodSelector } from './PeriodSelector';
import { TransactionModal, CategoryOption, EditableTransactionData } from '../transactions/TransactionModal';
import { formatCurrency, formatDateBR } from '@/lib/calculations';
import { PlusCircle, MinusCircle, Wallet, ArrowUpRight, ArrowDownRight, TrendingUp, ArrowRight, Tag as TagIcon, Calculator } from 'lucide-react';
import Link from 'next/link';
import { EmptyState } from '../ui/EmptyState';

export interface DashboardClientProps {
  metricsData: {
    metrics: {
      currentBalanceCents: number;
      periodIncomeCents: number;
      periodExpenseCents: number;
      periodNetCents: number;
      periodCount: number;
    };
    period: {
      id: string;
      label: string;
      startDate: string;
      endDate: string;
    };
    settings: {
      initialBalanceCents: number;
      initialBalanceDate: string;
      fullName?: string | null;
    };
  };
  recentTransactions: Array<{
    id: string;
    type: 'income' | 'expense';
    amountCents: number;
    description: string;
    transactionDate: string;
    categoryName?: string | null;
    categoryColor?: string | null;
  }>;
  categories: CategoryOption[];
}

export const DashboardClient: React.FC<DashboardClientProps> = ({
  metricsData,
  recentTransactions,
  categories,
}) => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'income' | 'expense'>('income');
  const [editingItem, setEditingItem] = useState<EditableTransactionData | null>(null);

  const { metrics, period, settings } = metricsData;

  const handleOpenNew = (type: 'income' | 'expense') => {
    setEditingItem(null);
    setModalType(type);
    setModalOpen(true);
  };

  const handleSuccess = () => {
    router.refresh();
  };

  const isNetPositive = metrics.periodNetCents >= 0;
  const isBalancePositive = metrics.currentBalanceCents >= 0;

  return (
    <div className="space-y-6">
      {/* Cabeçalho de Boas-Vindas e Ações Rápidas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E4E4E7] shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-rose-100 bg-[#FFF5F6] shadow-2xs hover:scale-105 transition-transform">
            <Image
              src="/mascote-rosa.png"
              alt="Rosinha - Mascote Rosa Network"
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#09090B] tracking-tight">
                Olá, {settings.fullName?.split(' ')[0] || 'Usuário'}!
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
                Rosinha no caixa 🌸
              </span>
            </div>
            <p className="text-xs text-[#71717A] mt-0.5">
              Acompanhe o saldo consolidado e o resultado financeiro.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="income"
            onClick={() => handleOpenNew('income')}
            icon={<PlusCircle className="w-4 h-4" />}
            className="flex-1 sm:flex-initial"
          >
            Nova Entrada
          </Button>
          <Button
            variant="expense"
            onClick={() => handleOpenNew('expense')}
            icon={<MinusCircle className="w-4 h-4" />}
            className="flex-1 sm:flex-initial"
          >
            Nova Saída
          </Button>
        </div>
      </div>

      {/* Card Destaque: Módulo de Precificação */}
      <div className="bg-gradient-to-r from-rose-50 via-white to-pink-50/50 p-4 sm:p-5 rounded-2xl border border-rose-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100/80 text-rose-700 flex items-center justify-center shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#09090B]">Novo: Módulo de Precificação</span>
              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700">Em Aula</span>
            </div>
            <p className="text-[11px] text-[#71717A] mt-0.5">
              Calcule o preço exato para seus produtos ou serviços com base no custo direto, custos fixos e margem de lucro real.
            </p>
          </div>
        </div>

        <Link
          href="/precificacao"
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#09090B] text-white text-xs font-bold hover:bg-[#27272A] transition-colors self-start sm:self-auto shrink-0 shadow-xs"
        >
          <span>Abrir Calculadora</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Seletor de Período Temporal */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E4E4E7] shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">
            Filtrar por Período
          </span>
          <span className="text-[11px] text-[#71717A] font-medium">
            {period.label}: {formatDateBR(period.startDate)} até {formatDateBR(period.endDate)}
          </span>
        </div>
        <PeriodSelector currentPeriod={period.id} />
      </div>

      {/* Grid de 4 Indicadores Essenciais */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Saldo Atual em Caixa */}
        <div className="col-span-2 sm:col-span-1 bg-white p-4 sm:p-5 rounded-2xl border border-[#E4E4E7] shadow-xs space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-[#71717A]">
            <span className="text-xs font-bold uppercase tracking-wider">Saldo Atual</span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-[#F4F4F5] text-[#09090B]">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-bold tracking-tight ${isBalancePositive ? 'text-[#09090B]' : 'text-[#DC2626]'}`}>
            {formatCurrency(metrics.currentBalanceCents)}
          </p>
          <p className="text-[11px] text-[#71717A]">
            Disponível em caixa hoje
          </p>
        </div>

        {/* 2. Total de Entradas no Período */}
        <div className="col-span-1 bg-white p-4 sm:p-5 rounded-2xl border border-[#E4E4E7] shadow-xs space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-[#16A34A]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#71717A]">Entradas</span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-[#F0FDF4] text-[#16A34A]">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#16A34A] tracking-tight">
            {formatCurrency(metrics.periodIncomeCents)}
          </p>
          <p className="text-[11px] text-[#71717A] truncate">
            Receitas no período
          </p>
        </div>

        {/* 3. Total de Saídas no Período */}
        <div className="col-span-1 bg-white p-4 sm:p-5 rounded-2xl border border-[#E4E4E7] shadow-xs space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-[#DC2626]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#71717A]">Saídas</span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-[#FEF2F2] text-[#DC2626]">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#DC2626] tracking-tight">
            {formatCurrency(metrics.periodExpenseCents)}
          </p>
          <p className="text-[11px] text-[#71717A] truncate">
            Despesas no período
          </p>
        </div>

        {/* 4. Resultado Líquido do Período */}
        <div className="col-span-2 sm:col-span-1 bg-white p-4 sm:p-5 rounded-2xl border border-[#E4E4E7] shadow-xs space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-[#71717A]">
            <span className="text-xs font-bold uppercase tracking-wider">Resultado</span>
            <div className={`p-1.5 sm:p-2 rounded-xl ${isNetPositive ? 'bg-[#F0FDF4] text-[#16A34A]' : 'bg-[#FEF2F2] text-[#DC2626]'}`}>
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-bold tracking-tight ${isNetPositive ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
            {formatCurrency(metrics.periodNetCents)}
          </p>
          <p className="text-[11px] text-[#71717A]">
            {isNetPositive ? 'Superávit no período' : 'Déficit no período'} ({metrics.periodCount} lançamentos)
          </p>
        </div>
      </div>

      {/* Movimentações Recentes */}
      <div className="bg-white rounded-2xl border border-[#E4E4E7] shadow-xs overflow-hidden">
        <div className="p-5 flex items-center justify-between border-b border-[#E4E4E7]">
          <div>
            <h2 className="text-base font-bold text-[#09090B]">Últimos Lançamentos</h2>
            <p className="text-xs text-[#71717A]">Movimentações mais recentes registradas.</p>
          </div>
          <Link
            href="/movimentacoes"
            className="text-xs font-semibold text-[#09090B] hover:text-[#52525B] flex items-center gap-1 transition-colors"
          >
            <span>Ver extrato completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="Nenhuma movimentação registrada"
              description="Comece registrando sua primeira entrada ou saída para calcular o saldo do caixa."
              action={
                <Button size="sm" onClick={() => handleOpenNew('income')}>
                  Registrar Primeira Entrada
                </Button>
              }
            />
          </div>
        ) : (
          <div className="divide-y divide-[#E4E4E7]">
            {recentTransactions.map((t) => {
              const isIncome = t.type === 'income';
              return (
                <div
                  key={t.id}
                  className="p-4 sm:px-6 flex items-center justify-between hover:bg-[#FAFAFA] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isIncome ? 'bg-[#F0FDF4] text-[#16A34A]' : 'bg-[#FEF2F2] text-[#DC2626]'
                      }`}
                    >
                      {isIncome ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-[#09090B]">{t.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-[#71717A]">{formatDateBR(t.transactionDate)}</span>
                        {t.categoryName ? (
                          <>
                            <span className="text-[11px] text-[#D4D4D8]">•</span>
                            <span className="text-[11px] text-[#52525B] font-medium flex items-center gap-1">
                              <TagIcon className="w-3 h-3 text-[#71717A]" />
                              {t.categoryName}
                            </span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-sm font-bold ${isIncome ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                      {isIncome ? '+' : '-'}{formatCurrency(t.amountCents)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Transação */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        categories={categories}
        defaultType={modalType}
        initialData={editingItem}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

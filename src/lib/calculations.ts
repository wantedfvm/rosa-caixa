/**
 * Módulo de cálculos financeiros do Controle de Caixa.
 * Todos os valores internos operam estritamente em centavos inteiros (INTEGER).
 * Isso elimina qualquer risco de imprecisão por ponto flutuante binário.
 */

export interface TransactionSummaryItem {
  type: 'income' | 'expense';
  amountCents: number;
  transactionDate: string; // ISO YYYY-MM-DD
}

export interface CashMetricsInput {
  transactions: TransactionSummaryItem[];
  initialBalanceCents: number;
  initialBalanceDate: string; // ISO YYYY-MM-DD
  startDate: string; // ISO YYYY-MM-DD
  endDate: string; // ISO YYYY-MM-DD
}

export interface CashMetricsResult {
  currentBalanceCents: number; // Saldo real consolidado em caixa
  periodIncomeCents: number; // Entradas do período filtrado
  periodExpenseCents: number; // Saídas do período filtrado
  periodNetCents: number; // Resultado líquido do período (Entradas - Saídas)
  periodCount: number; // Quantidade de movimentações no período
}

/**
 * Converte centavos inteiros para string monetária formatada no padrão brasileiro (R$ 1.250,50).
 */
export function formatCurrency(cents: number): string {
  const isNegative = cents < 0;
  const absReais = Math.abs(cents) / 100;
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absReais);

  return isNegative ? `- ${formatted}` : formatted;
}

/**
 * Converte uma digitação monetária (ex: "1250,50", "125050", "R$ 100,00") para centavos inteiros.
 */
export function parseCurrencyInputToCents(raw: string): number {
  if (!raw) return 0;
  // Extrai apenas dígitos
  const digits = raw.replace(/\D/g, '');
  if (!digits) return 0;
  return parseInt(digits, 10);
}

/**
 * Formata digitação de centavos em tempo real para máscara de input monetário pt-BR.
 */
export function formatCentsToInputMask(cents: number): string {
  const reais = cents / 100;
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(reais);
}

/**
 * Formata data ISO (YYYY-MM-DD) para exibição brasileira (DD/MM/AAAA).
 */
export function formatDateBR(isoDate: string): string {
  if (!isoDate || isoDate.length < 10) return '';
  const [year, month, day] = isoDate.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}

/**
 * Retorna a data atual no fuso horário do usuário em formato ISO YYYY-MM-DD.
 */
export function getTodayISODate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Retorna os limites de data (início e fim) para os seletores de período comuns.
 */
export function getPeriodRange(periodId: string): { startDate: string; endDate: string; label: string } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const toISO = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  switch (periodId) {
    case 'today': {
      const today = toISO(now);
      return { startDate: today, endDate: today, label: 'Hoje' };
    }
    case '7days': {
      const past = new Date(now);
      past.setDate(past.getDate() - 6);
      return { startDate: toISO(past), endDate: toISO(now), label: 'Últimos 7 Dias' };
    }
    case 'previous_month': {
      const firstDayPrev = new Date(year, month - 1, 1);
      const lastDayPrev = new Date(year, month, 0);
      return {
        startDate: toISO(firstDayPrev),
        endDate: toISO(lastDayPrev),
        label: 'Mês Anterior',
      };
    }
    case 'year': {
      const firstDayYear = new Date(year, 0, 1);
      const lastDayYear = new Date(year, 11, 31);
      return {
        startDate: toISO(firstDayYear),
        endDate: toISO(lastDayYear),
        label: 'Ano Atual',
      };
    }
    case 'all': {
      return { startDate: '1970-01-01', endDate: '2099-12-31', label: 'Todo o Histórico' };
    }
    case 'current_month':
    default: {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      return {
        startDate: toISO(firstDay),
        endDate: toISO(lastDay),
        label: 'Mês Atual',
      };
    }
  }
}

/**
 * Calcula determinísticamente todos os balanços do caixa:
 * - Saldo Atual: Saldo Inicial + movimentações a partir da data de corte (initialBalanceDate)
 * - Indicadores do Período: Entradas, Saídas e Resultado Líquido entre startDate e endDate
 */
export function calculateCashMetrics(input: CashMetricsInput): CashMetricsResult {
  const { transactions, initialBalanceCents, initialBalanceDate, startDate, endDate } = input;

  let currentBalanceCents = initialBalanceCents;
  let periodIncomeCents = 0;
  let periodExpenseCents = 0;
  let periodCount = 0;

  for (const t of transactions) {
    // 1. Cômputo do Saldo Atual (Respeita estritamente a data de corte do saldo inicial)
    if (t.transactionDate >= initialBalanceDate) {
      if (t.type === 'income') {
        currentBalanceCents += t.amountCents;
      } else if (t.type === 'expense') {
        currentBalanceCents -= t.amountCents;
      }
    }

    // 2. Cômputo do Período Selecionado
    if (t.transactionDate >= startDate && t.transactionDate <= endDate) {
      periodCount++;
      if (t.type === 'income') {
        periodIncomeCents += t.amountCents;
      } else if (t.type === 'expense') {
        periodExpenseCents += t.amountCents;
      }
    }
  }

  const periodNetCents = periodIncomeCents - periodExpenseCents;

  return {
    currentBalanceCents,
    periodIncomeCents,
    periodExpenseCents,
    periodNetCents,
    periodCount,
  };
}

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  formatCurrency,
  parseCurrencyInputToCents,
  formatCentsToInputMask,
  calculateCashMetrics,
} from '../lib/calculations';

describe('Testes de Cálculos Financeiros (Centavos Inteiros)', () => {
  it('FIN-01: Formata corretamente centavos para moeda brasileira', () => {
    assert.strictEqual(formatCurrency(10000), 'R$\u00A0100,00');
    assert.strictEqual(formatCurrency(1099), 'R$\u00A010,99');
    assert.strictEqual(formatCurrency(0), 'R$\u00A00,00');
    assert.strictEqual(formatCurrency(-5000), '- R$\u00A050,00');
  });

  it('FIN-02: Converte digitação do usuário para centavos inteiros sem erros decimais', () => {
    assert.strictEqual(parseCurrencyInputToCents('100,00'), 10000);
    assert.strictEqual(parseCurrencyInputToCents('10,99'), 1099);
    assert.strictEqual(parseCurrencyInputToCents('R$ 1.250,50'), 125050);
    assert.strictEqual(parseCurrencyInputToCents(''), 0);
  });

  it('FIN-03: Formata centavos para máscara de input pt-BR', () => {
    assert.strictEqual(formatCentsToInputMask(10000), '100,00');
    assert.strictEqual(formatCentsToInputMask(125050), '1.250,50');
  });

  it('FIN-04: Respeita a data de corte do saldo inicial no cálculo do saldo atual', () => {
    const transactions = [
      // Lançamento ANTERIOR à data de corte (Não deve somar no saldo atual)
      { type: 'income' as const, amountCents: 50000, transactionDate: '2026-09-15' },
      // Lançamento POSTERIOR à data de corte (Deve somar no saldo atual)
      { type: 'income' as const, amountCents: 20000, transactionDate: '2026-10-05' },
      // Saída POSTERIOR à data de corte (Deve subtrair do saldo atual)
      { type: 'expense' as const, amountCents: 5000, transactionDate: '2026-10-10' },
    ];

    const result = calculateCashMetrics({
      transactions,
      initialBalanceCents: 100000, // Saldo inicial: R$ 1.000,00
      initialBalanceDate: '2026-10-01', // Data de corte: 01/10/2026
      startDate: '2026-10-01',
      endDate: '2026-10-31',
    });

    // Saldo esperado: 100000 + 20000 - 5000 = 115000 (R$ 1.150,00)
    // O lançamento de R$ 500,00 de 15/09/2026 foi ignorado no saldo atual para evitar duplicidade!
    assert.strictEqual(result.currentBalanceCents, 115000);

    // No período de outubro (01 a 31/10):
    assert.strictEqual(result.periodIncomeCents, 20000);
    assert.strictEqual(result.periodExpenseCents, 5000);
    assert.strictEqual(result.periodNetCents, 15000);
    assert.strictEqual(result.periodCount, 2);
  });
});

import { z } from 'zod';

export const TransactionInputSchema = z.object({
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({ message: 'Tipo deve ser Entrada ou Saída.' }),
  }),
  amountCents: z.number().int().positive({
    message: 'O valor da movimentação deve ser maior que zero.',
  }),
  description: z.string().trim().min(2, {
    message: 'A descrição deve ter pelo menos 2 caracteres.',
  }).max(100, {
    message: 'A descrição pode ter no máximo 100 caracteres.',
  }),
  transactionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'A data deve estar no formato AAAA-MM-DD.',
  }),
  categoryId: z.string().nullable().optional(),
  notes: z.string().max(500, {
    message: 'Observações podem ter no máximo 500 caracteres.',
  }).nullable().optional(),
  idempotencyKey: z.string().optional(),
});

export type TransactionInput = z.infer<typeof TransactionInputSchema>;

export const CategoryInputSchema = z.object({
  name: z.string().trim().min(2, {
    message: 'O nome da categoria deve ter pelo menos 2 caracteres.',
  }).max(50, {
    message: 'O nome da categoria pode ter no máximo 50 caracteres.',
  }),
  type: z.enum(['income', 'expense', 'both'], {
    errorMap: () => ({ message: 'Selecione um tipo válido de categoria.' }),
  }),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Cor deve estar em formato hexadecimal (#RRGGBB).',
  }).default('#09090B'),
  icon: z.string().default('Tag'),
});

export type CategoryInput = z.infer<typeof CategoryInputSchema>;

export const UserSettingsInputSchema = z.object({
  initialBalanceCents: z.number().int({
    message: 'O saldo inicial deve ser um número inteiro de centavos.',
  }),
  initialBalanceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'A data de vigência deve estar no formato AAAA-MM-DD.',
  }),
  fullName: z.string().trim().min(2, {
    message: 'Nome deve ter pelo menos 2 caracteres.',
  }).max(100).optional(),
});

export type UserSettingsInput = z.infer<typeof UserSettingsInputSchema>;

import { db } from '@/db';
import { transactions, categories, idempotencyKeys } from '@/db/schema';
import { eq, and, desc, gte, lte, like, sql } from 'drizzle-orm';
import { getAuthenticatedUser, ForbiddenError } from './auth-session';
import { validateCategoryOwnership } from './categories';
import { getUserSettingsDAL } from './settings';
import { TransactionInput, TransactionInputSchema } from '@/lib/validations';
import { calculateCashMetrics, getPeriodRange, CashMetricsResult } from '@/lib/calculations';
import crypto from 'crypto';

export interface GetTransactionsOptions {
  startDate?: string;
  endDate?: string;
  type?: 'income' | 'expense';
  categoryId?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

/**
 * Cria um novo lançamento financeiro com proteção de idempotência no servidor e verificação de categorias.
 */
export async function createTransactionDAL(input: TransactionInput) {
  const user = await getAuthenticatedUser();
  const validData = TransactionInputSchema.parse(input);

  // 1. Verificação de Idempotência no Servidor
  if (validData.idempotencyKey) {
    const [existing] = await db.select()
      .from(idempotencyKeys)
      .where(and(
        eq(idempotencyKeys.key, validData.idempotencyKey),
        eq(idempotencyKeys.userId, user.id)
      ))
      .limit(1);

    if (existing) {
      try {
        return JSON.parse(existing.responsePayload);
      } catch {
        // Se houver falha de parse, segue fluxo padrão
      }
    }
  }

  // 2. Validação de Propriedade da Categoria Vinculada (Anti-IDOR)
  if (validData.categoryId) {
    const isAllowed = await validateCategoryOwnership(validData.categoryId, user.id);
    if (!isAllowed) {
      throw new ForbiddenError('A categoria selecionada não pertence à sua conta.');
    }
  }

  // 3. Persistência da Transação
  const newId = crypto.randomUUID();
  const now = new Date();

  const newRecord = {
    id: newId,
    userId: user.id,
    categoryId: validData.categoryId || null,
    type: validData.type,
    amountCents: validData.amountCents,
    description: validData.description,
    transactionDate: validData.transactionDate,
    notes: validData.notes || null,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(transactions).values(newRecord);

  // 4. Gravação da Chave de Idempotência
  if (validData.idempotencyKey) {
    try {
      await db.insert(idempotencyKeys).values({
        key: validData.idempotencyKey,
        userId: user.id,
        responsePayload: JSON.stringify(newRecord),
        createdAt: now,
      });
    } catch {
      // Ignora erro de inserção de chave duplicada concorrente
    }
  }

  return newRecord;
}

/**
 * Retorna os lançamentos do usuário com filtros opcionais e dados da categoria associada.
 */
export async function getTransactionsDAL(options: GetTransactionsOptions = {}) {
  const user = await getAuthenticatedUser();

  const conditions = [eq(transactions.userId, user.id)];

  if (options.startDate) {
    conditions.push(gte(transactions.transactionDate, options.startDate));
  }
  if (options.endDate) {
    conditions.push(lte(transactions.transactionDate, options.endDate));
  }
  if (options.type) {
    conditions.push(eq(transactions.type, options.type));
  }
  if (options.categoryId) {
    conditions.push(eq(transactions.categoryId, options.categoryId));
  }
  if (options.search) {
    conditions.push(like(transactions.description, `%${options.search}%`));
  }

  const query = db.select({
    id: transactions.id,
    userId: transactions.userId,
    categoryId: transactions.categoryId,
    type: transactions.type,
    amountCents: transactions.amountCents,
    description: transactions.description,
    transactionDate: transactions.transactionDate,
    notes: transactions.notes,
    createdAt: transactions.createdAt,
    updatedAt: transactions.updatedAt,
    categoryName: categories.name,
    categoryColor: categories.color,
    categoryIcon: categories.icon,
  })
  .from(transactions)
  .leftJoin(categories, eq(transactions.categoryId, categories.id))
  .where(and(...conditions))
  .orderBy(desc(transactions.transactionDate), desc(transactions.createdAt));

  if (options.limit) {
    query.limit(options.limit);
  }
  if (options.offset) {
    query.offset(options.offset);
  }

  return await query;
}

/**
 * Atualiza um lançamento do usuário autenticado garantindo que pertença a ele.
 */
export async function updateTransactionDAL(id: string, input: TransactionInput) {
  const user = await getAuthenticatedUser();
  const validData = TransactionInputSchema.parse(input);

  // Validação da categoria
  if (validData.categoryId) {
    const isAllowed = await validateCategoryOwnership(validData.categoryId, user.id);
    if (!isAllowed) {
      throw new ForbiddenError('A categoria selecionada não pertence à sua conta.');
    }
  }

  const now = new Date();

  // Executa update estritamente com filtro duplo (id e user_id)
  const result = await db.update(transactions)
    .set({
      categoryId: validData.categoryId || null,
      type: validData.type,
      amountCents: validData.amountCents,
      description: validData.description,
      transactionDate: validData.transactionDate,
      notes: validData.notes || null,
      updatedAt: now,
    })
    .where(and(eq(transactions.id, id), eq(transactions.userId, user.id)));

  if (result.rowsAffected === 0) {
    throw new ForbiddenError('Lançamento não encontrado ou não autorizado.');
  }

  return { id, ...validData, updatedAt: now };
}

/**
 * Exclui um lançamento do usuário autenticado.
 */
export async function deleteTransactionDAL(id: string) {
  const user = await getAuthenticatedUser();

  const result = await db.delete(transactions)
    .where(and(eq(transactions.id, id), eq(transactions.userId, user.id)));

  if (result.rowsAffected === 0) {
    throw new ForbiddenError('Lançamento não encontrado ou não autorizado.');
  }

  return { success: true };
}

/**
 * Retorna as métricas consolidadas do Dashboard:
 * - Saldo Atual ativo
 * - Entradas, Saídas e Resultado Líquido do período selecionado
 */
export async function getCashDashboardMetricsDAL(periodId = 'current_month') {
  const user = await getAuthenticatedUser();
  const settings = await getUserSettingsDAL();
  const range = getPeriodRange(periodId);

  // Busca dados essenciais para o cálculo financeiro
  const allUserItems = await db.select({
    type: transactions.type,
    amountCents: transactions.amountCents,
    transactionDate: transactions.transactionDate,
  })
  .from(transactions)
  .where(eq(transactions.userId, user.id));

  const metrics: CashMetricsResult = calculateCashMetrics({
    transactions: allUserItems,
    initialBalanceCents: settings.initialBalanceCents,
    initialBalanceDate: settings.initialBalanceDate,
    startDate: range.startDate,
    endDate: range.endDate,
  });

  return {
    metrics,
    period: {
      id: periodId,
      label: range.label,
      startDate: range.startDate,
      endDate: range.endDate,
    },
    settings: {
      initialBalanceCents: settings.initialBalanceCents,
      initialBalanceDate: settings.initialBalanceDate,
      fullName: settings.fullName,
    },
  };
}

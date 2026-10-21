import { db, client } from '@/db';
import { pricingItems } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getAuthenticatedUser, ForbiddenError } from './auth-session';
import crypto from 'crypto';

let isTableInitialized = false;

async function ensurePricingTable() {
  if (isTableInitialized) return;
  try {
    await client.execute(`CREATE TABLE IF NOT EXISTS pricing_items (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'product',
      direct_cost_cents INTEGER NOT NULL DEFAULT 0,
      fixed_cost_percent REAL NOT NULL DEFAULT 10,
      variable_cost_percent REAL NOT NULL DEFAULT 5,
      profit_margin_percent REAL NOT NULL DEFAULT 30,
      suggested_price_cents INTEGER NOT NULL DEFAULT 0,
      materials_details TEXT,
      notes TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );`);
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_pricing_user ON pricing_items(user_id);`);
    isTableInitialized = true;
  } catch (err) {
    console.error('Erro ao verificar tabela pricing_items:', err);
  }
}

export interface PricingItemInput {
  id?: string;
  name: string;
  type: 'product' | 'service';
  directCostCents: number;
  fixedCostPercent: number;
  variableCostPercent: number;
  profitMarginPercent: number;
  suggestedPriceCents: number;
  materialsDetails?: string | null;
  notes?: string | null;
}

export async function getPricingItemsDAL() {
  await ensurePricingTable();
  const user = await getAuthenticatedUser();

  return await db
    .select()
    .from(pricingItems)
    .where(eq(pricingItems.userId, user.id))
    .orderBy(desc(pricingItems.createdAt));
}

export async function savePricingItemDAL(input: PricingItemInput) {
  await ensurePricingTable();
  const user = await getAuthenticatedUser();
  const now = new Date();

  if (input.id) {
    // Atualização
    const [existing] = await db
      .select()
      .from(pricingItems)
      .where(and(eq(pricingItems.id, input.id), eq(pricingItems.userId, user.id)))
      .limit(1);

    if (!existing) {
      throw new ForbiddenError('Item de precificação não encontrado.');
    }

    await db
      .update(pricingItems)
      .set({
        name: input.name.trim(),
        type: input.type,
        directCostCents: Math.max(0, Math.round(input.directCostCents)),
        fixedCostPercent: Number(input.fixedCostPercent),
        variableCostPercent: Number(input.variableCostPercent),
        profitMarginPercent: Number(input.profitMarginPercent),
        suggestedPriceCents: Math.max(0, Math.round(input.suggestedPriceCents)),
        materialsDetails: input.materialsDetails || null,
        notes: input.notes?.trim() || null,
        updatedAt: now,
      })
      .where(and(eq(pricingItems.id, input.id), eq(pricingItems.userId, user.id)));

    return { id: input.id, ...input };
  } else {
    // Criação
    const newId = crypto.randomUUID();

    await db.insert(pricingItems).values({
      id: newId,
      userId: user.id,
      name: input.name.trim(),
      type: input.type,
      directCostCents: Math.max(0, Math.round(input.directCostCents)),
      fixedCostPercent: Number(input.fixedCostPercent),
      variableCostPercent: Number(input.variableCostPercent),
      profitMarginPercent: Number(input.profitMarginPercent),
      suggestedPriceCents: Math.max(0, Math.round(input.suggestedPriceCents)),
      materialsDetails: input.materialsDetails || null,
      notes: input.notes?.trim() || null,
      createdAt: now,
      updatedAt: now,
    });

    return { id: newId, ...input };
  }
}

export async function deletePricingItemDAL(id: string) {
  await ensurePricingTable();
  const user = await getAuthenticatedUser();

  await db
    .delete(pricingItems)
    .where(and(eq(pricingItems.id, id), eq(pricingItems.userId, user.id)));

  return { success: true };
}

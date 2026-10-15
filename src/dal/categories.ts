import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq, or, and } from 'drizzle-orm';
import { getAuthenticatedUser, ForbiddenError } from './auth-session';
import { CategoryInput, CategoryInputSchema } from '@/lib/validations';
import crypto from 'crypto';

/**
 * Valida se uma categoria é permitida para uso pelo usuário (padrão global ou criada por ele).
 */
export async function validateCategoryOwnership(categoryId: string | null | undefined, userId: string): Promise<boolean> {
  if (!categoryId) return true; // Categoria nula é válida ("Sem categoria")

  const [cat] = await db.select()
    .from(categories)
    .where(
      and(
        eq(categories.id, categoryId),
        or(
          eq(categories.isDefault, true),
          eq(categories.userId, userId)
        )
      )
    )
    .limit(1);

  return !!cat;
}

/**
 * Retorna todas as categorias disponíveis para o usuário (padrão do sistema + personalizadas).
 */
export async function getCategoriesDAL() {
  const user = await getAuthenticatedUser();

  return await db.select()
    .from(categories)
    .where(
      or(
        eq(categories.isDefault, true),
        eq(categories.userId, user.id)
      )
    );
}

/**
 * Cria uma nova categoria personalizada pertencente exclusivamente ao usuário logado.
 */
export async function createCategoryDAL(input: CategoryInput) {
  const user = await getAuthenticatedUser();
  const validData = CategoryInputSchema.parse(input);

  const newId = crypto.randomUUID();
  const now = new Date();

  await db.insert(categories).values({
    id: newId,
    userId: user.id,
    name: validData.name,
    type: validData.type,
    color: validData.color,
    icon: validData.icon,
    isDefault: false,
    createdAt: now,
  });

  return { id: newId, ...validData };
}

/**
 * Exclui uma categoria personalizada do usuário.
 * Categorias padrão do sistema não podem ser excluídas.
 */
export async function deleteCategoryDAL(categoryId: string) {
  const user = await getAuthenticatedUser();

  const [cat] = await db.select()
    .from(categories)
    .where(and(eq(categories.id, categoryId), eq(categories.userId, user.id)))
    .limit(1);

  if (!cat || cat.isDefault) {
    throw new ForbiddenError('Não é permitido excluir esta categoria.');
  }

  await db.delete(categories)
    .where(and(eq(categories.id, categoryId), eq(categories.userId, user.id)));

  return { success: true };
}

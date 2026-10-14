import { db } from '@/db';
import { userSettings, user } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAuthenticatedUser } from './auth-session';
import { UserSettingsInput, UserSettingsInputSchema } from '@/lib/validations';
import { getTodayISODate } from '@/lib/calculations';
import crypto from 'crypto';

export async function getUserSettingsDAL() {
  const authUser = await getAuthenticatedUser();

  let settings = db.select()
    .from(userSettings)
    .where(eq(userSettings.userId, authUser.id))
    .get();

  if (!settings) {
    const today = getTodayISODate();
    const newId = crypto.randomUUID();
    const now = new Date();

    db.insert(userSettings).values({
      id: newId,
      userId: authUser.id,
      initialBalanceCents: 0,
      initialBalanceDate: today,
      fullName: authUser.name || '',
      updatedAt: now,
    }).run();

    settings = {
      id: newId,
      userId: authUser.id,
      initialBalanceCents: 0,
      initialBalanceDate: today,
      fullName: authUser.name || '',
      updatedAt: now,
    };
  }

  return settings;
}

export async function updateUserSettingsDAL(input: UserSettingsInput) {
  const authUser = await getAuthenticatedUser();
  const validData = UserSettingsInputSchema.parse(input);

  const now = new Date();
  const existing = await getUserSettingsDAL();

  db.update(userSettings)
    .set({
      initialBalanceCents: validData.initialBalanceCents,
      initialBalanceDate: validData.initialBalanceDate,
      fullName: validData.fullName || authUser.name,
      updatedAt: now,
    })
    .where(eq(userSettings.id, existing.id))
    .run();

  return { ...existing, ...validData, updatedAt: now };
}

/**
 * Exclui a conta do usuário e todos os seus dados vinculados em cascata (Direito de eliminação - LGPD).
 */
export async function deleteUserAccountDAL() {
  const authUser = await getAuthenticatedUser();

  // O schema possui onDelete: 'cascade' em todas as tabelas vinculadas
  db.delete(user)
    .where(eq(user.id, authUser.id))
    .run();

  return { success: true };
}

'use server';

import { revalidatePath } from 'next/cache';
import {
  createTransactionDAL,
  updateTransactionDAL,
  deleteTransactionDAL,
} from '@/dal/transactions';
import { updateUserSettingsDAL } from '@/dal/settings';
import { createCategoryDAL, deleteCategoryDAL } from '@/dal/categories';
import {
  TransactionInput,
  TransactionInputSchema,
  UserSettingsInput,
  UserSettingsInputSchema,
  CategoryInput,
  CategoryInputSchema,
} from '@/lib/validations';

export async function createTransactionAction(input: TransactionInput) {
  try {
    const valid = TransactionInputSchema.parse(input);
    const result = await createTransactionDAL(valid);
    revalidatePath('/dashboard');
    revalidatePath('/movimentacoes');
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao salvar lançamento.' };
  }
}

export async function updateTransactionAction(id: string, input: TransactionInput) {
  try {
    const valid = TransactionInputSchema.parse(input);
    const result = await updateTransactionDAL(id, valid);
    revalidatePath('/dashboard');
    revalidatePath('/movimentacoes');
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao atualizar lançamento.' };
  }
}

export async function deleteTransactionAction(id: string) {
  try {
    const result = await deleteTransactionDAL(id);
    revalidatePath('/dashboard');
    revalidatePath('/movimentacoes');
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao excluir lançamento.' };
  }
}

export async function updateUserSettingsAction(input: UserSettingsInput) {
  try {
    const valid = UserSettingsInputSchema.parse(input);
    const result = await updateUserSettingsDAL(valid);
    revalidatePath('/dashboard');
    revalidatePath('/configuracoes');
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao atualizar configurações.' };
  }
}

export async function createCategoryAction(input: CategoryInput) {
  try {
    const valid = CategoryInputSchema.parse(input);
    const result = await createCategoryDAL(valid);
    revalidatePath('/categorias');
    revalidatePath('/dashboard');
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao cadastrar categoria.' };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    const result = await deleteCategoryDAL(id);
    revalidatePath('/categorias');
    revalidatePath('/dashboard');
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao excluir categoria.' };
  }
}

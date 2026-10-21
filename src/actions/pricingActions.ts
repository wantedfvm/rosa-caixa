'use server';

import { revalidatePath } from 'next/cache';
import { savePricingItemDAL, deletePricingItemDAL, PricingItemInput } from '@/dal/pricing';

export async function savePricingItemAction(input: PricingItemInput) {
  try {
    if (!input.name || !input.name.trim()) {
      return { success: false, error: 'O nome do produto ou serviço é obrigatório.' };
    }

    const result = await savePricingItemDAL(input);
    revalidatePath('/precificacao');
    revalidatePath('/dashboard');
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao salvar item de precificação.' };
  }
}

export async function deletePricingItemAction(id: string) {
  try {
    const result = await deletePricingItemDAL(id);
    revalidatePath('/precificacao');
    revalidatePath('/dashboard');
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao excluir item de precificação.' };
  }
}

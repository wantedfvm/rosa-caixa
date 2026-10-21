import React from 'react';
import type { Metadata } from 'next';
import { getPricingItemsDAL } from '@/dal/pricing';
import { PricingManagerClient, SavedPricingItem } from '@/components/pricing/PricingManagerClient';

export const metadata: Metadata = {
  title: 'Precificação de Produtos e Serviços | Rosa Caixa',
  description: 'Calcule o preço de venda ideal com markup, margem de lucro real e controle de custos.',
};

export default async function PrecificacaoPage() {
  const items = await getPricingItemsDAL();

  const formattedItems: SavedPricingItem[] = items.map((i) => ({
    id: i.id,
    name: i.name,
    type: i.type as 'product' | 'service',
    directCostCents: i.directCostCents,
    fixedCostPercent: i.fixedCostPercent,
    variableCostPercent: i.variableCostPercent,
    profitMarginPercent: i.profitMarginPercent,
    suggestedPriceCents: i.suggestedPriceCents,
    materialsDetails: i.materialsDetails,
    notes: i.notes,
    createdAt: i.createdAt,
  }));

  return <PricingManagerClient initialItems={formattedItems} />;
}

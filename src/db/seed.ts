import { db } from './index';
import { categories } from './schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export async function ensureDefaultCategories() {
  const existing = await db.select().from(categories).where(eq(categories.isDefault, true));
  if (existing.length > 0) return;

  const defaults = [
    // Entradas
    { name: 'Vendas', type: 'income' as const, color: '#16A34A', icon: 'ShoppingBag' },
    { name: 'Serviços Prestados', type: 'income' as const, color: '#2563EB', icon: 'Briefcase' },
    { name: 'Salário / Pró-labore', type: 'income' as const, color: '#059669', icon: 'Wallet' },
    { name: 'Rendimentos', type: 'income' as const, color: '#0D9488', icon: 'TrendingUp' },
    { name: 'Outras Receitas', type: 'income' as const, color: '#52525B', icon: 'PlusCircle' },

    // Saídas
    { name: 'Alimentação', type: 'expense' as const, color: '#EA580C', icon: 'Utensils' },
    { name: 'Moradia e Contas', type: 'expense' as const, color: '#DC2626', icon: 'Home' },
    { name: 'Transporte e Combustível', type: 'expense' as const, color: '#D97706', icon: 'Car' },
    { name: 'Fornecedores e Estoque', type: 'expense' as const, color: '#7C3AED', icon: 'Package' },
    { name: 'Impostos e Taxas', type: 'expense' as const, color: '#B91C1C', icon: 'Receipt' },
    { name: 'Lazer e Pessoal', type: 'expense' as const, color: '#DB2777', icon: 'Smile' },
    { name: 'Outras Despesas', type: 'expense' as const, color: '#71717A', icon: 'MinusCircle' },
  ];

  const now = new Date();
  for (const item of defaults) {
    await db.insert(categories).values({
      id: crypto.randomUUID(),
      userId: null,
      name: item.name,
      type: item.type,
      color: item.color,
      icon: item.icon,
      isDefault: true,
      createdAt: now,
    });
  }
}

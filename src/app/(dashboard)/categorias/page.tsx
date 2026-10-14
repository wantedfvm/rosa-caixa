import React from 'react';
import { getCategoriesDAL } from '@/dal/categories';
import { CategoriesManagerClient, CategoryItem } from '@/components/categories/CategoriesManagerClient';

export const dynamic = 'force-dynamic';

export default async function CategoriasPage() {
  const rawCategories = await getCategoriesDAL();

  const categories: CategoryItem[] = rawCategories.map((c) => ({
    id: c.id,
    name: c.name,
    type: c.type as 'income' | 'expense' | 'both',
    color: c.color,
    icon: c.icon,
    isDefault: c.isDefault,
  }));

  return <CategoriesManagerClient categories={categories} />;
}

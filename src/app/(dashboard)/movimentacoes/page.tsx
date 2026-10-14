import React from 'react';
import { getTransactionsDAL } from '@/dal/transactions';
import { getCategoriesDAL } from '@/dal/categories';
import { TransactionsManagerClient } from '@/components/transactions/TransactionsManagerClient';

export const dynamic = 'force-dynamic';

export default async function MovimentacoesPage() {
  const transactionsData = await getTransactionsDAL();
  const rawCategories = await getCategoriesDAL();

  const categories = rawCategories.map((c) => ({
    id: c.id,
    name: c.name,
    type: c.type,
    color: c.color,
  }));

  return (
    <TransactionsManagerClient
      initialTransactions={transactionsData}
      categories={categories}
    />
  );
}

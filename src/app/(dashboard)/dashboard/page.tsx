import React from 'react';
import { getCashDashboardMetricsDAL, getTransactionsDAL } from '@/dal/transactions';
import { getCategoriesDAL } from '@/dal/categories';
import { DashboardClient } from '@/components/dashboard/DashboardClient';

export const dynamic = 'force-dynamic';

interface DashboardPageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function DashboardPage(props: DashboardPageProps) {
  const searchParams = await props.searchParams;
  const period = searchParams.period || 'current_month';

  const metricsData = await getCashDashboardMetricsDAL(period);
  const recentTransactions = await getTransactionsDAL({ limit: 5 });
  const rawCategories = await getCategoriesDAL();

  const categories = rawCategories.map((c) => ({
    id: c.id,
    name: c.name,
    type: c.type,
    color: c.color,
  }));

  return (
    <DashboardClient
      metricsData={metricsData}
      recentTransactions={recentTransactions}
      categories={categories}
    />
  );
}

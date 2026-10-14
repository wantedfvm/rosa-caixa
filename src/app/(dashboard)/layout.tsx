import React from 'react';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/dal/auth-session';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await getAuthenticatedUser();
  } catch {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col md:flex-row pb-safe-nav">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

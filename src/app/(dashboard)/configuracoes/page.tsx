import React from 'react';
import { getAuthenticatedUser } from '@/dal/auth-session';
import { getUserSettingsDAL } from '@/dal/settings';
import { SettingsManagerClient } from '@/components/settings/SettingsManagerClient';

export const dynamic = 'force-dynamic';

export default async function ConfiguracoesPage() {
  const user = await getAuthenticatedUser();
  const settings = await getUserSettingsDAL();

  return (
    <SettingsManagerClient
      initialSettings={{
        initialBalanceCents: settings.initialBalanceCents,
        initialBalanceDate: settings.initialBalanceDate,
        fullName: settings.fullName || user.name,
      }}
      userEmail={user.email}
    />
  );
}

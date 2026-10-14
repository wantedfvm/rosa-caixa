import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export class UnauthorizedError extends Error {
  constructor(message = 'Não autorizado. Faça login para continuar.') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Acesso negado ao recurso solicitado.') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

/**
 * Deriva a sessão autenticada diretamente dos cabeçalhos/cookies no servidor.
 * O cliente nunca informa o userId manualmente.
 */
export async function getAuthenticatedUser() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session || !session.user || !session.user.id) {
    throw new UnauthorizedError();
  }

  return session.user;
}

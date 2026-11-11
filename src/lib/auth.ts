import { randomBytes } from 'crypto';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { ensureDefaultCategories } from '@/db/seed';

// Inicializa categorias padrão do sistema de forma segura
ensureDefaultCategories().catch(() => {});

const isProd = process.env.NODE_ENV === 'production';
const baseURL =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
  (isProd ? 'https://controle.rosanetwork.cloud' : 'http://localhost:3000');

/**
 * Segredo que assina as sessões. Nunca existe um valor padrão fixo no código:
 * quem conhecesse esse valor (o repositório é público) poderia forjar sessões.
 *
 * - Produção em execução: sem BETTER_AUTH_SECRET (mínimo 32 caracteres) o servidor se recusa a subir.
 * - Desenvolvimento: gera um segredo aleatório a cada início (as sessões caem ao reiniciar).
 * - Etapa de build: usa um valor descartável, porque nada é assinado durante o build.
 */
function resolveAuthSecret(): string {
  const configured = process.env.BETTER_AUTH_SECRET;
  if (configured && configured.length >= 32) return configured;

  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return randomBytes(32).toString('hex');
  }

  if (isProd) {
    throw new Error(
      'BETTER_AUTH_SECRET ausente ou com menos de 32 caracteres. Gere um com: openssl rand -base64 32'
    );
  }

  console.warn('[auth] BETTER_AUTH_SECRET não definido: usando um segredo aleatório temporário (sessões caem ao reiniciar).');
  return randomBytes(32).toString('hex');
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  rateLimit: {
    window: 15 * 60, // 15 minutos em segundos
    max: 5, // Limite de 5 tentativas por IP
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 dias de persistência
    updateAge: 60 * 60 * 24, // Atualiza a cada 24 horas
  },
  advanced: {
    useSecureCookies: isProd || baseURL.startsWith('https://'),
  },
  trustedOrigins: [
    'https://controle.rosanetwork.cloud',
    'https://www.controle.rosanetwork.cloud',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_APP_URL,
  ].filter(Boolean) as string[],
  secret: resolveAuthSecret(),
  baseURL,
  plugins: [nextCookies()],
});

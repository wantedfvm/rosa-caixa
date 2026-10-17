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
  secret: process.env.BETTER_AUTH_SECRET || 'desenvolvimento-local-chave-secreta-minimo-32-chars-long',
  baseURL,
  plugins: [nextCookies()],
});

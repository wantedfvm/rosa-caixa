import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { ensureDefaultCategories } from '@/db/seed';

// Inicializa categorias padrão do sistema de forma segura
ensureDefaultCategories().catch(() => {});

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
  secret: process.env.BETTER_AUTH_SECRET || 'desenvolvimento-local-chave-secreta-minimo-32-chars-long',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
});

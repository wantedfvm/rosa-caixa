import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';

// Inicialização segura para desenvolvimento local e ambiente serverless/Vercel
const isVercel = process.env.VERCEL === '1';
const defaultDbPath = isVercel
  ? path.join('/tmp', 'sqlite.db')
  : path.join(process.cwd(), 'sqlite.db');

const dbPath = process.env.DATABASE_URL || defaultDbPath;

// Garante que o diretório do arquivo SQLite exista
const dir = path.dirname(path.resolve(dbPath));
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const sqlite = new Database(dbPath);

// Ativa explicitamente a verificação de integridade referencial de chaves estrangeiras
sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite, { schema });
export type AppDB = typeof db;

// Executa migrações estruturais automaticamente se a pasta drizzle existir
try {
  const migrationsFolder = path.join(process.cwd(), 'drizzle');
  if (fs.existsSync(migrationsFolder)) {
    migrate(db, { migrationsFolder });
  }
} catch {
  // Evita interrupção caso as tabelas já existam ou em ambiente restrito de build
}

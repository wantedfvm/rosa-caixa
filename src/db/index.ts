import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';

// Inicialização segura para desenvolvimento local e ambiente de execução
const dbPath = process.env.DATABASE_URL || path.join(process.cwd(), 'sqlite.db');

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

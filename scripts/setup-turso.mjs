import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';

const url = process.env.TURSO_DATABASE_URL || 'libsql://rosa-caixa-wantedfvm.aws-sa-east-1.turso.io';
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!authToken) {
  console.error('Por favor, informe TURSO_AUTH_TOKEN via variável de ambiente.');
  process.exit(1);
}

const client = createClient({
  url,
  authToken,
});

async function main() {
  console.log('Conectando ao Turso...');

  // 1. Ler 0000_closed_black_knight.sql
  const sql0 = fs.readFileSync(path.join(process.cwd(), 'drizzle', '0000_closed_black_knight.sql'), 'utf-8');
  const statements0 = sql0.split('--> statement-breakpoint').map(s => s.trim()).filter(Boolean);

  console.log(`Aplicando ${statements0.length} declarações de schema inicial...`);
  for (const stmt of statements0) {
    try {
      await client.execute(stmt);
    } catch (err) {
      console.warn('Nota ao executar declaração 0:', err.message);
    }
  }

  // 2. Ler 0001_shallow_weapon_omega.sql
  const sql1 = fs.readFileSync(path.join(process.cwd(), 'drizzle', '0001_shallow_weapon_omega.sql'), 'utf-8');
  const statements1 = sql1.split('--> statement-breakpoint').map(s => s.trim()).filter(Boolean);

  console.log(`Aplicando ${statements1.length} declarações adicionais...`);
  for (const stmt of statements1) {
    try {
      await client.execute(stmt);
    } catch (err) {
      console.warn('Nota ao executar declaração 1:', err.message);
    }
  }

  // 3. Inserir Categorias Padrão
  console.log('Verificando categorias padrão no Turso...');
  const catCheck = await client.execute('SELECT count(*) as count FROM categories WHERE is_default = 1');
  const count = Number(catCheck.rows[0].count);

  if (count === 0) {
    console.log('Inserindo categorias padrão do sistema no Turso...');
    const defaults = [
      { name: 'Vendas', type: 'income', color: '#16A34A', icon: 'ShoppingBag' },
      { name: 'Serviços Prestados', type: 'income', color: '#2563EB', icon: 'Briefcase' },
      { name: 'Salário / Pró-labore', type: 'income', color: '#059669', icon: 'Wallet' },
      { name: 'Rendimentos', type: 'income', color: '#0D9488', icon: 'TrendingUp' },
      { name: 'Outras Receitas', type: 'income', color: '#52525B', icon: 'PlusCircle' },

      { name: 'Alimentação', type: 'expense', color: '#EA580C', icon: 'Utensils' },
      { name: 'Moradia e Contas', type: 'expense', color: '#DC2626', icon: 'Home' },
      { name: 'Transporte e Combustível', type: 'expense', color: '#D97706', icon: 'Car' },
      { name: 'Fornecedores e Estoque', type: 'expense', color: '#7C3AED', icon: 'Package' },
      { name: 'Impostos e Taxas', type: 'expense', color: '#B91C1C', icon: 'Receipt' },
      { name: 'Lazer e Pessoal', type: 'expense', color: '#DB2777', icon: 'Smile' },
      { name: 'Outras Despesas', type: 'expense', color: '#71717A', icon: 'MinusCircle' },
    ];

    const now = Math.floor(Date.now() / 1000);
    for (const item of defaults) {
      await client.execute({
        sql: `INSERT INTO categories (id, user_id, name, type, color, icon, is_default, created_at)
              VALUES (?, NULL, ?, ?, ?, ?, 1, ?)`,
        args: [crypto.randomUUID(), item.name, item.type, item.color, item.icon, now],
      });
    }
    console.log('Categorias padrão inseridas com sucesso!');
  } else {
    console.log(`Já existem ${count} categorias padrão no Turso.`);
  }

  // 4. Validar tabelas existentes
  const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;");
  console.log('Tabelas existentes no Turso:', tables.rows.map(r => r.name));

  console.log('\n✅ SUCESSO! Banco Turso configurado.');
}

main().catch(err => {
  console.error('Erro na configuração do Turso:', err);
  process.exit(1);
});

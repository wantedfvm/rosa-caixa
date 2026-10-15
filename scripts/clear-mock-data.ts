import { db } from '../src/db';
import { user, session, account, verification, userSettings, idempotencyKeys, transactions, categories } from '../src/db/schema';
import { isNotNull } from 'drizzle-orm';
import { ensureDefaultCategories } from '../src/db/seed';

async function clearAllMockData() {
  console.log('Iniciando limpeza total de dados falsos e de teste...');

  // 1. Apaga transacoes
  await db.delete(transactions);
  console.log('- Transacoes apagadas.');

  // 2. Apaga chaves de idempotencia
  await db.delete(idempotencyKeys);
  console.log('- Chaves de idempotencia apagadas.');

  // 3. Apaga configuracoes de usuario
  await db.delete(userSettings);
  console.log('- Configuracoes de usuario apagadas.');

  // 4. Apaga sessoes ativas
  await db.delete(session);
  console.log('- Sessoes apagadas.');

  // 5. Apaga contas de autenticacao
  await db.delete(account);
  console.log('- Contas de autenticacao apagadas.');

  // 6. Apaga verificacoes
  await db.delete(verification);
  console.log('- Verificacoes apagadas.');

  // 7. Apaga usuarios
  await db.delete(user);
  console.log('- Usuarios apagados.');

  // 8. Apaga categorias customizadas criadas por usuarios de teste
  await db.delete(categories).where(isNotNull(categories.userId));
  console.log('- Categorias customizadas de teste apagadas.');

  // 9. Garante que as categorias padrao globais continuem disponiveis para novas contas
  await ensureDefaultCategories();
  console.log('- Categorias padrao globais verificadas com sucesso.');

  console.log('Limpeza concluida com sucesso. O banco de dados esta 100% limpo e pronto.');
}

clearAllMockData().catch(console.error);

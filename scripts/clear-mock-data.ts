import { db } from '../src/db';
import { user, session, account, verification, userSettings, idempotencyKeys, transactions, categories } from '../src/db/schema';
import { isNotNull } from 'drizzle-orm';
import { ensureDefaultCategories } from '../src/db/seed';

async function clearAllMockData() {
  console.log('Iniciando limpeza total de dados falsos e de teste...');

  // 1. Apaga transacoes
  db.delete(transactions).run();
  console.log('- Transacoes apagadas.');

  // 2. Apaga chaves de idempotencia
  db.delete(idempotencyKeys).run();
  console.log('- Chaves de idempotencia apagadas.');

  // 3. Apaga configuracoes de usuario
  db.delete(userSettings).run();
  console.log('- Configuracoes de usuario apagadas.');

  // 4. Apaga sessoes ativas
  db.delete(session).run();
  console.log('- Sessoes apagadas.');

  // 5. Apaga contas de autenticacao
  db.delete(account).run();
  console.log('- Contas de autenticacao apagadas.');

  // 6. Apaga verificacoes
  db.delete(verification).run();
  console.log('- Verificacoes apagadas.');

  // 7. Apaga usuarios
  db.delete(user).run();
  console.log('- Usuarios apagados.');

  // 8. Apaga categorias customizadas criadas por usuarios de teste
  db.delete(categories).where(isNotNull(categories.userId)).run();
  console.log('- Categorias customizadas de teste apagadas.');

  // 9. Garante que as categorias padrao globais continuem disponiveis para novas contas
  await ensureDefaultCategories();
  console.log('- Categorias padrao globais verificadas com sucesso.');

  console.log('Limpeza concluida com sucesso. O banco de dados esta 100% limpo e pronto.');
}

clearAllMockData().catch(console.error);

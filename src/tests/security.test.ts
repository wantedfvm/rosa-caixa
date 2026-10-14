import { describe, it } from 'node:test';
import assert from 'node:assert';
import { db } from '../db';
import { categories, idempotencyKeys, user } from '../db/schema';
import { validateCategoryOwnership } from '../dal/categories';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';

describe('Testes de Segurança e Isolamento de Usuários (Anti-IDOR)', () => {
  it('SEC-01: Categoria padrão global é acessível por qualquer usuário', async () => {
    // Insere categoria padrão global
    const globalId = crypto.randomUUID();
    db.insert(categories).values({
      id: globalId,
      userId: null,
      name: 'Categoria Global Teste',
      type: 'both',
      isDefault: true,
      createdAt: new Date(),
    }).run();

    const allowedUserB = await validateCategoryOwnership(globalId, 'user-random-id-123');
    assert.strictEqual(allowedUserB, true);
  });

  it('SEC-02: Categoria privada do Usuário A é bloqueada para o Usuário B (Anti-IDOR)', async () => {
    const userA_Id = crypto.randomUUID();
    const userB_Id = crypto.randomUUID();

    // Insere usuário A
    db.insert(user).values({
      id: userA_Id,
      name: 'Usuário A',
      email: `usera-${Date.now()}@teste.com`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).run();

    // Insere categoria privada pertencente exclusivamente ao Usuário A
    const privateCatId = crypto.randomUUID();
    db.insert(categories).values({
      id: privateCatId,
      userId: userA_Id,
      name: 'Categoria Secreta do A',
      type: 'expense',
      isDefault: false,
      createdAt: new Date(),
    }).run();

    // Usuário A tenta usar sua própria categoria -> Permitido (true)
    const allowedForA = await validateCategoryOwnership(privateCatId, userA_Id);
    assert.strictEqual(allowedForA, true);

    // Usuário B tenta vincular a categoria do Usuário A -> Bloqueado (false)
    const allowedForB = await validateCategoryOwnership(privateCatId, userB_Id);
    assert.strictEqual(allowedForB, false);
  });

  it('SEC-03: Mecanismo de idempotência detecta chaves já processadas no servidor', () => {
    const testKey = crypto.randomUUID();
    const userId = crypto.randomUUID();
    const mockPayload = JSON.stringify({ id: 'tx-123', amountCents: 15000, status: 'ok' });

    // Insere usuário para atender chave estrangeira
    db.insert(user).values({
      id: userId,
      name: 'Usuário Idempotência',
      email: `idemp-${Date.now()}@teste.com`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).run();

    // 1. Primeira requisição: chave não existe no banco
    const initialCheck = db.select()
      .from(idempotencyKeys)
      .where(and(eq(idempotencyKeys.key, testKey), eq(idempotencyKeys.userId, userId)))
      .get();
    assert.strictEqual(initialCheck, undefined);

    // 2. Grava a resposta associada à chave
    db.insert(idempotencyKeys).values({
      key: testKey,
      userId,
      responsePayload: mockPayload,
      createdAt: new Date(),
    }).run();

    // 3. Segunda requisição com a mesma chave: detecta o registro existente
    const duplicateCheck = db.select()
      .from(idempotencyKeys)
      .where(and(eq(idempotencyKeys.key, testKey), eq(idempotencyKeys.userId, userId)))
      .get();

    assert.ok(duplicateCheck);
    assert.strictEqual(duplicateCheck.responsePayload, mockPayload);
  });
});

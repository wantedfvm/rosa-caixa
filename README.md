<p align="center">
  <img src="public/logo-rosa.png" alt="Rosa Network" width="96" />
</p>

<h1 align="center">Controle de Caixa · Rosa Network</h1>

<p align="center">
  Sistema web gratuito para controlar entradas, saídas e saldo real de forma simples, sem depender de planilhas.
</p>

<p align="center">
  <a href="https://controle.rosanetwork.cloud"><strong>Acessar o sistema (controle.rosanetwork.cloud) »</strong></a>
</p>

---

## Sobre

O **Controle de Caixa** foi criado para pequenos negócios, autônomos e uso pessoal. Você registra cada movimentação, organiza por categoria e acompanha o saldo do período e o saldo acumulado em tempo real, com exportação para Excel quando precisar.

Sem anúncios, sem cobrança e com os seus dados isolados na sua conta.

## Funcionalidades

- **Dashboard** com saldo atual, entradas, saídas e resultado líquido do período
- **Filtros de período**: hoje, 7 dias, mês atual, mês anterior, ano atual ou todo o histórico
- **Movimentações**: cadastro, edição e exclusão de entradas e saídas, com busca e filtros
- **Categorias** padrão (vendas, serviços, alimentação, impostos e outras) e categorias personalizadas
- **Saldo inicial** configurável, com data de corte respeitada no cálculo do saldo
- **Exportação CSV** pronta para o Excel em português (separador `;`, vírgula decimal e acentos corretos)
- **Layout responsivo**, com menu lateral no desktop e navegação inferior no celular
- **Privacidade (LGPD)**: aviso de cookies, Termos de Uso, Política de Privacidade e exclusão definitiva da conta com todos os dados

## Segurança

- Autenticação por e-mail e senha com [Better Auth](https://www.better-auth.com/), senha mínima de 8 caracteres e limite de tentativas por IP
- Sessão sempre lida no servidor: o cliente nunca informa o próprio `userId`
- Toda consulta e alteração é filtrada pelo usuário logado, impedindo acesso a dados de outra conta (proteção contra IDOR)
- Chave de idempotência em cada lançamento, evitando registros duplicados por clique duplo ou reenvio
- Valores monetários armazenados em **centavos inteiros**, sem erros de arredondamento de ponto flutuante
- Chaves estrangeiras com exclusão em cascata, garantindo que nada fique para trás ao excluir a conta

## Tecnologias

| Camada         | Ferramenta                                  |
| -------------- | ------------------------------------------- |
| Framework      | Next.js 15 (App Router, Server Actions)     |
| Interface      | React 19, Tailwind CSS 4, Lucide Icons      |
| Banco de dados | SQLite (better-sqlite3) com Drizzle ORM     |
| Autenticação   | Better Auth                                 |
| Validação      | Zod                                         |
| Testes         | `node:test` executado via tsx               |

## Como rodar localmente

**Requisitos:** Node.js 20 ou superior.

```bash
git clone https://github.com/wantedfvm/rosa-caixa.git
cd rosa-caixa
npm install
```

Copie o arquivo de exemplo e ajuste as variáveis:

```bash
cp .env.example .env
```

| Variável              | Descrição                                                           |
| --------------------- | ------------------------------------------------------------------- |
| `BETTER_AUTH_SECRET`  | Chave secreta da autenticação (mínimo 32 caracteres aleatórios)     |
| `BETTER_AUTH_URL`     | URL base da aplicação, ex.: `http://localhost:3000`                 |
| `NEXT_PUBLIC_APP_URL` | URL pública da aplicação                                            |
| `DATABASE_URL`        | Caminho do arquivo SQLite, ex.: `./sqlite.db`                       |

Para gerar uma chave segura:

```bash
openssl rand -base64 32
```

Crie as tabelas e inicie o servidor:

```bash
npm run db:migrate
npm run dev
```

Acesse `http://localhost:3000`. As categorias padrão são criadas automaticamente na primeira execução.

## Scripts

| Comando               | O que faz                                                        |
| --------------------- | ---------------------------------------------------------------- |
| `npm run dev`         | Servidor de desenvolvimento                                      |
| `npm run build`       | Build de produção                                                |
| `npm start`           | Executa o build de produção                                      |
| `npm run db:generate` | Gera novas migrações a partir de `src/db/schema.ts`              |
| `npm run db:migrate`  | Aplica as migrações no banco                                     |
| `npm test`            | Roda os testes de cálculo financeiro e de isolamento de usuários |
| `npm run db:clear`    | Apaga **todos** os usuários e lançamentos, mantendo as categorias padrão |

> Os testes de segurança gravam registros no banco configurado. Rode-os apontando para um banco separado:
>
> ```bash
> DATABASE_URL=./test.db npm run db:migrate && DATABASE_URL=./test.db npm test
> ```

## Estrutura do projeto

```
src/
├── actions/        Server Actions chamadas pela interface
├── app/
│   ├── (auth)/         Login e cadastro
│   ├── (dashboard)/    Dashboard, movimentações, categorias e configurações
│   ├── api/            Rotas de autenticação e exclusão de conta
│   ├── privacidade/    Política de Privacidade
│   └── termos/         Termos de Uso
├── components/     Componentes de interface por área
├── dal/            Camada de acesso a dados (sempre filtrada pelo usuário logado)
├── db/             Schema Drizzle, conexão e categorias padrão
├── lib/            Autenticação, cálculos financeiros, exportação e validações
├── tests/          Testes automatizados
└── middleware.ts   Proteção das rotas internas
drizzle/            Migrações SQL
scripts/            Scripts de manutenção do banco
```

## Deploy

A aplicação usa SQLite em arquivo, então precisa de um ambiente com **disco persistente** (VPS, Railway, Render, Fly.io ou similar). Em plataformas serverless sem disco persistente, os dados seriam perdidos a cada novo deploy.

```bash
npm run build
npm run db:migrate
npm start
```

Lembre de definir `BETTER_AUTH_SECRET` e `BETTER_AUTH_URL` com os valores de produção.

## Autor

Desenvolvido por **Lucas da Rosa** · [Rosa Network](https://wa.me/5551989509959)

Encontrou um problema ou tem uma sugestão? Abra uma [issue](../../issues).

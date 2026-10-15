<p align="center">
  <img src="public/logo-rosa.png" alt="Rosa Network" width="80" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="public/mascote-rosa.png" alt="Rosinha Mascote" width="80" />
</p>

<h1 align="center">Rosa Network · Controle de Caixa</h1>

<p align="center">
  Sistema web moderno e gratuito para controle de fluxo de caixa, desenvolvido para autônomos e pequenos negócios. Simples, organizado e sem depender de planilhas manuais.
</p>

<p align="center">
  <a href="https://controle.rosanetwork.cloud"><strong>Acessar o sistema oficial (controle.rosanetwork.cloud) »</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Database-Turso%20%2F%20LibSQL-00e699?style=flat-square" alt="Turso" />
  <img src="https://img.shields.io/badge/ORM-Drizzle-C5F74F?style=flat-square" alt="Drizzle" />
  <img src="https://img.shields.io/badge/Auth-Better%20Auth-purple?style=flat-square" alt="Better Auth" />
  <img src="https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
</p>

---

## 🌸 Conheça a Rosinha (Mascote Oficial)

O app conta com a **Rosinha**, mascote desenhada seguindo a metodologia **IP-as-Logo** (compacta, com formas arredondadas e carisma acolhedor). Ela acompanha o usuário no login, no cadastro, na barra lateral e no painel principal, tornando o hábito de cuidar das finanças mais leve e agradável. Ela também atua como o **favicon** oficial do sistema em abas de navegadores e atalhos móveis.

---

## ✨ Funcionalidades Principais

- **Painel Geral (Dashboard)**: Saldo atual consolidado, entradas, saídas e resultado líquido do período.
- **Filtros Temporais Inteligentes**: Visualização rápida de hoje, últimos 7 dias, mês atual, mês anterior, ano atual ou todo o histórico.
- **Movimentações Completas**: Cadastro, edição e exclusão de lançamentos com busca em tempo real e paginação.
- **Categorização Personalizada**: 12 categorias padrão pré-configuradas (vendas, serviços, alimentação, impostos, fornecedores, etc.) + criação ilimitada de categorias próprias.
- **Saldo Inicial Configurável**: Defina seu saldo de abertura com data de corte precisa.
- **Exportação para Excel (CSV)**: Exporta extratos formatados no padrão brasileiro (separador `;`, vírgula decimal e acentuação correta UTF-8 com BOM).
- **Interface Responsiva**: Menu lateral otimizado para desktop e barra inferior ergonômica com botão central de acesso rápido no celular.
- **Privacidade & LGPD**: Termos de Uso, Política de Privacidade com gestão de cookies e exclusão definitiva de conta com apagamento total dos dados em cascata.

---

## 🛡️ Segurança & Arquitetura

- **Better Auth**: Autenticação moderna por e-mail e senha (mínimo 8 caracteres) com rate limiting nativo por IP.
- **Sessão Segura no Servidor**: O `userId` é sempre extraído da sessão criptografada no servidor, nunca enviado pelo cliente.
- **Proteção Anti-IDOR**: Todas as consultas, alterações e categorias são filtradas com chave dupla (`id` e `userId`). Nenhuma conta acessa dados de outra.
- **Idempotência**: Prevenção de lançamentos duplicados por cliques duplos ou instabilidade de rede.
- **Precisão Financeira em Centavos**: Todos os valores são processados e armazenados em centavos inteiros (`amount_cents`), eliminando erros clássicos de arredondamento de ponto flutuante.
- **Turso / LibSQL (Serverless)**: Driver HTTP sem binários nativos C++, 100% imune a falhas de compilação em ambientes de nuvem e com persistência global.

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router, Server Actions) |
| **Interface** | React 19, Tailwind CSS 4, Lucide Icons |
| **Banco de Dados** | Turso (LibSQL) na nuvem / SQLite local |
| **ORM** | Drizzle ORM (drizzle-orm/libsql) |
| **Autenticação** | Better Auth com adapter Drizzle |
| **Validação** | Zod |
| **Testes** | `node:test` executado via tsx |

---

## 🚀 Como Executar Localmente

### 1. Pré-requisitos
- Node.js 20 ou superior.

### 2. Clonar e Instalar
```bash
git clone https://github.com/wantedfvm/rosa-caixa.git
cd rosa-caixa
npm install
```

### 3. Configurar Variáveis de Ambiente
Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

Para gerar uma chave segura de autenticação:
```bash
openssl rand -base64 32
```
Cole o valor gerado na variável `BETTER_AUTH_SECRET` dentro do seu `.env`.

### 4. Iniciar o Servidor
```bash
npm run dev
```
Acesse `http://localhost:3000`. O sistema usará o banco local `file:sqlite.db` automaticamente se as chaves do Turso não estiverem presentes.

---

## 🌐 Deploy em Produção (Vercel + Turso + Cloudflare)

### 1. Criar o Banco no Turso (Gratuito)
1. Acesse **[turso.tech](https://turso.tech)** e faça login com GitHub.
2. Crie um banco (ex: `rosa-caixa`) e copie a **Database URL** (`libsql://...`) e o **Auth Token**.
3. Aplique o schema e as categorias padrão com o script do projeto:
```bash
TURSO_DATABASE_URL="libsql://seu-banco.turso.io" TURSO_AUTH_TOKEN="seu-token" npm run db:setup:turso
```

### 2. Configurar na Vercel
Nas configurações do seu projeto na Vercel (**Settings** → **Environment Variables**), adicione:
- `TURSO_DATABASE_URL`: `libsql://seu-banco.turso.io`
- `TURSO_AUTH_TOKEN`: `seu-token-aqui`
- `BETTER_AUTH_SECRET`: `sua-chave-secreta-32-chars`
- `BETTER_AUTH_URL`: `https://controle.rosanetwork.cloud`
- `NEXT_PUBLIC_APP_URL`: `https://controle.rosanetwork.cloud`

### 3. Apontamento no Cloudflare DNS
Para usar o subdomínio `controle.rosanetwork.cloud`:
1. No painel do Cloudflare, acesse a zona **`rosanetwork.cloud`** → **DNS** → **Records**.
2. Adicione o registro:
   - **Type**: `CNAME`
   - **Name**: `controle`
   - **Target**: `cname.vercel-dns.com`
   - **Proxy status**: Proxied (Nuvem Laranja ativada após validação).
3. Em **SSL/TLS**, certifique-se de estar em **Full** ou **Full (Strict)**.

---

## 📜 Scripts Disponíveis

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor em modo de desenvolvimento |
| `npm run build` | Compila o projeto para produção |
| `npm start` | Executa o build de produção localmente |
| `npm test` | Executa a suíte de testes (cálculos financeiros e isolamento anti-IDOR) |
| `npm run db:push` | Sincroniza o schema do Drizzle diretamente com o Turso |
| `npm run db:setup:turso` | Cria as tabelas e semeia as 12 categorias padrão no Turso |
| `npm run db:clear` | Limpa dados de teste mantendo categorias padrão |

---

## 👤 Autor

Desenvolvido por **Lucas da Rosa** · [Rosa Network](https://wa.me/5551989509959)

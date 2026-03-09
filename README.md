# API de Tarefas com Node.js, JWT e Prisma

API REST para gerenciamento de tarefas com autenticação JWT, rotação de refresh token e PostgreSQL via Prisma.

## Stack

- Node.js
- Express
- PostgreSQL
- Prisma ORM
- JWT
- Pino
- Helmet
- Render
- Supabase

## Estrutura

src/
 ├ banco
 ├ config
 ├ controladores
 ├ middlewares
 ├ rotas
 ├ servicos
 ├ utils
 ├ app.js
 └ servidor.js

prisma/
 ├ migrations
 └ schema.prisma

## Variáveis de ambiente

Use o arquivo `.env.example` como base.

Campos principais:

- `DATABASE_URL`: string do Supabase Session pooler (porta 5432)
- `JWT_ACCESS_SECRET`: segredo do access token
- `JWT_EXPIRA_EM`: expiração do access token
- `REFRESH_EXPIRA_DIAS`: dias de validade do refresh token
- `COOKIE_SAMESITE`: `lax`, `strict` ou `none`
- `CORS_ORIGIN`: origem do frontend. Pode aceitar mais de uma, separando por vírgula
- `NODE_ENV`: `development` ou `production`

## Rodando localmente

```bash
npm install
npm run prisma:generate
npm run migrate:dev
npm run dev
```

## Endpoints

### Saúde

- `GET /`
- `GET /health`

### Autenticação

- `POST /auth/registrar`
- `POST /auth/login`
- `POST /auth/atualizar-token`
- `POST /auth/logout`

### Tarefas

- `GET /tarefas/listar`
- `POST /tarefas/registrar`

## Deploy no Render

Esse projeto está pronto para deploy via Git.

### Build Command

```bash
npm install && npm run prisma:generate
```

### Pre-Deploy Command

```bash
npm run migrate:deploy
```

### Start Command

```bash
npm start
```

### Environment Variables

Configure no Render:

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_EXPIRA_EM`
- `REFRESH_EXPIRA_DIAS`
- `COOKIE_SAMESITE`
- `NODE_ENV=production`
- `CORS_ORIGIN`
- `RATE_LIMIT_AUTH_MAX`

## Banco no Supabase

Para usar com Prisma em deploy server-based, use a connection string do **Supavisor Session pooler** na porta **5432**.

## Melhorias aplicadas

- `start` separado de migration
- `render.yaml` pronto
- `healthCheckPath` configurado
- CORS configurável por variável de ambiente
- rate limit nas rotas de autenticação
- tratamento de 404
- encerramento gracioso do Prisma
- `.env.example` incluído

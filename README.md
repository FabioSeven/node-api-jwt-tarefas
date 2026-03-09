# API JWT Tarefas

API REST com autenticação JWT, refresh token com rotação, Prisma e PostgreSQL.

## Principais recursos

- cadastro e login de usuário
- refresh token com rotação e revogação
- CRUD de tarefas por usuário autenticado
- soft delete de tarefas
- filtro por status e busca textual
- pronta para Render + Supabase

## Rotas principais

### Auth
- `POST /auth/registrar`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

### Tarefas
- `GET /tarefas/listar`
- `GET /tarefas/:id`
- `POST /tarefas/registrar`
- `PUT /tarefas/:id`
- `PATCH /tarefas/:id`
- `DELETE /tarefas/:id`

## Status aceitos

- `PENDENTE`
- `EM_ANDAMENTO`
- `CONCLUIDA`
- `CANCELADA`

## Variáveis de ambiente

```env
DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_EXPIRA_EM=15m
REFRESH_EXPIRA_DIAS=7
COOKIE_SAMESITE=lax
NODE_ENV=production
CORS_ORIGIN=
RATE_LIMIT_AUTH_MAX=20
```

## Scripts

```bash
npm install
npm run prisma:generate
npm run migrate:deploy
npm start
```

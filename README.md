# API de Tarefas com Node.js, JWT e Prisma

API REST construída em Node.js para gerenciamento de tarefas com autenticação JWT, refresh token e PostgreSQL via Prisma.

Projeto criado para estudo de boas práticas em APIs Node.js.

## Tecnologias

- Node.js
- Express
- PostgreSQL
- Prisma ORM
- JWT (JSON Web Token)
- Pino (logs)
- Helmet (segurança)
- Docker

- ## Estrutura do projeto

src/
 ├ rotas
 ├ controladores
 ├ servicos
 ├ middlewares
 ├ utils
 ├ banco
 └ app.js

prisma/
 └ schema.prisma

 ## Como rodar o projeto

1. Clone o repositório

git clone https://github.com/seuusuario/api-tarefas-node.git

2. Instale as dependências

npm install

3. Configure o arquivo .env

DATABASE_URL=
JWT_SECRETO=
PORT=3000

4. Execute as migrations

npx prisma migrate dev

5. Inicie o servidor

npm run dev

## Endpoints

### Autenticação

POST /auth/registrar  
POST /auth/login  
POST /auth/refresh  
POST /auth/logout

### Tarefas

GET /tarefas  
POST /tarefas  
GET /tarefas/:id  
PUT /tarefas/:id  
DELETE /tarefas/:id

## Autenticação

As rotas de tarefas exigem autenticação via Bearer Token.

Exemplo de header:

Authorization: Bearer TOKEN

## Melhorias futuras

- Documentação automática com Swagger
- Validação de dados com Zod
- Testes automatizados
- Deploy em ambiente cloud

FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci && npx prisma generate

COPY src ./src
COPY .env.example ./.env.example
COPY README.md ./README.md

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node src/servidor.js"]

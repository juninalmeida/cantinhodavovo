# Cantinho da Vovó

Aplicação de delivery construída como monólito modular com `React + Vite` no cliente e `Express + PostgreSQL` na API.

O foco do projeto é mostrar organização de código, separação por domínio e um fluxo completo de pedidos com autenticação, área do cliente e área administrativa.

## Stack

- `React + Vite + TypeScript`
- `Express + Node.js + TypeScript`
- `PostgreSQL`
- `JWT em cookie httpOnly`
- `Zod`
- `Jest + Supertest`

## Rodando localmente

Pré-requisitos:

- `Node.js 24+`
- `Docker`

Suba o banco e a aplicação:

```bash
npm install
docker compose -f infra/docker/docker-compose.yml up -d postgres
npm run db:migrate
npm run dev
```

URLs locais:

- Frontend: `http://localhost:5173`
- API: `http://localhost:4000`

## Scripts principais

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run test`
- `npm run db:migrate`
- `npm run db:seed`
- `npm run admin:create`
- `npm run security:audit-history`

## Produção

O deploy de produção foi preparado para rodar na Vercel, com banco PostgreSQL gerenciado e rate limit distribuído.

## Arquitetura

A visão geral da organização do projeto está em [`docs/architecture.md`](./docs/architecture.md).

## Segurança

- `.env` fica fora do repositório
- não existem credenciais públicas de admin
- `dangerouslySetInnerHTML` é bloqueado no lint
- o histórico Git pode ser auditado com `npm run security:audit-history`

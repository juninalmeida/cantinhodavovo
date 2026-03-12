# Cantinho da Vovó SaaS Foundation

Base inicial de um monólito modular para o Cantinho da Vovo, com:

- `React + Vite + TypeScript` no frontend
- `Express + Node.js + TypeScript` na API
- `PostgreSQL` como fonte autoritativa
- `JWT access token + refresh token rotativo em cookie httpOnly`
- `Zod` para validação de fronteira
- `Jest + Supertest` para testes
- `Docker Compose` para ambiente local

## Requisitos

- Node.js 24+
- Docker e Docker Compose

## Ambiente

1. Copie `.env.example` para `.env`
2. Ajuste os valores se necessário

## Scripts

- `npm run dev`: sobe frontend e API em paralelo
- `npm run dev:web`: sobe o frontend Vite
- `npm run dev:api`: sobe a API Express com `tsx`
- `npm run build`: builda frontend e backend
- `npm run build:web`: build do frontend
- `npm run build:api`: compilação do backend TypeScript
- `npm run lint`: lint da base
- `npm run test`: roda testes unitários e de integração
- `npm run db:migrate`: aplica migrations SQL
- `npm run db:seed`: cria usuários internos padrão
- `npm run docker:up`: sobe `postgres`, `api` e `web`

## Credenciais seed

Ao rodar `npm run db:seed`, os usuários abaixo sao criados caso nao existam:

- Admin: `admin@cantinhodavovo.local` / `Admin@123`
- Atendente: `atendente@cantinhodavovo.local` / `Atendente@123`

## Fluxo do pedido

- `PENDING`
- `PROCESSING`
- `READY`
- `OUT_FOR_DELIVERY`
- `DELIVERED`

O backend recalcula o total do pedido a partir do catalogo persistido e salva snapshot financeiro no pedido. O frontend so exibe previa.

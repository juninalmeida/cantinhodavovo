# Cantinho da Vovó SaaS Foundation

Base de um monólito modular para o Cantinho da Vovó, com:

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

## Estrutura do projeto

```text
.
├── infra/
│   ├── database/migrations
│   └── docker
├── public/
├── src/
│   ├── client/
│   │   ├── app
│   │   ├── modules
│   │   ├── shared
│   │   └── widgets
│   ├── server/
│   │   ├── app
│   │   ├── core
│   │   └── modules
│   └── shared/
├── tests/
└── tools/database
```

### Convenções

- `src/client/app`: bootstrap, rotas, layout e estilos globais.
- `src/client/modules`: código por domínio de negócio no frontend (`auth`, `home`, `orders`, `admin`, `catalog`).
- `src/client/shared`: peças reutilizáveis de frontend sem regra de negócio.
- `src/client/widgets`: blocos compostos de UI usados pela aplicação.
- `src/server/app`: composição da aplicação e bootstrap da API.
- `src/server/core`: infraestrutura transversal do backend (`config`, `database`, `http`, `middleware`).
- `src/server/modules`: regras de negócio do backend separadas por módulo.
- `src/shared`: contratos e utilitários compartilhados entre frontend e backend.
- `infra`: arquivos operacionais do projeto, como Docker e migrations.
- `tools`: scripts de manutenção e operação.

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

O backend recalcula o total do pedido a partir do catálogo persistido e salva snapshot financeiro no pedido. O frontend só exibe prévia.

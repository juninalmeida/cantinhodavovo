# Arquitetura

## Princípios

- Backend organizado por módulo de negócio e por camada.
- Frontend organizado por responsabilidade e domínio, não por “tipo genérico de componente”.
- `shared` contém apenas contratos e utilitários realmente compartilhados.
- A raiz do projeto mantém só arquivos exigidos pelo ecossistema de build/teste.

## Backend

```text
src/server
├── app
│   ├── build-services.ts
│   ├── create-app.ts
│   └── index.ts
├── core
│   ├── config
│   ├── database
│   ├── http
│   └── middleware
└── modules
    ├── admin
    ├── auth
    ├── catalog
    ├── orders
    └── users
```

- `app`: faz bootstrap e composição de dependências.
- `core`: reúne infraestrutura transversal.
- `modules/*/application`: casos de uso e orquestração.
- `modules/*/domain`: regras puras e modelos.
- `modules/*/infrastructure`: acesso a banco, hash, token e integrações.
- `modules/*/presentation/http`: rotas e borda HTTP.

## Frontend

```text
src/client
├── app
│   ├── bootstrap
│   ├── layout
│   ├── pages
│   ├── routes
│   └── styles
├── modules
│   ├── admin
│   ├── auth
│   ├── catalog
│   ├── home
│   └── orders
├── shared
│   ├── api
│   ├── icons
│   ├── ui
│   └── utils
└── widgets
    └── layout
```

- `app`: inicialização e estrutura global.
- `modules`: negócio do frontend, por domínio.
- `shared`: código reutilizável sem contexto de negócio.
- `widgets`: composições visuais maiores que usam `modules` e `shared`.

## Operação

```text
infra
├── database
│   └── migrations
└── docker

tools
└── database
```

- `infra`: arquivos de infraestrutura e execução.
- `tools`: scripts internos usados por desenvolvedores.

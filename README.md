# Cantinho da VóVó

**Plataforma de delivery online com gestão de combos integrados**

![CI](https://github.com/juninalmeida/cantinhodavovo/actions/workflows/ci.yml/badge.svg) ![React](https://img.shields.io/badge/React-19-blue) ![Node](https://img.shields.io/badge/Node-24-green) ![Vercel](https://img.shields.io/badge/Vercel-Deployed-black)

[Demo (Vercel)](https://cantinhodavovo.vercel.app/) [Issues](https://github.com/juninalmeida/cantinhodavovo/issues) • [Actions](https://github.com/juninalmeida/cantinhodavovo/actions)

## 📌 Visão Geral

- **Problema:** Negócios locais de alimentação principalmente em interior de capitais sofrem com o abismo de criatividade na criação de combos e pedidos via mensagens desestruturadas e gargalos no atendimento.
- **Solução:** Um sistema E-commerce de cardápio digital rápido e autônomo, focado na fácil escolha de combos e proteção anti-bot, com inovação onde o cliente pode montar o próprio sabor com as massas disponíveis.
- **Destaques técnicos:**
  - Fullstack deployment no ambiente serverless (Vercel) com funções segmentadas (Optional Catch-All pattern).
  - Controle de rate limit e middleware de segurança Turnstile em endpoints críticos.
  - Testes automatizados rodando em CI no GitHub Actions.
  - Banco de dados relacional PostgreSQL gerido localmente via neon.tech em produção.

## 🚀 Demo

[Acessar Aplicação ->](https://cantinhodavovo.vercel.app/)

## 🛠 Funcionalidades

- **Core:**
  - Navegação fluida no catálogo de produtos e exibição dinâmica de combos personalizados.
  - Carrinho de compras persistente e checkout otimizado (Guest ou Autenticado).
  - Autenticação JWT completa com Access/Refresh Tokens via cookies `HttpOnly`.
  - Painel Admin para gerenciamento unificado de pedidos.
- **Validações & UX:**
  - Feedback visual imediato usando interceptadores HTTP otimizados.
  - Proteção robusta contra CSRF tokens e validações de input estritas pelo backend (Zod).
  - Captcha integrado Invisível (Cloudflare Turnstile) no fechamento de pedidos e login.

## 🏗 Arquitetura & Decisões

- **Integração Vercel via Express:** Ao invés do Next.js padrão, adaptei um servidor Express vanilla `.ts` encapsulado num fallback `/api/index.ts` com Vercel rewrites para superar limites do plano "Hobby" e economizar custos.
- **Cookies `__Host-` em Produção:** Garantem mitigação superior contra sequestro de sessão em ambientes https, tornando impossível spoofing através de subdomínios.
- **State Management:** (Zustand + React)
  _Store do Carrinho e Usuário persistem → Componentes reativos (UI) → HTTP Client dispara mutações._

## 🧪 Qualidade & CI/CD

- **Lint:** `npm run lint` (ESLint strict config)
- **Testes:** `npm run test` (Jest sobre o build da API)
- **CodeQL Security:** Implementado no GitHub workflow para varreduras SAST de segurança.
- A **GitHub Action** garante que nenhum merge aconteça sem passar pelo Lint, Build e CodeQL (`ci.yml`).

## 💻 Como rodar localmente

**Requisitos:** Node 24.x, Docker

1. **Clone & Install**

   ```bash
   git clone https://github.com/juninalmeida/cantinhodavovo.git
   cd cantinhodavovo
   npm install
   ```

2. **Banco de Dados (Docker)**

   ```bash
   npm run docker:up
   ```

3. **Ambiente & Seeds**
   Crie seu `.env` com base no `.env.example` (certifique-se de configurar _DATABASE_URL_, e as chaves _TURNSTILE_).

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

   _(Para painel de Admin, crie-o: `npm run admin:create` informando email/senha no .env)._

4. **Rodar Aplicação (Frontend e Backend juntos)**
   ```bash
   npm run dev
   ```
   _Acesse http://localhost:5173_

## 📁 Estrutura do Projeto

- `/src/client` → Web App em React. Vite config, estilos globais e chamadas http.
- `/src/server` → Core do backend Express. Dividido em módulos DDD (auth, catalog, orders).
- `/api` → Entrypoint Serverless para Vercel.
- `/infra` → Configurações do Docker e Banco de Dados.

## 👨‍💻 Autor

### Horacio Junior

- 💼 [LinkedIn](https://www.linkedin.com/in/j%C3%BAnior-almeida-3563a934b/)
- 💻 [GitHub](https://github.com/juninalmeida)
- ✉️ [Email](mailto:junioralmeidati2023@gmail.com)

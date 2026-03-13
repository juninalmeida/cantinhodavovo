# Segurança

Este repositório pode ser público, mas não deve expor:

- segredos de produção
- credenciais administrativas
- cópias de `.env`

Regras práticas:

- `npm run db:seed` é só para ambiente local
- `npm run admin:create` é o fluxo correto para criar um admin fora do código
- qualquer segredo novo deve ficar no provedor de deploy, não no Git

Antes de abrir o repositório ou adicionar infraestrutura nova, rode:

```bash
npm run security:audit-history
```

Se você encontrar uma falha de segurança, não abra issue pública com detalhes de exploração. Reporte em canal privado para o responsável pelo projeto.

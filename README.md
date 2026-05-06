# Sistema de Gestão de Produtos para E-commerce

Projeto full stack com **Next.js + TypeScript + Tailwind CSS + SQLite** para gerenciamento de produtos de um e-commerce.

## Objetivo

Construir um CRUD completo de produtos com uma interface web simples e API integrada no próprio projeto.

## Stack

- **Frontend:** Next.js + React + TypeScript
- **Backend:** Next.js App Router + API Routes
- **Estilização:** Tailwind CSS
- **Banco de dados:** SQLite
- **Acesso ao banco:** `better-sqlite3`

## Estrutura atual

```text
src/
├── app/
│   ├── api/
│   │   └── health/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/
│   └── ui/
├── lib/
│   ├── apiResponse.ts
│   └── db.ts
└── modules/
    └── products/
        ├── components/
        ├── hooks/
        ├── repository/
        ├── services/
        └── types/
```

## Pré-requisitos

- Node.js 20+
- npm 10+

## Instalação

```bash
npm install
```

## Execução em desenvolvimento

```bash
npm run dev
```

A aplicação ficará disponível em:

```text
http://localhost:3000
```

## Scripts disponíveis

- `npm run dev` — inicia o servidor de desenvolvimento
- `npm run build` — gera a build de produção
- `npm run start` — inicia a aplicação em modo produção
- `npm run lint` — executa o lint do projeto

## Banco de dados

O projeto usa SQLite com arquivo local em `data/ecommerce.db`.

A conexão é gerenciada em `src/lib/db.ts`, com:

- criação automática da pasta `data/`
- conexão singleton
- `journal_mode = WAL`
- criação automática da tabela `products`

## Health Check

Endpoint disponível para validar a aplicação e a conexão com o banco:

```http
GET /api/health
```

Exemplo de resposta:

```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-05-06T17:02:26.283Z"
}
```

Você pode testar no navegador ou no terminal:

```bash
curl http://localhost:3000/api/health
```

## Status do projeto

### Sprint 1 — concluída

- Base do projeto criada com Next.js + TypeScript + Tailwind
- Estrutura modular inicial criada
- SQLite configurado com `better-sqlite3`
- Helpers de resposta HTTP criados
- Rota de health check implementada

## Documentação

A documentação do projeto está na pasta `doc/`:

- `doc/geral/documento_geral.md`
- `doc/spec/spec_cadastro_produto.md`
- `doc/sprint/sprint_1.md`
- `doc/sprint/sprint_2.md`
- `doc/sprint/sprint_3.md`
- `doc/sprint/sprint_4.md`

## Próximos passos

As próximas etapas previstas são:

- implementar o CRUD backend de produtos
- criar os tipos, repository e service do módulo `products`
- adicionar páginas e componentes de frontend
- incluir testes unitários

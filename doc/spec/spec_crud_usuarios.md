# Spec: CRUD de Usuários

## PRD — Product Requirements Document

### Objetivo
Implementar um módulo completo de gerenciamento de usuários com operações CRUD, seguindo a arquitetura modular já existente no projeto.

### Context / Problem
Atualmente o sistema possui apenas o domínio de produtos. É necessário adicionar um domínio de usuários para demonstrar modelagem de entidades, separação em camadas, persistência SQLite, integração frontend/backend e consumo de API REST.

### Product Scope

#### In Scope
- CRUD completo de usuários
- Persistência SQLite
- Exclusão lógica (`deleted`)
- Controle simples de papel (`role`)
- Interface frontend
- API REST
- Validações básicas

#### Out of Scope
- Login/autenticação
- JWT
- Refresh token
- Criptografia de senha
- Recuperação de senha

### Functional Requirements

| ID | Prioridade | Descrição |
|---|---|---|
| FR01 | shall | O sistema deve permitir cadastrar usuários |
| FR02 | shall | O sistema deve listar usuários não deletados |
| FR03 | shall | O sistema deve permitir editar usuários |
| FR04 | shall | O sistema deve permitir exclusão lógica |
| FR05 | shall | O sistema deve armazenar role (`admin` ou `user`) |

### Business Rules

| ID | Regra |
|---|---|
| BR01 | `email` deve ser único |
| BR02 | `role` aceita apenas `admin` ou `user` |
| BR03 | `deleted` deve usar `0` ou `1` |
| BR04 | Usuários deletados não aparecem na listagem |

---

# TechSpec — Technical Specification

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React + TypeScript |
| Backend | Next.js App Router |
| Banco | SQLite |
| Persistência | better-sqlite3 |
| Estilo | Tailwind CSS |

## Estrutura de Pastas

```txt
src/
├── app/
│   └── api/
│       └── users/
│           ├── route.ts
│           └── [id]/
│               └── route.ts
│
├── modules/
│   └── users/
│       ├── components/
│       ├── hooks/
│       ├── repository/
│       ├── services/
│       └── types/
```

## Schema SQLite

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  deleted INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## Endpoints

- GET `/api/users`
- POST `/api/users`
- GET `/api/users/[id]`
- PUT `/api/users/[id]`
- DELETE `/api/users/[id]`

## Regras de Arquitetura

- API Route chama Service
- Service valida regras de negócio
- Repository acessa SQLite
- Frontend usa hook central `useUsers`

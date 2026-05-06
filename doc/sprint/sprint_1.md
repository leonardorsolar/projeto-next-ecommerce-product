# 🚀 Sprint 1 — Setup e Foundation
> Sistema de Gestão de Produtos para E-commerce

**Duração estimada:** 1–2 horas
**Objetivo:** Ter o projeto criado, estruturado e com a conexão ao banco funcionando antes de escrever qualquer lógica de negócio.

---

## 📋 Checklist de Tarefas

- [ ] Criar projeto Next.js com TypeScript + Tailwind
- [ ] Configurar estrutura modular de pastas
- [ ] Instalar e configurar `better-sqlite3`
- [ ] Criar `lib/db.ts` com conexão singleton
- [ ] Criar tabela `products` via script SQL
- [ ] Criar `lib/apiResponse.ts` com helpers
- [ ] Testar rota health check `GET /api/health`

---

## 🛠️ Passo a Passo

### 1. Criar o projeto Next.js

```bash
npx create-next-app@latest ecommerce-produtos \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd ecommerce-produtos
```

---

### 2. Instalar dependências

```bash
npm install better-sqlite3
npm install --save-dev @types/better-sqlite3
```

---

### 3. Criar a estrutura de pastas

```bash
mkdir -p src/modules/products/components
mkdir -p src/modules/products/repository
mkdir -p src/modules/products/services
mkdir -p src/modules/products/types
mkdir -p src/modules/products/hooks
mkdir -p src/lib
mkdir -p src/components/ui
mkdir -p src/components/layout
```

---

### 4. Configurar conexão com SQLite (`src/lib/db.ts`)

```typescript
// src/lib/db.ts

import Database from 'better-sqlite3'
import path from 'path'

let db: Database.Database | null = null

export function getDb(): Database.Database {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'data', 'ecommerce.db')
    db = new Database(dbPath)
    db.pragma('journal_mode = WAL')
    initializeSchema(db)
  }
  return db
}

function initializeSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL,
      description TEXT,
      price       REAL    NOT NULL CHECK (price >= 0),
      stock       INTEGER NOT NULL CHECK (stock >= 0),
      created_at  TEXT    DEFAULT (datetime('now'))
    );
  `)
  console.info('[DB] Schema inicializado com sucesso')
}
```

> ⚠️ Crie a pasta `data/` na raiz do projeto e adicione `data/*.db` no `.gitignore`.

```bash
mkdir -p data
echo "data/*.db" >> .gitignore
```

---

### 5. Criar helpers de resposta HTTP (`src/lib/apiResponse.ts`)

```typescript
// src/lib/apiResponse.ts

import { NextResponse } from 'next/server'

export const ok = (data: unknown) =>
  NextResponse.json(data, { status: 200 })

export const created = (data: unknown) =>
  NextResponse.json(data, { status: 201 })

export const notFound = (message: string) =>
  NextResponse.json(
    { error: { code: 'PRODUCT_NOT_FOUND', message } },
    { status: 404 }
  )

export const badRequest = (code: string, message: string, details?: string) =>
  NextResponse.json(
    { error: { code, message, details } },
    { status: 400 }
  )

export const serverError = (message = 'Erro interno do servidor') =>
  NextResponse.json(
    { error: { code: 'INTERNAL_ERROR', message } },
    { status: 500 }
  )
```

---

### 6. Criar rota de Health Check (`src/app/api/health/route.ts`)

```bash
mkdir -p src/app/api/health
```

```typescript
// src/app/api/health/route.ts

import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  try {
    const db = getDb()
    db.prepare('SELECT 1').get()
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Health Check] Falha na conexão com o banco:', error)
    return NextResponse.json(
      { status: 'error', database: 'disconnected' },
      { status: 500 }
    )
  }
}
```

---

### 7. Testar

```bash
npm run dev
```

Acesse no browser:

```
http://localhost:3000/api/health
```

Resposta esperada:

```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-01-29T10:00:00.000Z"
}
```

---

## ✅ Critério de Conclusão do Sprint 1

O Sprint 1 está concluído quando:

- [ ] `npm run dev` sobe sem erros
- [ ] `GET /api/health` retorna `{ status: "ok", database: "connected" }`
- [ ] Arquivo `data/ecommerce.db` é criado automaticamente ao iniciar o servidor
- [ ] Estrutura de pastas criada conforme o planejado
- [ ] TypeScript sem erros de compilação

---

## ⚠️ Problemas Comuns

| Problema | Solução |
|---|---|
| Erro ao importar `better-sqlite3` | Verificar se `@types/better-sqlite3` está instalado |
| Banco não criado | Verificar se a pasta `data/` existe na raiz |
| Erro de módulo nativo | Rodar `npm rebuild better-sqlite3` |
| Erro de alias `@/` | Verificar `tsconfig.json` → `"paths": { "@/*": ["./src/*"] }` |

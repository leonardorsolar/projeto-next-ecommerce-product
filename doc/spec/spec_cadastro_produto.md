# Spec: Cadastro de Produto

---

## PRD — Product Requirements Document

### Objetivo
Permitir que um operador de e-commerce cadastre um novo produto informando nome, descrição, preço e estoque, persistindo os dados via API REST.

### Context / Problem
Hoje não há fluxo de cadastro de produtos implementado. Operadores não conseguem adicionar novos itens ao catálogo de forma autônoma, impedindo a operação do e-commerce.

### Product Scope
Cadastro básico com validação de dados, persistência no banco SQLite e retorno de confirmação. Edição e exclusão de produto estão fora do escopo desta spec.

#### In Scope
- Receber nome, descrição, preço e estoque
- Validar os dados de entrada
- Persistir o produto no banco SQLite
- Retornar confirmação de criação com os dados do produto

#### Out of Scope
- Edição de produto após cadastro
- Upload de imagem do produto
- Categorização de produtos
- Cadastro em lote (bulk insert)

---

### Functional Requirements

| ID | Prioridade | Descrição |
|---|---|---|
| FR01 | shall | O sistema deve permitir cadastrar um produto com nome, descrição, preço e estoque |
| FR02 | shall | O sistema deve rejeitar o cadastro quando o nome estiver vazio |
| FR03 | shall | O sistema deve rejeitar o cadastro quando o preço for negativo |
| FR04 | shall | O sistema deve rejeitar o cadastro quando o estoque for negativo |
| FR05 | shall | O sistema deve retornar 201 com os dados do produto criado em caso de sucesso |
| FR06 | should | O campo descrição deve ser opcional |

---

### Business Rules

| ID | Regra |
|---|---|
| BR01 | Nome é obrigatório e não pode ser vazio ou apenas espaços |
| BR02 | Preço deve ser maior ou igual a zero |
| BR03 | Estoque deve ser maior ou igual a zero |
| BR04 | Descrição é opcional — pode ser nula |
| BR05 | O `id` deve ser gerado automaticamente pelo banco |
| BR06 | O `createdAt` deve ser gerado automaticamente pelo banco |

---

### Acceptance Criteria

| ID | Cenário (Given / When / Then) |
|---|---|
| AC01 | Dado dados válidos (nome, preço ≥ 0, estoque ≥ 0), quando submete, então retorna 201 com `{ id, name, description, price, stock, createdAt }` |
| AC02 | Dado nome vazio, quando submete, então retorna 400 com código `INVALID_DATA` |
| AC03 | Dado preço negativo, quando submete, então retorna 400 com código `NEGATIVE_PRICE` |
| AC04 | Dado estoque negativo, quando submete, então retorna 400 com código `NEGATIVE_STOCK` |
| AC05 | Dado descrição ausente, quando submete com nome e preço válidos, então retorna 201 com `description: null` |

---

## TechSpec — Technical Specification

### Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js + React + TypeScript + Tailwind CSS |
| Backend | Next.js API Routes (TypeScript) |
| Banco | SQLite |
| Acesso ao banco | `better-sqlite3` (sem ORM) |

---

### Backend

#### Endpoint

```
POST /api/products
```

#### Request Body

```json
{
  "name": "string",
  "description": "string | undefined",
  "price": "number",
  "stock": "number"
}
```

#### Responses

| Status | Descrição | Body |
|---|---|---|
| 201 | Produto criado com sucesso | `{ id, name, description, price, stock, createdAt }` |
| 400 | Nome vazio | `{ error: { code: "INVALID_DATA", message: "Nome é obrigatório", details: "..." } }` |
| 400 | Preço negativo | `{ error: { code: "NEGATIVE_PRICE", message: "Preço não pode ser negativo" } }` |
| 400 | Estoque negativo | `{ error: { code: "NEGATIVE_STOCK", message: "Estoque não pode ser negativo" } }` |
| 500 | Erro interno | `{ error: { code: "INTERNAL_ERROR", message: "Erro interno do servidor" } }` |

---

#### Schema SQLite

```sql
CREATE TABLE IF NOT EXISTS products (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  description TEXT,
  price       REAL    NOT NULL CHECK (price >= 0),
  stock       INTEGER NOT NULL CHECK (stock >= 0),
  created_at  TEXT    DEFAULT (datetime('now'))
);
```

---

#### Lógica do Service (`productService.ts`)

```typescript
// modules/products/services/productService.ts

import { productRepository } from '../repository/productRepository'
import type { CreateProductDTO, Product } from '../types/product'

export class ValidationError extends Error {
  constructor(public code: string, message: string, public details?: string) {
    super(message)
  }
}

export const productService = {
  create(data: CreateProductDTO): Product {
    // 1. Validar nome
    if (!data.name || data.name.trim() === '') {
      throw new ValidationError('INVALID_DATA', 'Nome é obrigatório', 'O campo name não pode ser vazio')
    }

    // 2. Validar preço
    if (data.price < 0) {
      throw new ValidationError('NEGATIVE_PRICE', 'Preço não pode ser negativo')
    }

    // 3. Validar estoque
    if (data.stock < 0) {
      throw new ValidationError('NEGATIVE_STOCK', 'Estoque não pode ser negativo')
    }

    // 4. Persistir no banco
    return productRepository.create({
      name: data.name.trim(),
      description: data.description ?? null,
      price: data.price,
      stock: data.stock,
    })
  }
}
```

---

#### Lógica do Repository (`productRepository.ts`)

```typescript
// modules/products/repository/productRepository.ts

import { getDb } from '@/lib/db'
import type { Product, CreateProductDTO } from '../types/product'

export const productRepository = {
  create(data: CreateProductDTO): Product {
    const db = getDb()
    const stmt = db.prepare(`
      INSERT INTO products (name, description, price, stock)
      VALUES (@name, @description, @price, @stock)
    `)
    const result = stmt.run(data)
    return productRepository.findById(result.lastInsertRowid as number)!
  },

  findById(id: number): Product | null {
    const db = getDb()
    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id)
    return row ? mapRow(row) : null
  }
}

function mapRow(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    stock: row.stock,
    createdAt: row.created_at,
  }
}
```

---

#### API Route (`app/api/products/route.ts`)

```typescript
import { NextRequest } from 'next/server'
import { productService, ValidationError } from '@/modules/products/services/productService'
import { created, badRequest, serverError } from '@/lib/apiResponse'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const product = productService.create(body)
    return created(product)
  } catch (error) {
    if (error instanceof ValidationError) {
      return badRequest(error.code, error.message, error.details)
    }
    console.error('[POST /api/products]', error)
    return serverError()
  }
}
```

---

### Frontend

#### Componente Principal
`modules/products/components/ProductForm.tsx`

#### Campos do Formulário

| Campo | Tipo | Validação |
|---|---|---|
| `name` | text | obrigatório, não vazio |
| `description` | textarea | opcional |
| `price` | number | obrigatório, ≥ 0 |
| `stock` | number | obrigatório, ≥ 0, inteiro |

#### Fluxo de UI

1. Usuário acessa `/products/new`
2. Preenche o formulário e clica em **Cadastrar**
3. Botão entra em estado de loading (`disabled`)
4. `POST /api/products` é chamado
5. **Sucesso (201)** → exibe mensagem de sucesso + redireciona para `/products`
6. **Erro 400** → exibe mensagem de erro no campo correspondente
7. **Erro 500** → exibe mensagem genérica de erro no topo do formulário

#### Diagrama de Fluxo

```
[Usuário acessa /products/new]
        ↓
[Preenche formulário e submete]
        ↓
[Validação client-side]
  nome vazio? preço < 0? estoque < 0?
   ↓ inválido → exibe erro no campo
        ↓ válido
[POST /api/products]
        ↓
[productService.create()]
  ↓ nome vazio     → 400 INVALID_DATA
  ↓ preço < 0      → 400 NEGATIVE_PRICE
  ↓ estoque < 0    → 400 NEGATIVE_STOCK
        ↓ dados válidos
[productRepository.create()]
        ↓
[INSERT INTO products ...]
        ↓
[201 Created]
  { id, name, description, price, stock, createdAt }
        ↓
[Redireciona para /products]
```

---

### Testes

#### Unitários (`productService.test.ts`)

```typescript
describe('productService.create', () => {
  it('deve criar produto com dados válidos')
  it('deve lançar ValidationError quando nome está vazio')
  it('deve lançar ValidationError quando nome é só espaços')
  it('deve lançar ValidationError quando preço é negativo')
  it('deve lançar ValidationError quando estoque é negativo')
  it('deve aceitar descrição nula')
  it('deve aceitar preço igual a zero')
  it('deve aceitar estoque igual a zero')
})
```

#### Integração (`POST /api/products`)

- [ ] Retorna 201 com body correto para dados válidos
- [ ] Retorna 400 `INVALID_DATA` quando nome está vazio
- [ ] Retorna 400 `NEGATIVE_PRICE` quando preço é negativo
- [ ] Retorna 400 `NEGATIVE_STOCK` quando estoque é negativo
- [ ] Retorna 201 quando descrição está ausente (`description: null`)
- [ ] Não retorna campos extras além de `{ id, name, description, price, stock, createdAt }`

#### E2E (manual)

- [ ] Fluxo completo de cadastro com sucesso → redireciona para listagem
- [ ] Mensagem de erro visível ao submeter nome vazio
- [ ] Mensagem de erro visível ao submeter preço negativo
- [ ] Produto aparece na listagem após cadastro

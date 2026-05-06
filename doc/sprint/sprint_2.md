# 🔧 Sprint 2 — Backend CRUD
> Sistema de Gestão de Produtos para E-commerce

**Duração estimada:** 2–3 horas
**Pré-requisito:** Sprint 1 concluído (`GET /api/health` funcionando)
**Objetivo:** Implementar todas as rotas da API REST de produtos com validação, tratamento de erros e queries SQL.

---

## 📋 Checklist de Tarefas

- [ ] Criar `types/product.ts` com interfaces TypeScript
- [ ] Criar `productRepository.ts` com queries SQL
- [ ] Criar `productService.ts` com validações
- [ ] Implementar `GET /api/products`
- [ ] Implementar `POST /api/products`
- [ ] Implementar `GET /api/products/[id]`
- [ ] Implementar `PUT /api/products/[id]`
- [ ] Implementar `DELETE /api/products/[id]`
- [ ] Testar todos os endpoints via browser/curl

---

## 🛠️ Passo a Passo

### 1. Types TypeScript (`src/modules/products/types/product.ts`)

```typescript
// src/modules/products/types/product.ts

export interface Product {
  id: number
  name: string
  description: string | null
  price: number
  stock: number
  createdAt: string
}

export interface CreateProductDTO {
  name: string
  description?: string | null
  price: number
  stock: number
}

export interface UpdateProductDTO {
  name?: string
  description?: string | null
  price?: number
  stock?: number
}
```

---

### 2. Repository (`src/modules/products/repository/productRepository.ts`)

```typescript
// src/modules/products/repository/productRepository.ts

import { getDb } from '@/lib/db'
import type { Product, CreateProductDTO, UpdateProductDTO } from '../types/product'

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

export const productRepository = {
  findAll(): Product[] {
    const db = getDb()
    const rows = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all()
    return rows.map(mapRow)
  },

  findById(id: number): Product | null {
    const db = getDb()
    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id)
    return row ? mapRow(row) : null
  },

  create(data: CreateProductDTO): Product {
    const db = getDb()
    const stmt = db.prepare(`
      INSERT INTO products (name, description, price, stock)
      VALUES (@name, @description, @price, @stock)
    `)
    const result = stmt.run({
      name: data.name,
      description: data.description ?? null,
      price: data.price,
      stock: data.stock,
    })
    return productRepository.findById(result.lastInsertRowid as number)!
  },

  update(id: number, data: UpdateProductDTO): Product | null {
    const db = getDb()
    const current = productRepository.findById(id)
    if (!current) return null

    const stmt = db.prepare(`
      UPDATE products
      SET
        name        = @name,
        description = @description,
        price       = @price,
        stock       = @stock
      WHERE id = @id
    `)
    stmt.run({
      id,
      name: data.name ?? current.name,
      description: data.description !== undefined ? data.description : current.description,
      price: data.price ?? current.price,
      stock: data.stock ?? current.stock,
    })
    return productRepository.findById(id)
  },

  delete(id: number): boolean {
    const db = getDb()
    const result = db.prepare('DELETE FROM products WHERE id = ?').run(id)
    return result.changes > 0
  },
}
```

---

### 3. Service (`src/modules/products/services/productService.ts`)

```typescript
// src/modules/products/services/productService.ts

import { productRepository } from '../repository/productRepository'
import type { Product, CreateProductDTO, UpdateProductDTO } from '../types/product'

export class ValidationError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: string
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends Error {
  constructor(id: number) {
    super(`Produto com ID ${id} não encontrado`)
    this.name = 'NotFoundError'
  }
}

export const productService = {
  findAll(): Product[] {
    console.info('[ProductService] Buscando todos os produtos')
    return productRepository.findAll()
  },

  findById(id: number): Product {
    const product = productRepository.findById(id)
    if (!product) throw new NotFoundError(id)
    return product
  },

  create(data: CreateProductDTO): Product {
    if (!data.name || data.name.trim() === '') {
      throw new ValidationError('INVALID_DATA', 'Nome é obrigatório', 'O campo name não pode ser vazio')
    }
    if (typeof data.price !== 'number' || data.price < 0) {
      throw new ValidationError('NEGATIVE_PRICE', 'Preço não pode ser negativo')
    }
    if (typeof data.stock !== 'number' || data.stock < 0) {
      throw new ValidationError('NEGATIVE_STOCK', 'Estoque não pode ser negativo')
    }

    console.info('[ProductService] Criando produto:', { name: data.name, price: data.price })
    return productRepository.create({
      ...data,
      name: data.name.trim(),
    })
  },

  update(id: number, data: UpdateProductDTO): Product {
    if (data.name !== undefined && data.name.trim() === '') {
      throw new ValidationError('INVALID_DATA', 'Nome não pode ser vazio')
    }
    if (data.price !== undefined && data.price < 0) {
      throw new ValidationError('NEGATIVE_PRICE', 'Preço não pode ser negativo')
    }
    if (data.stock !== undefined && data.stock < 0) {
      throw new ValidationError('NEGATIVE_STOCK', 'Estoque não pode ser negativo')
    }

    const updated = productRepository.update(id, data)
    if (!updated) throw new NotFoundError(id)

    console.info('[ProductService] Produto atualizado:', { id })
    return updated
  },

  delete(id: number): void {
    const deleted = productRepository.delete(id)
    if (!deleted) throw new NotFoundError(id)
    console.info('[ProductService] Produto deletado:', { id })
  },
}
```

---

### 4. API Route — Coleção (`src/app/api/products/route.ts`)

```typescript
// src/app/api/products/route.ts

import { NextRequest } from 'next/server'
import { productService, ValidationError } from '@/modules/products/services/productService'
import { ok, created, badRequest, serverError } from '@/lib/apiResponse'

export async function GET() {
  try {
    const products = productService.findAll()
    return ok(products)
  } catch (error) {
    console.error('[GET /api/products]', error)
    return serverError()
  }
}

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

### 5. API Route — Item (`src/app/api/products/[id]/route.ts`)

```bash
mkdir -p src/app/api/products/\[id\]
```

```typescript
// src/app/api/products/[id]/route.ts

import { NextRequest } from 'next/server'
import { productService, ValidationError, NotFoundError } from '@/modules/products/services/productService'
import { ok, notFound, badRequest, serverError } from '@/lib/apiResponse'

interface Params {
  params: { id: string }
}

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const product = productService.findById(Number(params.id))
    return ok(product)
  } catch (error) {
    if (error instanceof NotFoundError) return notFound(error.message)
    return serverError()
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const body = await request.json()
    const product = productService.update(Number(params.id), body)
    return ok(product)
  } catch (error) {
    if (error instanceof NotFoundError) return notFound(error.message)
    if (error instanceof ValidationError) return badRequest(error.code, error.message, error.details)
    return serverError()
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    productService.delete(Number(params.id))
    return ok({ message: 'Produto deletado com sucesso' })
  } catch (error) {
    if (error instanceof NotFoundError) return notFound(error.message)
    return serverError()
  }
}
```

---

## 🧪 Testando os Endpoints

### Via curl

```bash
# Listar produtos
curl http://localhost:3000/api/products

# Cadastrar produto
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Camiseta","description":"Camiseta branca M","price":59.90,"stock":100}'

# Buscar por ID
curl http://localhost:3000/api/products/1

# Atualizar
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price":49.90,"stock":80}'

# Deletar
curl -X DELETE http://localhost:3000/api/products/1
```

### Respostas esperadas

| Endpoint | Status | Body |
|---|---|---|
| `GET /api/products` | 200 | `[{ id, name, ... }]` |
| `POST /api/products` (válido) | 201 | `{ id, name, ... }` |
| `POST /api/products` (nome vazio) | 400 | `{ error: { code: "INVALID_DATA", ... } }` |
| `GET /api/products/1` | 200 | `{ id, name, ... }` |
| `GET /api/products/999` | 404 | `{ error: { code: "PRODUCT_NOT_FOUND", ... } }` |
| `PUT /api/products/1` | 200 | `{ id, name, ... }` |
| `DELETE /api/products/1` | 200 | `{ message: "Produto deletado com sucesso" }` |

---

## ✅ Critério de Conclusão do Sprint 2

- [ ] `GET /api/products` retorna lista (vazia ou com itens)
- [ ] `POST /api/products` cria produto e retorna 201
- [ ] `POST /api/products` com dados inválidos retorna 400
- [ ] `GET /api/products/:id` retorna produto ou 404
- [ ] `PUT /api/products/:id` atualiza produto
- [ ] `DELETE /api/products/:id` remove produto ou retorna 404
- [ ] TypeScript sem erros de compilação

# 📦 Sistema de Gestão de Produtos para E-commerce
> Documentação Completa do Projeto

---

## ✅ Status do Planejamento

- [x] Visão geral validada
- [x] Stack tecnológica definida
- [x] Banco de dados escolhido
- [x] ORM decidido
- [x] Arquitetura selecionada
- [x] Padrões de código estabelecidos
- [x] Estratégia de testes definida
- [x] Tratamento de erros planejado
- [x] Roadmap aprovado

---

## 🎯 Seção 1 — Visão Geral

| Campo | Informação |
|---|---|
| **Produto** | Sistema de Gestão de Produtos para E-commerce |
| **Tipo** | Full Stack (Backend + Frontend) |
| **Objetivo** | CRUD completo de produtos (cadastrar, listar, atualizar, excluir) |
| **Prazo** | 1 dia |
| **Nível** | Iniciante |
| **Problema resolvido** | Permitir que operadores de um e-commerce gerenciem seu catálogo de produtos por uma interface web simples |

---

## ⚡ Seção 2 — Stack Tecnológica

| Camada | Tecnologia | Justificativa |
|---|---|---|
| **Frontend** | Next.js + React + TypeScript | Pages/App Router para as telas, componentes React simples |
| **Backend** | Next.js API Routes | Endpoints REST dentro do próprio projeto, sem servidor separado |
| **Linguagem** | TypeScript | Tipos ajudam a evitar erros, padrão do mercado com Next.js |
| **Estilização** | Tailwind CSS | Utility-first, rápido de estilizar sem sair do JSX |

> **Vantagem:** Um único projeto, um único `npm run dev`, deploy simples. Sem CORS para configurar, sem dois repositórios para manter.

---

## 🗄️ Seção 3 — Banco de Dados

| Campo | Decisão |
|---|---|
| **Banco escolhido** | SQLite |
| **Justificativa** | Arquivo local, zero configuração, funciona perfeitamente para um CRUD de produtos dentro do prazo de 1 dia |

---

## 🔌 Seção 4 — ORM

| Campo | Decisão |
|---|---|
| **Decisão** | Sem ORM — `better-sqlite3` |
| **Justificativa** | Controle direto sobre as queries, sem camada de abstração, menos dependências. Com SQLite o SQL é simples e direto para um CRUD básico. Demonstra conhecimento de SQL para o avaliador. |

---

## 🏗️ Seção 5 — Arquitetura e Estrutura de Pastas

### Estrutura Modular

```
src/
├── app/
│   ├── layout.tsx                    # Layout global
│   ├── page.tsx                      # Home → redireciona para /products
│   │
│   ├── products/                     # Módulo Produtos (Frontend)
│   │   ├── page.tsx                  # Lista todos os produtos
│   │   ├── new/
│   │   │   └── page.tsx              # Formulário de cadastro
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx          # Formulário de edição
│   │
│   └── api/
│       └── products/                 # Módulo Produtos (API Routes)
│           ├── route.ts              # GET /api/products  |  POST /api/products
│           └── [id]/
│               └── route.ts          # GET | PUT | DELETE /api/products/:id
│
├── modules/
│   └── products/
│       ├── components/               # Componentes exclusivos do módulo
│       │   ├── ProductCard.tsx
│       │   ├── ProductForm.tsx
│       │   └── ProductList.tsx
│       │
│       ├── repository/
│       │   └── productRepository.ts  # Todo SQL do módulo aqui
│       │
│       ├── services/
│       │   └── productService.ts     # Validações e regras de negócio
│       │
│       ├── types/
│       │   └── product.ts            # Types e interfaces TypeScript
│       │
│       └── hooks/
│           └── useProducts.ts        # Fetch + estado no client
│
├── lib/
│   ├── db.ts                         # Conexão singleton com SQLite
│   └── apiResponse.ts                # Helpers de resposta HTTP
│
├── components/                       # Componentes globais reutilizáveis
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Navbar.tsx
│
└── styles/
    └── globals.css
```

### Fluxo entre camadas

```
[page.tsx]
    ↓ chama
[api/products/route.ts]
    ↓ chama
[productService.ts]       ← valida dados, aplica regras
    ↓ chama
[productRepository.ts]    ← executa SQL no SQLite
    ↓ usa
[lib/db.ts]               ← conexão com o banco
```

### Responsabilidade de cada camada

| Arquivo | Responsabilidade |
|---|---|
| `route.ts` | Recebe request, chama service, retorna response |
| `productService.ts` | Valida dados, aplica regras de negócio |
| `productRepository.ts` | Executa queries SQL — única camada que toca o banco |
| `lib/db.ts` | Abre e mantém a conexão com o SQLite |
| `product.ts` (types) | Define `Product`, `CreateProductDTO`, `UpdateProductDTO` |
| `useProducts.ts` | Hook client-side para fetch e estado |
| `ProductForm.tsx` | Formulário reutilizado no cadastro e edição |

---

## 📐 Seção 6 — Padrões de Código e Convenções

### Nomenclatura

| Elemento | Padrão | Exemplo |
|---|---|---|
| Componentes React | PascalCase | `ProductCard.tsx` |
| Funções/métodos | camelCase + verbo | `createProduct`, `getProductById` |
| Variáveis | camelCase | `productId`, `createdAt` |
| Constantes | UPPER_SNAKE_CASE | `MAX_PRICE`, `DB_PATH` |
| Types/Interfaces | PascalCase | `Product`, `CreateProductDTO` |
| Arquivos TS | camelCase | `productRepository.ts` |
| Pastas | kebab-case | `product-card/` |

### Ferramentas

| Ferramenta | Função |
|---|---|
| **ESLint** | Já vem configurado no Next.js |
| **Prettier** | Formatação automática |
| **TypeScript strict** | Evita erros silenciosos |

### Types do módulo products

```typescript
// modules/products/types/product.ts

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
  description?: string
  price: number
  stock: number
}

export interface UpdateProductDTO {
  name?: string
  description?: string
  price?: number
  stock?: number
}
```

### Organização de imports

```typescript
// 1. Libs do Next.js/React
import { NextRequest, NextResponse } from 'next/server'

// 2. Libs de terceiros
import Database from 'better-sqlite3'

// 3. Módulos internos
import { productService } from '@/modules/products/services/productService'
import type { CreateProductDTO } from '@/modules/products/types/product'
```

---

## 🧪 Seção 7 — Estratégia de Testes

### Estratégia para o prazo

| Tipo | Incluir? | Justificativa |
|---|---|---|
| **Unitários** | ✅ Sim — poucos e focados | Testa o `productService` — a camada mais crítica |
| **Integração** | ⚠️ Opcional | Testa as API Routes — se sobrar tempo |
| **E2E** | ❌ Não | Consome muito tempo de setup |

### Framework

```
Jest + Testing Library
```

### O que testar no `productService`

```typescript
describe('productService', () => {
  it('deve criar produto com dados válidos')
  it('deve lançar erro quando nome está vazio')
  it('deve lançar erro quando preço é negativo')
  it('deve lançar erro quando estoque é negativo')
})
```

### Metas realistas para 1 dia

| Métrica | Meta |
|---|---|
| Cobertura do service | ≥ 70% |
| Fluxos principais da API | Testados manualmente |
| E2E | Manual pelo browser |

---

## 🚨 Seção 8 — Tratamento de Erros e Logging

### Formato padrão de resposta de erro

```json
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Produto não encontrado",
    "details": "Nenhum produto encontrado com o ID: 5"
  }
}
```

### Códigos de erro do módulo produtos

| Código | Status HTTP | Situação |
|---|---|---|
| `PRODUCT_NOT_FOUND` | 404 | ID não existe no banco |
| `INVALID_DATA` | 400 | Campos inválidos ou faltando |
| `NEGATIVE_PRICE` | 400 | Preço menor que zero |
| `NEGATIVE_STOCK` | 400 | Estoque menor que zero |
| `INTERNAL_ERROR` | 500 | Erro inesperado no servidor |

### Helper de resposta nas API Routes

```typescript
// lib/apiResponse.ts

import { NextResponse } from 'next/server'

export const ok = (data: unknown) =>
  NextResponse.json(data, { status: 200 })

export const created = (data: unknown) =>
  NextResponse.json(data, { status: 201 })

export const notFound = (message: string) =>
  NextResponse.json({ error: { code: 'PRODUCT_NOT_FOUND', message } }, { status: 404 })

export const badRequest = (code: string, message: string, details?: string) =>
  NextResponse.json({ error: { code, message, details } }, { status: 400 })

export const serverError = (message = 'Erro interno do servidor') =>
  NextResponse.json({ error: { code: 'INTERNAL_ERROR', message } }, { status: 500 })
```

### Padrão nas API Routes

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const product = productService.create(body)
    return created(product)
  } catch (error) {
    if (error instanceof ValidationError) {
      return badRequest(error.code, error.message, error.details)
    }
    return serverError()
  }
}
```

### Logging

```typescript
console.info('[ProductService] Criando produto:', { name, price })
console.error('[ProductRepository] Erro ao buscar produto:', error)
console.warn('[ProductService] Preço zerado detectado:', { productId })
```

> **Regra de ouro:** Nunca deixar um `catch` vazio. Todo erro deve ser logado e retornar uma resposta clara para o frontend.

---

## 📅 Seção 9 — Roadmap e Sprints

### Sprint 1 — Setup e Foundation (1–2h)
- [ ] Criar projeto Next.js com TypeScript + Tailwind
- [ ] Configurar estrutura modular de pastas
- [ ] Instalar e configurar `better-sqlite3`
- [ ] Criar `lib/db.ts` com conexão singleton
- [ ] Criar tabela `products` via script SQL
- [ ] Criar `lib/apiResponse.ts` com helpers
- [ ] Testar rota health check `GET /api/health`

### Sprint 2 — Backend CRUD (2–3h)
- [ ] Criar `types/product.ts` com interfaces
- [ ] Criar `productRepository.ts` com queries SQL
- [ ] Criar `productService.ts` com validações
- [ ] Implementar `GET /api/products`
- [ ] Implementar `POST /api/products`
- [ ] Implementar `GET /api/products/[id]`
- [ ] Implementar `PUT /api/products/[id]`
- [ ] Implementar `DELETE /api/products/[id]`
- [ ] Testar todos os endpoints via browser/curl

### Sprint 3 — Frontend (2–3h)
- [ ] Criar componentes globais (`Button`, `Input`)
- [ ] Criar `ProductCard.tsx` e `ProductList.tsx`
- [ ] Criar `ProductForm.tsx` reutilizável
- [ ] Criar `useProducts.ts` hook client-side
- [ ] Implementar página `/products` — listagem
- [ ] Implementar página `/products/new` — cadastro
- [ ] Implementar página `/products/[id]/edit` — edição
- [ ] Implementar exclusão com confirmação

### Sprint 4 — Qualidade e Entrega (1h)
- [ ] Escrever 4 testes unitários do `productService`
- [ ] Revisar tratamento de erros nas API Routes
- [ ] Adicionar estados de loading e erro no frontend
- [ ] Escrever `README.md` com instruções de instalação
- [ ] Checklist final de entrega

### Visão geral do dia

```
Manhã        →  Sprint 1 + Sprint 2 (Backend completo)
Tarde        →  Sprint 3 (Frontend completo)
Final do dia →  Sprint 4 (Testes + README + revisão)
```

# 🎨 Sprint 3 — Frontend
> Sistema de Gestão de Produtos para E-commerce

**Duração estimada:** 2–3 horas
**Pré-requisito:** Sprint 2 concluído (todos os endpoints da API funcionando)
**Objetivo:** Construir a interface web completa para listar, cadastrar, editar e excluir produtos.

---

## 📋 Checklist de Tarefas

- [ ] Criar componentes globais (`Button`, `Input`)
- [ ] Criar `ProductCard.tsx` e `ProductList.tsx`
- [ ] Criar `ProductForm.tsx` reutilizável
- [ ] Criar `useProducts.ts` hook client-side
- [ ] Implementar página `/products` — listagem
- [ ] Implementar página `/products/new` — cadastro
- [ ] Implementar página `/products/[id]/edit` — edição
- [ ] Implementar exclusão com modal de confirmação

---

## 🛠️ Passo a Passo

### 1. Componentes Globais

#### `src/components/ui/Button.tsx`

```tsx
// src/components/ui/Button.tsx

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'ghost'
  loading?: boolean
}

export function Button({ variant = 'primary', loading, children, ...props }: ButtonProps) {
  const base = 'px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  }

  return (
    <button className={`${base} ${variants[variant]}`} disabled={loading || props.disabled} {...props}>
      {loading ? 'Aguarde...' : children}
    </button>
  )
}
```

#### `src/components/ui/Input.tsx`

```tsx
// src/components/ui/Input.tsx

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
          ${error ? 'border-red-500' : 'border-gray-300'}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}
```

---

### 2. Hook de Produtos (`src/modules/products/hooks/useProducts.ts`)

```typescript
// src/modules/products/hooks/useProducts.ts

'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Product, CreateProductDTO, UpdateProductDTO } from '../types/product'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/products')
      if (!res.ok) throw new Error('Erro ao carregar produtos')
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      setError('Não foi possível carregar os produtos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const createProduct = async (data: CreateProductDTO) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      throw err.error
    }
    return res.json()
  }

  const updateProduct = async (id: number, data: UpdateProductDTO) => {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      throw err.error
    }
    return res.json()
  }

  const deleteProduct = async (id: number) => {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Erro ao deletar produto')
    await fetchProducts()
  }

  return { products, loading, error, fetchProducts, createProduct, updateProduct, deleteProduct }
}
```

---

### 3. Componente de Formulário (`src/modules/products/components/ProductForm.tsx`)

```tsx
// src/modules/products/components/ProductForm.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Product, CreateProductDTO } from '../types/product'

interface ProductFormProps {
  initialData?: Product
  onSubmit: (data: CreateProductDTO) => Promise<void>
}

export function ProductForm({ initialData, onSubmit }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    name: initialData?.name ?? '',
    description: initialData?.description ?? '',
    price: initialData?.price ?? '',
    stock: initialData?.stock ?? '',
  })

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    setFieldErrors(prev => ({ ...prev, [field]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setGlobalError(null)
    setFieldErrors({})

    try {
      await onSubmit({
        name: form.name,
        description: form.description || undefined,
        price: Number(form.price),
        stock: Number(form.stock),
      })
      router.push('/products')
    } catch (err: any) {
      if (err?.code === 'INVALID_DATA') setFieldErrors({ name: err.message })
      else if (err?.code === 'NEGATIVE_PRICE') setFieldErrors({ price: err.message })
      else if (err?.code === 'NEGATIVE_STOCK') setFieldErrors({ stock: err.message })
      else setGlobalError('Erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      {globalError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {globalError}
        </div>
      )}

      <Input label="Nome *" value={form.name} onChange={handleChange('name')} error={fieldErrors.name} required />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Descrição</label>
        <textarea
          value={form.description}
          onChange={handleChange('description')}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <Input label="Preço (R$) *" type="number" min="0" step="0.01" value={form.price} onChange={handleChange('price')} error={fieldErrors.price} required />
      <Input label="Estoque *" type="number" min="0" step="1" value={form.stock} onChange={handleChange('stock')} error={fieldErrors.stock} required />

      <div className="flex gap-3 mt-2">
        <Button type="submit" loading={loading}>
          {initialData ? 'Salvar Alterações' : 'Cadastrar Produto'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push('/products')}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
```

---

### 4. Card de Produto (`src/modules/products/components/ProductCard.tsx`)

```tsx
// src/modules/products/components/ProductCard.tsx

'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import type { Product } from '../types/product'

interface ProductCardProps {
  product: Product
  onDelete: (id: number) => Promise<void>
}

export function ProductCard({ product, onDelete }: ProductCardProps) {
  const [deleting, setDeleting] = useState(false)
  const [confirm, setConfirm] = useState(false)

  const handleDelete = async () => {
    if (!confirm) { setConfirm(true); return }
    setDeleting(true)
    await onDelete(product.id)
    setDeleting(false)
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-gray-900">{product.name}</h3>
        <span className="text-lg font-bold text-blue-600">
          R$ {product.price.toFixed(2)}
        </span>
      </div>

      {product.description && (
        <p className="text-sm text-gray-500">{product.description}</p>
      )}

      <p className="text-sm text-gray-600">
        Estoque: <span className="font-medium">{product.stock} unidades</span>
      </p>

      <div className="flex gap-2 mt-2">
        <Link href={`/products/${product.id}/edit`}>
          <Button variant="ghost" type="button">Editar</Button>
        </Link>
        <Button variant="danger" type="button" loading={deleting} onClick={handleDelete}>
          {confirm ? 'Confirmar exclusão' : 'Excluir'}
        </Button>
        {confirm && (
          <Button variant="ghost" type="button" onClick={() => setConfirm(false)}>Cancelar</Button>
        )}
      </div>
    </div>
  )
}
```

---

### 5. Páginas

#### Listagem (`src/app/products/page.tsx`)

```tsx
// src/app/products/page.tsx

'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ProductCard } from '@/modules/products/components/ProductCard'
import { useProducts } from '@/modules/products/hooks/useProducts'

export default function ProductsPage() {
  const { products, loading, error, deleteProduct } = useProducts()

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
        <Link href="/products/new">
          <Button>+ Novo Produto</Button>
        </Link>
      </div>

      {loading && <p className="text-gray-500">Carregando produtos...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && products.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">Nenhum produto cadastrado.</p>
          <p className="text-sm mt-1">Clique em "+ Novo Produto" para começar.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} onDelete={deleteProduct} />
        ))}
      </div>
    </div>
  )
}
```

#### Cadastro (`src/app/products/new/page.tsx`)

```tsx
// src/app/products/new/page.tsx

'use client'

import { ProductForm } from '@/modules/products/components/ProductForm'
import { useProducts } from '@/modules/products/hooks/useProducts'

export default function NewProductPage() {
  const { createProduct } = useProducts()

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Novo Produto</h1>
      <ProductForm onSubmit={createProduct} />
    </div>
  )
}
```

#### Edição (`src/app/products/[id]/edit/page.tsx`)

```tsx
// src/app/products/[id]/edit/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ProductForm } from '@/modules/products/components/ProductForm'
import { useProducts } from '@/modules/products/hooks/useProducts'
import type { Product } from '@/modules/products/types/product'

export default function EditProductPage() {
  const { id } = useParams()
  const { updateProduct } = useProducts()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="p-6 text-gray-500">Carregando...</p>
  if (!product) return <p className="p-6 text-red-500">Produto não encontrado.</p>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Produto</h1>
      <ProductForm
        initialData={product}
        onSubmit={(data) => updateProduct(product.id, data)}
      />
    </div>
  )
}
```

---

## ✅ Critério de Conclusão do Sprint 3

- [ ] Página `/products` lista todos os produtos
- [ ] Página `/products/new` cadastra produto e redireciona
- [ ] Página `/products/[id]/edit` edita produto e redireciona
- [ ] Exclusão funciona com confirmação de dois cliques
- [ ] Estados de loading visíveis durante operações
- [ ] Erros da API exibidos nos campos corretos
- [ ] Interface responsiva em mobile e desktop

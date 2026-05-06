'use client'

import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { CreateProductDTO, Product } from '../types/product'

interface ProductFormProps {
  initialData?: Product
  onSubmit: (data: CreateProductDTO) => Promise<unknown>
}

interface ErrorPayload {
  code?: string
  message?: string
}

export function ProductForm({ initialData, onSubmit }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    name: initialData?.name ?? '',
    description: initialData?.description ?? '',
    price: String(initialData?.price ?? ''),
    stock: String(initialData?.stock ?? ''),
  })

  const handleChange =
    (field: 'name' | 'description' | 'price' | 'stock') =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
      setFieldErrors((prev) => ({ ...prev, [field]: '' }))
    }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
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
    } catch (error) {
      const payload = error as ErrorPayload

      if (payload?.code === 'INVALID_DATA') {
        setFieldErrors({ name: payload.message ?? 'Nome inválido' })
      } else if (payload?.code === 'NEGATIVE_PRICE') {
        setFieldErrors({ price: payload.message ?? 'Preço inválido' })
      } else if (payload?.code === 'NEGATIVE_STOCK') {
        setFieldErrors({ stock: payload.message ?? 'Estoque inválido' })
      } else {
        setGlobalError('Erro inesperado. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-4">
      {globalError ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {globalError}
        </div>
      ) : null}

      <Input
        label="Nome *"
        value={form.name}
        onChange={handleChange('name')}
        error={fieldErrors.name}
        required
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700">Descrição</label>
        <textarea
          value={form.description}
          onChange={handleChange('description')}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <Input
        label="Preço (R$) *"
        type="number"
        min="0"
        step="0.01"
        value={form.price}
        onChange={handleChange('price')}
        error={fieldErrors.price}
        required
      />

      <Input
        label="Estoque *"
        type="number"
        min="0"
        step="1"
        value={form.stock}
        onChange={handleChange('stock')}
        error={fieldErrors.stock}
        required
      />

      <div className="mt-2 flex gap-3">
        <Button type="submit" loading={loading}>
          {initialData ? 'Salvar alterações' : 'Cadastrar produto'}
        </Button>

        <Button type="button" variant="ghost" onClick={() => router.push('/products')}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}

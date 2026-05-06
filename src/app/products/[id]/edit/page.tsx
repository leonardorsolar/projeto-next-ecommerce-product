'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ProductForm } from '@/modules/products/components/ProductForm'
import { useProducts } from '@/modules/products/hooks/useProducts'
import type { Product } from '@/modules/products/types/product'

export default function EditProductPage() {
  const params = useParams<{ id: string }>()
  const { updateProduct } = useProducts()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const productId = Number(params.id)

    if (!Number.isFinite(productId)) {
      setError('ID de produto inválido.')
      setLoading(false)
      return
    }

    const loadProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/products/${productId}`)
        if (!response.ok) {
          setError('Produto não encontrado.')
          return
        }

        const data: Product = await response.json()
        setProduct(data)
      } catch {
        setError('Erro ao carregar produto.')
      } finally {
        setLoading(false)
      }
    }

    void loadProduct()
  }, [params.id])

  if (loading) {
    return <p className="p-6 text-slate-500">Carregando...</p>
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>
  }

  if (!product) {
    return <p className="p-6 text-red-500">Produto não encontrado.</p>
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Editar produto</h1>
      <ProductForm initialData={product} onSubmit={(data) => updateProduct(product.id, data)} />
    </main>
  )
}

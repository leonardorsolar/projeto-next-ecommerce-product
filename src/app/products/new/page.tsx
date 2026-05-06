'use client'

import { ProductForm } from '@/modules/products/components/ProductForm'
import { useProducts } from '@/modules/products/hooks/useProducts'

export default function NewProductPage() {
  const { createProduct } = useProducts()

  return (
    <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Novo produto</h1>
      <ProductForm onSubmit={createProduct} />
    </main>
  )
}

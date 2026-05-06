'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ProductList } from '@/modules/products/components/ProductList'
import { useProducts } from '@/modules/products/hooks/useProducts'

export default function ProductsPage() {
  const { products, loading, error, deleteProduct } = useProducts()

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Produtos</h1>
        <Link href="/products/new">
          <Button>+ Novo Produto</Button>
        </Link>
      </header>

      {loading ? <p className="text-slate-500">Carregando produtos...</p> : null}
      {error ? <p className="text-red-500">{error}</p> : null}

      {!loading && !error ? <ProductList products={products} onDelete={deleteProduct} /> : null}
    </main>
  )
}

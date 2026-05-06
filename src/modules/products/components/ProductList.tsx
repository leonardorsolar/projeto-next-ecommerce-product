import { ProductCard } from './ProductCard'
import type { Product } from '../types/product'

interface ProductListProps {
  products: Product[]
  onDelete: (id: number) => Promise<void>
}

export function ProductList({ products, onDelete }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400">
        <p className="text-lg">Nenhum produto cadastrado.</p>
        <p className="mt-1 text-sm">Clique em "+ Novo Produto" para começar.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onDelete={onDelete} />
      ))}
    </div>
  )
}

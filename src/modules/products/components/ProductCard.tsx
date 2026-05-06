'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type { Product } from '../types/product'

interface ProductCardProps {
  product: Product
  onDelete: (id: number) => Promise<void>
}

export function ProductCard({ product, onDelete }: ProductCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirmDelete = async () => {
    setDeleting(true)
    setError(null)

    try {
      await onDelete(product.id)
      setConfirmOpen(false)
    } catch {
      setError('Não foi possível excluir o produto. Tente novamente.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <article className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base font-semibold text-slate-900">{product.name}</h3>
          <span className="text-lg font-bold text-blue-600">R$ {product.price.toFixed(2)}</span>
        </div>

        {product.description ? <p className="text-sm text-slate-500">{product.description}</p> : null}

        <p className="text-sm text-slate-600">
          Estoque: <span className="font-medium">{product.stock} unidades</span>
        </p>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div className="mt-1 flex flex-wrap gap-2">
          <Link href={`/products/${product.id}/edit`}>
            <Button type="button" variant="ghost">
              Editar
            </Button>
          </Link>

          <Button type="button" variant="danger" onClick={() => setConfirmOpen(true)}>
            Excluir
          </Button>
        </div>
      </article>

      <Modal
        open={confirmOpen}
        title="Confirmar exclusão"
        message={`Tem certeza que deseja excluir o produto \"${product.name}\"?`}
        confirmText="Excluir"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  )
}

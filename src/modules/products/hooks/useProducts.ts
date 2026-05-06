'use client'

import { useCallback, useEffect, useState } from 'react'
import type { CreateProductDTO, Product, UpdateProductDTO } from '../types/product'

interface ApiError {
  code?: string
  message?: string
  details?: string
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message
  return fallback
}

async function parseError(response: Response): Promise<ApiError> {
  try {
    const data = await response.json()
    return data?.error ?? { message: 'Erro na requisição' }
  } catch {
    return { message: 'Erro na requisição' }
  }
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error('Erro ao carregar produtos')

      const data: Product[] = await response.json()
      setProducts(data)
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível carregar os produtos.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const createProduct = async (data: CreateProductDTO): Promise<Product> => {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw await parseError(response)
    }

    return response.json()
  }

  const updateProduct = async (id: number, data: UpdateProductDTO): Promise<Product> => {
    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw await parseError(response)
    }

    return response.json()
  }

  const deleteProduct = async (id: number): Promise<void> => {
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const apiError = await parseError(response)
      throw new Error(apiError.message ?? 'Erro ao deletar produto')
    }

    await fetchProducts()
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}

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

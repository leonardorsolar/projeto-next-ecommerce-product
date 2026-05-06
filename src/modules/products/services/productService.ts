// src/modules/products/services/productService.ts

import { productRepository } from '../repository/productRepository'
import type { Product, CreateProductDTO, UpdateProductDTO } from '../types/product'

export class ValidationError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: string
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends Error {
  constructor(id: number) {
    super(`Produto com ID ${id} não encontrado`)
    this.name = 'NotFoundError'
  }
}

export const productService = {
  findAll(): Product[] {
    console.info('[ProductService] Buscando todos os produtos')
    return productRepository.findAll()
  },

  findById(id: number): Product {
    const product = productRepository.findById(id)
    if (!product) throw new NotFoundError(id)
    return product
  },

  create(data: CreateProductDTO): Product {
    if (!data.name || data.name.trim() === '') {
      throw new ValidationError('INVALID_DATA', 'Nome é obrigatório', 'O campo name não pode ser vazio')
    }
    if (typeof data.price !== 'number' || data.price < 0) {
      throw new ValidationError('NEGATIVE_PRICE', 'Preço não pode ser negativo')
    }
    if (typeof data.stock !== 'number' || data.stock < 0) {
      throw new ValidationError('NEGATIVE_STOCK', 'Estoque não pode ser negativo')
    }

    console.info('[ProductService] Criando produto:', { name: data.name, price: data.price })
    return productRepository.create({
      ...data,
      name: data.name.trim(),
    })
  },

  update(id: number, data: UpdateProductDTO): Product {
    if (data.name !== undefined && data.name.trim() === '') {
      throw new ValidationError('INVALID_DATA', 'Nome não pode ser vazio')
    }
    if (data.price !== undefined && data.price < 0) {
      throw new ValidationError('NEGATIVE_PRICE', 'Preço não pode ser negativo')
    }
    if (data.stock !== undefined && data.stock < 0) {
      throw new ValidationError('NEGATIVE_STOCK', 'Estoque não pode ser negativo')
    }

    const updated = productRepository.update(id, data)
    if (!updated) throw new NotFoundError(id)

    console.info('[ProductService] Produto atualizado:', { id })
    return updated
  },

  delete(id: number): void {
    const deleted = productRepository.delete(id)
    if (!deleted) throw new NotFoundError(id)
    console.info('[ProductService] Produto deletado:', { id })
  },
}

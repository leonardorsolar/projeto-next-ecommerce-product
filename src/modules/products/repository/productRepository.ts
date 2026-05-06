// src/modules/products/repository/productRepository.ts

import { getDb } from '@/lib/db'
import type { Product, CreateProductDTO, UpdateProductDTO } from '../types/product'

interface ProductRow {
  id: number
  name: string
  description: string | null
  price: number
  stock: number
  created_at: string
}

function mapRow(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    stock: row.stock,
    createdAt: row.created_at,
  }
}

export const productRepository = {
  findAll(): Product[] {
    const db = getDb()
    const rows = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all() as ProductRow[]
    return rows.map(mapRow)
  },

  findById(id: number): Product | null {
    const db = getDb()
    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as ProductRow | undefined
    return row ? mapRow(row) : null
  },

  create(data: CreateProductDTO): Product {
    const db = getDb()
    const stmt = db.prepare(`
      INSERT INTO products (name, description, price, stock)
      VALUES (@name, @description, @price, @stock)
    `)
    const result = stmt.run({
      name: data.name,
      description: data.description ?? null,
      price: data.price,
      stock: data.stock,
    })
    return productRepository.findById(result.lastInsertRowid as number)!
  },

  update(id: number, data: UpdateProductDTO): Product | null {
    const db = getDb()
    const current = productRepository.findById(id)
    if (!current) return null

    const stmt = db.prepare(`
      UPDATE products
      SET
        name        = @name,
        description = @description,
        price       = @price,
        stock       = @stock
      WHERE id = @id
    `)
    stmt.run({
      id,
      name: data.name ?? current.name,
      description: data.description !== undefined ? data.description : current.description,
      price: data.price ?? current.price,
      stock: data.stock ?? current.stock,
    })
    return productRepository.findById(id)
  },

  delete(id: number): boolean {
    const db = getDb()
    const result = db.prepare('DELETE FROM products WHERE id = ?').run(id)
    return result.changes > 0
  },
}

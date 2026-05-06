// src/app/api/products/route.ts

import { NextRequest } from 'next/server'
import { productService, ValidationError } from '@/modules/products/services/productService'
import { ok, created, badRequest, serverError } from '@/lib/apiResponse'

export async function GET() {
  try {
    const products = productService.findAll()
    return ok(products)
  } catch (error) {
    console.error('[GET /api/products]', error)
    return serverError()
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const product = productService.create(body)
    return created(product)
  } catch (error) {
    if (error instanceof ValidationError) {
      return badRequest(error.code, error.message, error.details)
    }
    console.error('[POST /api/products]', error)
    return serverError()
  }
}

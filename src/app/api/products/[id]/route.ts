// src/app/api/products/[id]/route.ts

import { NextRequest } from 'next/server'
import { productService, ValidationError, NotFoundError } from '@/modules/products/services/productService'
import { ok, notFound, badRequest, serverError } from '@/lib/apiResponse'

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const product = productService.findById(Number(id))
    return ok(product)
  } catch (error) {
    if (error instanceof NotFoundError) return notFound(error.message)
    return serverError()
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await request.json()
    const product = productService.update(Number(id), body)
    return ok(product)
  } catch (error) {
    if (error instanceof NotFoundError) return notFound(error.message)
    if (error instanceof ValidationError) return badRequest(error.code, error.message, error.details)
    return serverError()
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    productService.delete(Number(id))
    return ok({ message: 'Produto deletado com sucesso' })
  } catch (error) {
    if (error instanceof NotFoundError) return notFound(error.message)
    return serverError()
  }
}

import { NextResponse } from 'next/server'

export const ok = (data: unknown) => NextResponse.json(data, { status: 200 })

export const created = (data: unknown) =>
  NextResponse.json(data, { status: 201 })

export const notFound = (message: string, code = 'PRODUCT_NOT_FOUND') =>
  NextResponse.json(
    { error: { code, message } },
    { status: 404 },
  )

export const badRequest = (
  code: string,
  message: string,
  details?: string,
) =>
  NextResponse.json(
    { error: { code, message, details } },
    { status: 400 },
  )

export const serverError = (message = 'Erro interno do servidor') =>
  NextResponse.json(
    { error: { code: 'INTERNAL_ERROR', message } },
    { status: 500 },
  )

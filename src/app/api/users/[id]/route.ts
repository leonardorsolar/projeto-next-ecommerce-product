import { NextRequest } from 'next/server'
import { badRequest, notFound, ok, serverError } from '@/lib/apiResponse'
import { NotFoundError, userService, ValidationError } from '@/modules/users/services/userService'

interface Params {
  params: Promise<{ id: string }>
}

function parseId(id: string): number {
  const parsed = Number(id)
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new ValidationError('INVALID_DATA', 'ID de usuário inválido')
  }
  return parsed
}

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const user = userService.findById(parseId(id))
    return ok(user)
  } catch (error) {
    if (error instanceof ValidationError) return badRequest(error.code, error.message, error.details)
    if (error instanceof NotFoundError) return notFound(error.message, 'USER_NOT_FOUND')
    return serverError()
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await request.json()
    const user = userService.update(parseId(id), body)
    return ok(user)
  } catch (error) {
    if (error instanceof ValidationError) return badRequest(error.code, error.message, error.details)
    if (error instanceof NotFoundError) return notFound(error.message, 'USER_NOT_FOUND')
    return serverError()
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    userService.delete(parseId(id))
    return ok({ message: 'Usuário removido com sucesso' })
  } catch (error) {
    if (error instanceof ValidationError) return badRequest(error.code, error.message, error.details)
    if (error instanceof NotFoundError) return notFound(error.message, 'USER_NOT_FOUND')
    return serverError()
  }
}

import { NextRequest } from 'next/server'
import { ok, created, badRequest, serverError } from '@/lib/apiResponse'
import { userService, ValidationError } from '@/modules/users/services/userService'

export async function GET() {
  try {
    const users = userService.findAll()
    console.log('Fetched users:', users)
    return ok(users)
  } catch (error) {
    console.error('[GET /api/users]', error)
    return serverError()
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const user = userService.create(body)
    return created(user)
  } catch (error) {
    if (error instanceof ValidationError) {
      return badRequest(error.code, error.message, error.details)
    }
    console.error('[POST /api/users]', error)
    return serverError()
  }
}

'use client'

import { useCallback, useEffect, useState } from 'react'
import type { CreateUserDTO, UpdateUserDTO, User } from '../types/user'

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

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/users')
      console.log('Response status:', response)
      if (!response.ok) throw new Error('Erro ao carregar usuários')

      const data: User[] = await response.json()
      setUsers(data)
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível carregar os usuários.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchUsers()
  }, [fetchUsers])

  const createUser = async (data: CreateUserDTO): Promise<User> => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw await parseError(response)
    }

    return response.json()
  }

  const updateUser = async (id: number, data: UpdateUserDTO): Promise<User> => {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw await parseError(response)
    }

    return response.json()
  }

  const deleteUser = async (id: number): Promise<void> => {
    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const apiError = await parseError(response)
      throw new Error(apiError.message ?? 'Erro ao remover usuário')
    }

    await fetchUsers()
  }

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  }
}

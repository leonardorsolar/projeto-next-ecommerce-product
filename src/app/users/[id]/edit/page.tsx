'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { UserForm } from '@/modules/users/components/UserForm'
import { useUsers } from '@/modules/users/hooks/useUsers'
import type { CreateUserDTO, User } from '@/modules/users/types/user'

export default function EditUserPage() {
  const params = useParams<{ id: string }>()
  const { updateUser } = useUsers()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const userId = Number(params.id)

    if (!Number.isFinite(userId)) {
      setError('ID de usuário inválido.')
      setLoading(false)
      return
    }

    const loadUser = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/users/${userId}`)
        if (!response.ok) {
          setError('Usuário não encontrado.')
          return
        }

        const data: User = await response.json()
        setUser(data)
      } catch {
        setError('Erro ao carregar usuário.')
      } finally {
        setLoading(false)
      }
    }

    void loadUser()
  }, [params.id])

  if (loading) {
    return <p className="p-6 text-slate-500">Carregando...</p>
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>
  }

  if (!user) {
    return <p className="p-6 text-red-500">Usuário não encontrado.</p>
  }

  const handleUpdateUser = async (data: CreateUserDTO | Partial<CreateUserDTO>) => {
    await updateUser(user.id, data)
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Editar usuário</h1>
      <UserForm initialData={user} onSubmit={handleUpdateUser} />
    </main>
  )
}

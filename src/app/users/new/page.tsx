'use client'

import { UserForm } from '@/modules/users/components/UserForm'
import { useUsers } from '@/modules/users/hooks/useUsers'
import type { CreateUserDTO } from '@/modules/users/types/user'

export default function NewUserPage() {
  const { createUser } = useUsers()

  const handleCreateUser = async (data: CreateUserDTO | Partial<CreateUserDTO>) => {
    await createUser(data as CreateUserDTO)
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Novo usuário</h1>
      <UserForm onSubmit={handleCreateUser} />
    </main>
  )
}

'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { UserList } from '@/modules/users/components/UserList'
import { useUsers } from '@/modules/users/hooks/useUsers'

export default function UsersPage() {
  const { users, loading, error, deleteUser } = useUsers()

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Usuários</h1>
        <Link href="/users/new">
          <Button>+ Novo Usuário</Button>
        </Link>
      </header>

      {loading ? <p className="text-slate-500">Carregando usuários...</p> : null}
      {error ? <p className="text-red-500">{error}</p> : null}

      {!loading && !error ? <UserList users={users} onDelete={deleteUser} /> : null}
    </main>
  )
}

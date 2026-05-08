import { UserCard } from './UserCard'
import type { User } from '../types/user'

interface UserListProps {
  users: User[]
  onDelete: (id: number) => Promise<void>
}

export function UserList({ users, onDelete }: UserListProps) {
  if (users.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400">
        <p className="text-lg">Nenhum usuário cadastrado.</p>
        <p className="mt-1 text-sm">Clique em "+ Novo Usuário" para começar.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {users.map((user) => (
        <UserCard key={user.id} user={user} onDelete={onDelete} />
      ))}
    </div>
  )
}

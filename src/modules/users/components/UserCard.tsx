'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type { User } from '../types/user'

interface UserCardProps {
  user: User
  onDelete: (id: number) => Promise<void>
}

export function UserCard({ user, onDelete }: UserCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirmDelete = async () => {
    setDeleting(true)
    setError(null)

    try {
      await onDelete(user.id)
      setConfirmOpen(false)
    } catch {
      setError('Não foi possível excluir o usuário. Tente novamente.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <article className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base font-semibold text-slate-900">{user.name}</h3>
          <span
            className={`rounded-full px-2 py-1 text-xs font-semibold ${
              user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {user.role}
          </span>
        </div>

        <p className="text-sm text-slate-600">{user.email}</p>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div className="mt-1 flex flex-wrap gap-2">
          <Link href={`/users/${user.id}/edit`}>
            <Button type="button" variant="ghost">
              Editar
            </Button>
          </Link>

          <Button type="button" variant="danger" onClick={() => setConfirmOpen(true)}>
            Excluir
          </Button>
        </div>
      </article>

      <Modal
        open={confirmOpen}
        title="Confirmar exclusão"
        message={`Tem certeza que deseja excluir o usuário "${user.name}"?`}
        confirmText="Excluir"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  )
}

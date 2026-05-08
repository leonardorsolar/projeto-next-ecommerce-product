'use client'

import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { CreateUserDTO, User, UserRole } from '../types/user'

interface UserFormProps {
  initialData?: User
  onSubmit: (data: CreateUserDTO | Partial<CreateUserDTO>) => Promise<unknown>
}

interface ErrorPayload {
  code?: string
  message?: string
}

export function UserForm({ initialData, onSubmit }: UserFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    name: initialData?.name ?? '',
    email: initialData?.email ?? '',
    password: '',
    role: (initialData?.role ?? 'user') as UserRole,
  })

  const isEdit = Boolean(initialData)

  const handleChange =
    (field: 'name' | 'email' | 'password') =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
      setFieldErrors((prev) => ({ ...prev, [field]: '' }))
    }

  const handleRoleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, role: event.target.value as UserRole }))
    setFieldErrors((prev) => ({ ...prev, role: '' }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setGlobalError(null)
    setFieldErrors({})

    const payload: CreateUserDTO | Partial<CreateUserDTO> = {
      name: form.name,
      email: form.email,
      role: form.role,
      ...(form.password ? { password: form.password } : {}),
    }

    if (!isEdit) {
      payload.password = form.password
    }

    try {
      await onSubmit(payload)
      router.push('/users')
    } catch (error) {
      const payloadError = error as ErrorPayload

      if (payloadError?.code === 'INVALID_DATA') {
        if (payloadError.message?.toLowerCase().includes('nome')) {
          setFieldErrors({ name: payloadError.message })
        } else if (payloadError.message?.toLowerCase().includes('email')) {
          setFieldErrors({ email: payloadError.message })
        } else if (payloadError.message?.toLowerCase().includes('senha')) {
          setFieldErrors({ password: payloadError.message })
        } else {
          setGlobalError(payloadError.message ?? 'Dados inválidos')
        }
      } else if (payloadError?.code === 'INVALID_EMAIL') {
        setFieldErrors({ email: payloadError.message ?? 'Email inválido' })
      } else if (payloadError?.code === 'EMAIL_ALREADY_EXISTS') {
        setFieldErrors({ email: payloadError.message ?? 'Email já cadastrado' })
      } else if (payloadError?.code === 'INVALID_ROLE') {
        setFieldErrors({ role: payloadError.message ?? 'Role inválida' })
      } else {
        setGlobalError('Erro inesperado. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-4">
      {globalError ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {globalError}
        </div>
      ) : null}

      <Input
        label="Nome *"
        value={form.name}
        onChange={handleChange('name')}
        error={fieldErrors.name}
        required
      />

      <Input
        label="Email *"
        type="email"
        value={form.email}
        onChange={handleChange('email')}
        error={fieldErrors.email}
        required
      />

      <Input
        label={isEdit ? 'Nova senha (opcional)' : 'Senha *'}
        type="password"
        value={form.password}
        onChange={handleChange('password')}
        error={fieldErrors.password}
        required={!isEdit}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700">Role *</label>
        <select
          value={form.role}
          onChange={handleRoleChange}
          className={`rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            fieldErrors.role ? 'border-red-500' : 'border-slate-300'
          }`}
          required
        >
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
        {fieldErrors.role ? <span className="text-xs text-red-500">{fieldErrors.role}</span> : null}
      </div>

      <div className="mt-2 flex gap-3">
        <Button type="submit" loading={loading}>
          {isEdit ? 'Salvar alterações' : 'Cadastrar usuário'}
        </Button>

        <Button type="button" variant="ghost" onClick={() => router.push('/users')}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}

import { userRepository } from '../repository/userRepository'
import type { CreateUserDTO, UpdateUserDTO, User, UserRole } from '../types/user'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export class ValidationError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: string,
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends Error {
  constructor(id: number) {
    super(`Usuário com ID ${id} não encontrado`)
    this.name = 'NotFoundError'
  }
}

function validateRole(role: string): role is UserRole {
  return role === 'admin' || role === 'user'
}

export const userService = {
  findAll(): User[] {
    return userRepository.findAll()
  },

  findById(id: number): User {
    const user = userRepository.findById(id)
    if (!user) throw new NotFoundError(id)
    return user
  },

  create(data: CreateUserDTO): User {
    if (!data.name || data.name.trim() === '') {
      throw new ValidationError('INVALID_DATA', 'Nome é obrigatório', 'O campo name não pode ser vazio')
    }

    if (!data.email || data.email.trim() === '') {
      throw new ValidationError('INVALID_DATA', 'Email é obrigatório', 'O campo email não pode ser vazio')
    }

    const normalizedEmail = data.email.trim().toLowerCase()
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      throw new ValidationError('INVALID_EMAIL', 'Email inválido')
    }

    if (!data.password || data.password.trim() === '') {
      throw new ValidationError('INVALID_DATA', 'Senha é obrigatória', 'O campo password não pode ser vazio')
    }

    if (!validateRole(data.role)) {
      throw new ValidationError('INVALID_ROLE', 'Role inválida. Use admin ou user')
    }

    if (userRepository.emailExists(normalizedEmail)) {
      throw new ValidationError('EMAIL_ALREADY_EXISTS', 'Já existe um usuário com este email')
    }

    return userRepository.create({
      ...data,
      name: data.name.trim(),
      email: normalizedEmail,
      password: data.password.trim(),
      role: data.role,
    })
  },

  update(id: number, data: UpdateUserDTO): User {
    if (data.name !== undefined && data.name.trim() === '') {
      throw new ValidationError('INVALID_DATA', 'Nome não pode ser vazio')
    }

    if (data.email !== undefined) {
      if (data.email.trim() === '') {
        throw new ValidationError('INVALID_DATA', 'Email não pode ser vazio')
      }

      const normalizedEmail = data.email.trim().toLowerCase()
      if (!EMAIL_REGEX.test(normalizedEmail)) {
        throw new ValidationError('INVALID_EMAIL', 'Email inválido')
      }

      if (userRepository.emailExists(normalizedEmail, id)) {
        throw new ValidationError('EMAIL_ALREADY_EXISTS', 'Já existe um usuário com este email')
      }

      data.email = normalizedEmail
    }

    if (data.password !== undefined && data.password.trim() === '') {
      throw new ValidationError('INVALID_DATA', 'Senha não pode ser vazia')
    }

    if (data.password !== undefined) {
      data.password = data.password.trim()
    }

    if (data.role !== undefined && !validateRole(data.role)) {
      throw new ValidationError('INVALID_ROLE', 'Role inválida. Use admin ou user')
    }

    const updated = userRepository.update(id, {
      ...data,
      name: data.name?.trim(),
    })

    if (!updated) throw new NotFoundError(id)
    return updated
  },

  delete(id: number): void {
    const deleted = userRepository.softDelete(id)
    if (!deleted) throw new NotFoundError(id)
  },
}

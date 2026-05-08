import { getDb } from '@/lib/db'
import type { CreateUserDTO, UpdateUserDTO, User } from '../types/user'

interface UserRow {
  id: number
  name: string
  email: string
  password: string
  role: 'admin' | 'user'
  deleted: 0 | 1
  created_at: string
}

function mapRow(row: Pick<UserRow, 'id' | 'name' | 'email' | 'role' | 'created_at'>): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    createdAt: row.created_at,
  }
}

export const userRepository = {
  findAll(): User[] {
    const db = getDb()
    const rows = db
      .prepare(
        `
          SELECT id, name, email, role, created_at
          FROM users
          WHERE deleted = 0
          ORDER BY created_at DESC
        `,
      )
      .all() as Array<Pick<UserRow, 'id' | 'name' | 'email' | 'role' | 'created_at'>>

    return rows.map(mapRow)
  },

  findById(id: number): User | null {
    const db = getDb()
    const row = db
      .prepare(
        `
          SELECT id, name, email, role, created_at
          FROM users
          WHERE id = ? AND deleted = 0
        `,
      )
      .get(id) as Pick<UserRow, 'id' | 'name' | 'email' | 'role' | 'created_at'> | undefined

    return row ? mapRow(row) : null
  },

  emailExists(email: string, excludeId?: number): boolean {
    const db = getDb()

    if (excludeId !== undefined) {
      const row = db
        .prepare('SELECT id FROM users WHERE lower(email) = lower(?) AND id != ?')
        .get(email, excludeId) as { id: number } | undefined
      return Boolean(row)
    }

    const row = db
      .prepare('SELECT id FROM users WHERE lower(email) = lower(?)')
      .get(email) as { id: number } | undefined

    return Boolean(row)
  },

  create(data: CreateUserDTO): User {
    const db = getDb()
    const stmt = db.prepare(
      `
        INSERT INTO users (name, email, password, role)
        VALUES (@name, @email, @password, @role)
      `,
    )

    const result = stmt.run({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    })

    return userRepository.findById(result.lastInsertRowid as number)!
  },

  update(id: number, data: UpdateUserDTO): User | null {
    const db = getDb()
    const current = db
      .prepare('SELECT * FROM users WHERE id = ? AND deleted = 0')
      .get(id) as UserRow | undefined

    if (!current) return null

    db.prepare(
      `
        UPDATE users
        SET
          name     = @name,
          email    = @email,
          password = @password,
          role     = @role
        WHERE id = @id
      `,
    ).run({
      id,
      name: data.name ?? current.name,
      email: data.email ?? current.email,
      password: data.password ?? current.password,
      role: data.role ?? current.role,
    })

    return userRepository.findById(id)
  },

  softDelete(id: number): boolean {
    const db = getDb()
    const result = db.prepare('UPDATE users SET deleted = 1 WHERE id = ? AND deleted = 0').run(id)
    return result.changes > 0
  },
}

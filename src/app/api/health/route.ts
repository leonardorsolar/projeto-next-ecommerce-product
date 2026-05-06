import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  try {
    const db = getDb()
    db.prepare('SELECT 1').get()

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Health Check] Falha na conexão com o banco:', error)

    return NextResponse.json(
      { status: 'error', database: 'disconnected' },
      { status: 500 },
    )
  }
}

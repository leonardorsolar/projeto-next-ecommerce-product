import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sistema de Gestão de Produtos',
  description: 'Projeto de e-commerce com Next.js e SQLite',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="border-b border-slate-200 bg-white">
          <nav className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <Link href="/" className="text-sm font-semibold text-slate-900 hover:text-blue-700">
              Início
            </Link>
            <Link href="/products" className="text-sm font-medium text-slate-700 hover:text-blue-700">
              Produtos
            </Link>
            <Link href="/users" className="text-sm font-medium text-slate-700 hover:text-blue-700">
              Usuários
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  )
}

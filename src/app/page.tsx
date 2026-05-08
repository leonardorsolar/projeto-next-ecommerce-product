import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6 py-12">
      <div className="space-y-3">
        <span className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-sm font-medium text-white">
          Sprint 1 concluível
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Sistema de Gestão de Produtos para E-commerce
        </h1>
        <p className="text-lg text-slate-600">
          Base do projeto criada com Next.js, Tailwind CSS e SQLite.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/products"
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
        >
          Ir para produtos
        </Link>
        <Link
          href="/users"
          className="rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition hover:bg-purple-700"
        >
          Ir para usuários
        </Link>
        <Link
          href="/api/health"
          className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white transition hover:bg-slate-700"
        >
          Testar health check
        </Link>
      </div>
    </main>
  )
}

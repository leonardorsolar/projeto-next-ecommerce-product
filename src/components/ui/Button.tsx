import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'ghost'
  loading?: boolean
}

export function Button({
  variant = 'primary',
  loading = false,
  children,
  className,
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50'

  const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className ?? ''}`.trim()}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? 'Aguarde...' : children}
    </button>
  )
}

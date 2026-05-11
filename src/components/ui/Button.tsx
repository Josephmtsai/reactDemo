import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant of the button. */
  variant: ButtonVariant
  children: React.ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-blue-600',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus-visible:outline-gray-400',
}

/**
 * Reusable button with primary and secondary variants.
 */
export default function Button({ variant, children, className = '', ...props }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50'

  return (
    <button className={`${base} ${variantClasses[variant]} ${className}`.trim()} {...props}>
      {children}
    </button>
  )
}

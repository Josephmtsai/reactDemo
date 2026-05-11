import type { ToastItem } from '@/hooks/useToast'

interface ToastProps {
  toast: ToastItem
  onRemove: (id: string) => void
}

const colorMap: Record<ToastItem['type'], string> = {
  success: 'bg-green-600 text-white',
  info: 'bg-blue-600 text-white',
  error: 'bg-red-600 text-white',
}

/**
 * Renders a single toast notification with message and close button.
 */
export default function Toast({ toast, onRemove }: ToastProps) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[220px] max-w-sm ${colorMap[toast.type]}`}
      role="alert"
    >
      <span className="flex-1 text-sm font-medium">{toast.message}</span>
      <button
        type="button"
        onClick={() => onRemove(toast.id)}
        className="shrink-0 p-1 rounded hover:bg-white/20 transition-colors"
        aria-label="關閉通知"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  )
}

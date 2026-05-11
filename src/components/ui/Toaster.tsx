import { useToast } from '@/hooks/useToast'
import Toast from './Toast'

/**
 * Fixed top-right toast container that renders all active toast notifications.
 */
export default function Toaster() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>
  )
}

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { COLUMNS, STATUS_LABELS } from '@/constants/kanban'
import type { Card, ColumnStatus } from '@/types/kanban'

interface EditCardModalProps {
  card: Card
  onSave: (updated: Card) => void
  onClose: () => void
}

/**
 * Modal dialog for editing a Kanban card's title, description, and status.
 */
export default function EditCardModal({ card, onSave, onClose }: EditCardModalProps) {
  const [title, setTitle] = useState(card.title)
  const [description, setDescription] = useState(card.description)
  const [status, setStatus] = useState<ColumnStatus>(card.status)
  const [titleError, setTitleError] = useState('')

  const handleSave = () => {
    if (!title.trim()) {
      setTitleError('標題為必填欄位')
      return
    }
    onSave({ ...card, title: title.trim(), description: description.trim(), status })
  }

  const inputBase =
    'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-800 text-base">編輯卡片</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="關閉"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              標題 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setTitleError('')
              }}
              className={`${inputBase} ${titleError ? 'border-red-400 focus:ring-red-400' : ''}`}
            />
            {titleError && <p className="text-red-500 text-xs mt-1">{titleError}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">描述</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputBase} resize-none`}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">狀態</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ColumnStatus)}
              className={inputBase}
            >
              {COLUMNS.map((col) => (
                <option key={col.id} value={col.status}>
                  {STATUS_LABELS[col.status]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <Button variant="secondary" onClick={onClose} type="button">
            取消
          </Button>
          <Button variant="primary" onClick={handleSave} type="button">
            儲存
          </Button>
        </div>
      </div>
    </div>
  )
}

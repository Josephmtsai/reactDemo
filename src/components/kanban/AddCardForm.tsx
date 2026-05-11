import { useState } from 'react'
import Button from '@/components/ui/Button'

interface AddCardFormProps {
  onAdd: (title: string, description: string) => void
}

interface FormErrors {
  title?: string
  description?: string
}

/**
 * Form for adding a new Kanban card with title and description validation.
 */
export default function AddCardForm({ onAdd }: AddCardFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: FormErrors = {}
    if (!title.trim()) newErrors.title = '標題為必填欄位'
    if (!description.trim()) newErrors.description = '描述為必填欄位'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onAdd(title.trim(), description.trim())
    setTitle('')
    setDescription('')
    setErrors({})
  }

  const inputBase =
    'w-full rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors'
  const inputNormal = 'border-slate-200 focus:ring-blue-400'
  const inputError = 'border-red-400 focus:ring-red-400'

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"
    >
      <p className="font-semibold text-slate-700 text-sm mb-3">新增卡片</p>
      <div className="flex flex-col gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            標題 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="輸入卡片標題..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }))
            }}
            className={`${inputBase} ${errors.title ? inputError : inputNormal}`}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            描述 <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="輸入卡片描述..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }))
            }}
            className={`${inputBase} ${errors.description ? inputError : inputNormal} resize-none`}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>
        <div className="flex justify-end">
          <Button variant="primary" type="submit">
            新增
          </Button>
        </div>
      </div>
    </form>
  )
}

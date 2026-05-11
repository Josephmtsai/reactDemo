import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { Card } from '@/types/kanban'

interface KanbanCardProps {
  card: Card
  onEdit: (card: Card) => void
  onDelete: (id: string) => void
  isDragOverlay?: boolean
}

/**
 * Renders a single draggable Kanban card with title, description, and hover action buttons.
 */
export default function KanbanCard({
  card,
  onEdit,
  onDelete,
  isDragOverlay = false,
}: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
    data: { card },
  })

  const style = isDragging ? {} : { transform: CSS.Transform.toString(transform) }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => {
        if (!isDragOverlay) onEdit(card)
      }}
      className={`group relative bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-2
        hover:shadow-md transition-shadow duration-200 cursor-pointer select-none
        ${isDragging ? 'opacity-40' : 'opacity-100'}`}
    >
      {!isDragOverlay && (
        <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(card)
            }}
            className="p-1 rounded text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
            aria-label="編輯"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              if (window.confirm('確定要刪除此卡片？')) onDelete(card.id)
            }}
            className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            aria-label="刪除"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}
      <p className="font-semibold text-gray-800 text-sm leading-snug">{card.title}</p>
      <p className="text-xs text-gray-400 line-clamp-3">{card.description}</p>
    </div>
  )
}

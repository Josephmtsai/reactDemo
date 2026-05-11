import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { Card } from '@/types/kanban'

interface KanbanCardProps {
  card: Card
  onEdit: (card: Card) => void
  isDragOverlay?: boolean
}

/**
 * Renders a single draggable Kanban card with title and description.
 */
export default function KanbanCard({ card, onEdit, isDragOverlay = false }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
    data: { card },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => {
        if (!isDragOverlay) onEdit(card)
      }}
      className={`bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-2
        hover:shadow-md transition-shadow duration-200 cursor-pointer select-none
        ${isDragging ? 'opacity-40' : 'opacity-100'}`}
    >
      <p className="font-semibold text-gray-800 text-sm leading-snug">{card.title}</p>
      <p className="text-xs text-gray-400 line-clamp-3">{card.description}</p>
    </div>
  )
}

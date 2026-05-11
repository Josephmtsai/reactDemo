import { useDroppable } from '@dnd-kit/core'
import type { ColumnDef, Card } from '@/types/kanban'
import KanbanCard from './KanbanCard'

interface KanbanColumnProps {
  column: ColumnDef
  cards: Card[]
  onEdit: (card: Card) => void
  onDelete: (id: string) => void
}

const colorMap: Record<ColumnDef['color'], { header: string; badge: string }> = {
  blue: { header: 'bg-blue-500 text-white', badge: 'bg-white/20 text-white' },
  yellow: { header: 'bg-yellow-500 text-white', badge: 'bg-white/20 text-white' },
  purple: { header: 'bg-purple-500 text-white', badge: 'bg-white/20 text-white' },
  green: { header: 'bg-green-500 text-white', badge: 'bg-white/20 text-white' },
}

/**
 * Renders a single droppable Kanban column with a colored header and scrollable card list.
 */
export default function KanbanColumn({ column, cards, onEdit, onDelete }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.status })
  const colors = colorMap[column.color]

  return (
    <div
      className={`flex flex-col rounded-xl bg-slate-100/80 shadow-sm border border-slate-200
        transition-transform duration-200 ${isOver ? '-translate-y-2' : ''}`}
    >
      <div className={`flex items-center justify-between px-4 py-3 rounded-t-xl ${colors.header}`}>
        <span className="font-bold text-sm tracking-wide flex items-center gap-1.5">
          <span>{column.icon}</span>
          {column.title}
        </span>
        <span
          className={`min-w-[1.5rem] h-6 flex items-center justify-center text-xs font-bold rounded-full px-2 ${colors.badge}`}
        >
          {cards.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 p-3 flex-1 overflow-x-hidden overflow-y-auto max-h-[60vh] md:max-h-[calc(100vh-380px)] min-h-[200px] transition-colors
          ${isOver ? 'ring-2 ring-blue-400 bg-blue-50/30' : ''}`}
      >
        {cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 opacity-40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="text-sm">無符合結果</p>
          </div>
        ) : (
          cards.map((card) => (
            <KanbanCard key={card.id} card={card} onEdit={onEdit} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  )
}

import type { ColumnDef, Card } from '@/types/kanban'
import KanbanColumn from './KanbanColumn'

interface KanbanBoardProps {
  columns: ColumnDef[]
  cards: Card[]
  onEdit: (card: Card) => void
}

/**
 * Renders the four-column Kanban board grid.
 */
export default function KanbanBoard({ columns, cards, onEdit }: KanbanBoardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {columns.map((col) => (
        <KanbanColumn
          key={col.id}
          column={col}
          cards={cards.filter((c) => c.status === col.status)}
          onEdit={onEdit}
        />
      ))}
    </div>
  )
}

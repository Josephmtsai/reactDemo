import type { Column, Card } from '@/types/kanban'
import KanbanColumn from './KanbanColumn'

interface KanbanBoardProps {
  columns: Column[]
  searchQuery: string
}

function filterCards(cards: Card[], query: string): Card[] {
  if (query.trim() === '') return cards
  const lower = query.toLowerCase()
  return cards.filter(
    (card) =>
      card.title.toLowerCase().includes(lower) ||
      card.description.toLowerCase().includes(lower) ||
      card.tags.some((tag) => tag.toLowerCase().includes(lower))
  )
}

/**
 * Renders the four-column Kanban board grid with client-side filtering.
 */
export default function KanbanBoard({ columns, searchQuery }: KanbanBoardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          column={column}
          filteredCards={filterCards(column.cards, searchQuery)}
        />
      ))}
    </div>
  )
}

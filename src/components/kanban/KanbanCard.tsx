import type { Card, Priority } from '@/types/kanban'

interface KanbanCardProps {
  card: Card
}

const priorityBorderMap: Record<Priority, string> = {
  high: 'border-l-4 border-red-500',
  medium: 'border-l-4 border-yellow-400',
  low: 'border-l-4 border-gray-300',
}

const assigneeColorClasses = [
  'bg-indigo-100 text-indigo-700',
  'bg-pink-100 text-pink-700',
  'bg-teal-100 text-teal-700',
  'bg-orange-100 text-orange-700',
  'bg-violet-100 text-violet-700',
]

/**
 * Renders a single Kanban card with priority border, title, description, tags, assignee avatar, and due date.
 */
export default function KanbanCard({ card }: KanbanCardProps) {
  const colorIndex = (card.assignee.charCodeAt(0) || 0) % 5
  const avatarClass = assigneeColorClasses[colorIndex]

  return (
    <div className={`${priorityBorderMap[card.priority]} rounded-xl overflow-hidden`}>
      <div className="bg-white border border-gray-100 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200 cursor-pointer">
        <p className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2">
          {card.title}
        </p>
        <p className="text-xs text-gray-400 line-clamp-2">{card.description}</p>
        {card.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {card.tags.map((tag) => (
              <span
                key={tag}
                className="bg-slate-100 text-slate-600 text-xs rounded-md px-2 py-0.5 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {card.dueDate}
          </span>
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${avatarClass}`}
          >
            {card.assignee.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  )
}

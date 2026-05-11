export type Priority = 'high' | 'medium' | 'low'

export type ColumnStatus = 'todo' | 'in-progress' | 'in-review' | 'done'

export interface Card {
  id: string
  title: string
  description: string
  tags: string[]
  assignee: string
  priority: Priority
  dueDate: string
}

export interface Column {
  id: string
  title: string
  status: ColumnStatus
  color: 'blue' | 'yellow' | 'purple' | 'green'
  cards: Card[]
}

export interface KanbanData {
  columns: Column[]
}

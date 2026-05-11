export type ColumnStatus = 'todo' | 'in-progress' | 'in-review' | 'done'

export interface Card {
  id: string
  title: string
  description: string
  status: ColumnStatus
}

export interface ColumnDef {
  id: string
  status: ColumnStatus
  title: string
  color: 'blue' | 'yellow' | 'purple' | 'green'
  icon: string
}

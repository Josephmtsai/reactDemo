import type { ColumnDef, ColumnStatus } from '@/types/kanban'

export const COLUMNS: ColumnDef[] = [
  { id: 'col-todo', status: 'todo', title: '待處理', color: 'blue', icon: '📋' },
  { id: 'col-in-progress', status: 'in-progress', title: '進行中', color: 'yellow', icon: '⚡' },
  { id: 'col-in-review', status: 'in-review', title: '待驗收', color: 'purple', icon: '🔍' },
  { id: 'col-done', status: 'done', title: '已完成', color: 'green', icon: '✅' },
]

export const STATUS_LABELS: Record<ColumnStatus, string> = {
  todo: '待處理',
  'in-progress': '進行中',
  'in-review': '待驗收',
  done: '已完成',
}

export const STATUS_ICONS: Record<ColumnStatus, string> = {
  todo: '📋',
  'in-progress': '⚡',
  'in-review': '🔍',
  done: '✅',
}

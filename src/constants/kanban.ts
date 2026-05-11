import type { ColumnDef, ColumnStatus } from '@/types/kanban'

export const COLUMNS: ColumnDef[] = [
  { id: 'col-todo', status: 'todo', title: '待處理', color: 'blue' },
  { id: 'col-in-progress', status: 'in-progress', title: '進行中', color: 'yellow' },
  { id: 'col-in-review', status: 'in-review', title: '待驗收', color: 'purple' },
  { id: 'col-done', status: 'done', title: '已完成', color: 'green' },
]

export const STATUS_LABELS: Record<ColumnStatus, string> = {
  todo: '待處理',
  'in-progress': '進行中',
  'in-review': '待驗收',
  done: '已完成',
}

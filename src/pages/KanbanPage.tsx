import { useState } from 'react'
import type { KanbanData } from '@/types/kanban'
import kanbanJson from '@/data/kanban.json'
import SearchBar from '@/components/kanban/SearchBar'
import KanbanBoard from '@/components/kanban/KanbanBoard'

const kanbanData = kanbanJson as KanbanData

/**
 * Top-level Kanban page — manages searchQuery state and renders the board.
 */
export default function KanbanPage() {
  const [searchQuery, setSearchQuery] = useState<string>('')

  const handleAdd = () => {
    alert('新增卡片功能開發中')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-6">
      <div className="max-w-screen-2xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-1 pb-4 border-b border-slate-200">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            📋 Kanban 看板管理系統
          </h1>
          <p className="text-sm text-slate-500">拖曳卡片，輕鬆管理你的任務進度</p>
        </div>
        <SearchBar value={searchQuery} onChange={setSearchQuery} onAdd={handleAdd} />
        <KanbanBoard columns={kanbanData.columns} searchQuery={searchQuery} />
      </div>
    </main>
  )
}

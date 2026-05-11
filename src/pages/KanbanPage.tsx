import { useState } from 'react'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import type { Card, ColumnStatus } from '@/types/kanban'
import { COLUMNS } from '@/constants/kanban'
import initialCardsJson from '@/data/kanban.json'
import AddCardForm from '@/components/kanban/AddCardForm'
import KanbanBoard from '@/components/kanban/KanbanBoard'
import KanbanCard from '@/components/kanban/KanbanCard'
import EditCardModal from '@/components/kanban/EditCardModal'

const initialCards = initialCardsJson as Card[]

/**
 * Top-level Kanban page — manages all card state and drag-and-drop logic.
 */
export default function KanbanPage() {
  const [cards, setCards] = useState<Card[]>(initialCards)
  const [editingCard, setEditingCard] = useState<Card | null>(null)
  const [activeCard, setActiveCard] = useState<Card | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const addCard = (title: string, description: string) => {
    const newCard: Card = {
      id: `card-${Date.now()}`,
      title,
      description,
      status: 'todo' as ColumnStatus,
    }
    setCards((prev) => [newCard, ...prev])
  }

  const updateCard = (updated: Card) => {
    setCards((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
  }

  const handleDragStart = (event: DragStartEvent) => {
    const found = cards.find((c) => c.id === event.active.id)
    setActiveCard(found ?? null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveCard(null)
    if (!over) return
    const cardId = active.id as string
    const newStatus = over.id as ColumnStatus
    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, status: newStatus } : c)))
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-6">
      <div className="max-w-screen-2xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-1 pb-4 border-b border-slate-200">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            📋 Kanban 看板管理系統
          </h1>
          <p className="text-sm text-slate-500">管理你的待辦事項，拖拉卡片更新狀態</p>
        </div>
        <AddCardForm onAdd={addCard} />
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <KanbanBoard columns={COLUMNS} cards={cards} onEdit={setEditingCard} />
          <DragOverlay>
            {activeCard ? (
              <KanbanCard card={activeCard} onEdit={() => undefined} isDragOverlay />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
      {editingCard && (
        <EditCardModal
          card={editingCard}
          onSave={(updated) => {
            updateCard(updated)
            setEditingCard(null)
          }}
          onClose={() => setEditingCard(null)}
        />
      )}
    </main>
  )
}

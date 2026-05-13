import { useState } from 'react'
import { DndContext, DragOverlay, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import type { Card, ColumnStatus } from '@/types/kanban'
import { COLUMNS, STATUS_LABELS } from '@/constants/kanban'
import { useToast } from '@/hooks/useToast'
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
  const { addToast } = useToast()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
  )

  const addCard = (title: string, description: string) => {
    const newCard: Card = {
      id: `card-${Date.now()}`,
      title,
      description,
      status: 'todo' as ColumnStatus,
    }
    setCards((prev) => [newCard, ...prev])
    addToast({ message: '卡片已新增', type: 'success' })
  }

  const updateCard = (updated: Card) => {
    setCards((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
    addToast({ message: '卡片已更新', type: 'success' })
  }

  const deleteCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id))
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
    const currentCard = cards.find((c) => c.id === cardId)
    if (currentCard?.status === newStatus) return
    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, status: newStatus } : c)))
    const message =
      newStatus === 'done' ? '🎉 太棒了，已完成！' : `已移至「${STATUS_LABELS[newStatus]}」`
    addToast({ message, type: newStatus === 'done' ? 'success' : 'info' })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-4 md:p-6 overflow-x-hidden">
      <div className="max-w-screen-2xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-1 pb-4 border-b border-slate-200">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            📋 Kanban 看板管理系統
          </h1>
          <p className="text-sm text-slate-500">管理你的待辦事項，拖拉卡片更新狀態</p>
        </div>
        <AddCardForm onAdd={addCard} />
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <KanbanBoard
            columns={COLUMNS}
            cards={cards}
            onEdit={setEditingCard}
            onDelete={deleteCard}
          />
          <DragOverlay>
            {activeCard ? (
              <div className="rotate-[5deg] scale-105 shadow-2xl cursor-grabbing">
                <KanbanCard
                  card={activeCard}
                  onEdit={() => undefined}
                  onDelete={() => undefined}
                  isDragOverlay
                />
              </div>
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

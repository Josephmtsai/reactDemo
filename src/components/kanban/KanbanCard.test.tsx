import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import KanbanCard from './KanbanCard'
import type { Card } from '@/types/kanban'

// @dnd-kit 在 jsdom 環境中需要 mock
vi.mock('@dnd-kit/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@dnd-kit/core')>()
  return {
    ...actual,
    useDraggable: () => ({
      attributes: {},
      listeners: {},
      setNodeRef: () => undefined,
      transform: null,
      isDragging: false,
    }),
  }
})

const mockCard: Card = {
  id: 'test-01',
  title: '測試卡片標題',
  description: '測試卡片描述',
  status: 'todo',
}

describe('KanbanCard', () => {
  it('renders title and description', () => {
    const onEdit = vi.fn()
    render(<KanbanCard card={mockCard} onEdit={onEdit} />)
    expect(screen.getByText('測試卡片標題')).toBeInTheDocument()
    expect(screen.getByText('測試卡片描述')).toBeInTheDocument()
  })

  it('calls onEdit with card when clicked', () => {
    const onEdit = vi.fn()
    render(<KanbanCard card={mockCard} onEdit={onEdit} />)
    fireEvent.click(screen.getByText('測試卡片標題').closest('div')!)
    expect(onEdit).toHaveBeenCalledWith(mockCard)
  })

  it('does not call onEdit when isDragOverlay is true', () => {
    const onEdit = vi.fn()
    render(<KanbanCard card={mockCard} onEdit={onEdit} isDragOverlay />)
    fireEvent.click(screen.getByText('測試卡片標題').closest('div')!)
    expect(onEdit).not.toHaveBeenCalled()
  })
})

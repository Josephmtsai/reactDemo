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
    const mockOnDelete = vi.fn()
    render(<KanbanCard card={mockCard} onEdit={onEdit} onDelete={mockOnDelete} />)
    expect(screen.getByText('測試卡片標題')).toBeInTheDocument()
    expect(screen.getByText('測試卡片描述')).toBeInTheDocument()
  })

  it('calls onEdit with card when clicked', () => {
    const onEdit = vi.fn()
    const mockOnDelete = vi.fn()
    render(<KanbanCard card={mockCard} onEdit={onEdit} onDelete={mockOnDelete} />)
    fireEvent.click(screen.getByText('測試卡片標題').closest('div')!)
    expect(onEdit).toHaveBeenCalledWith(mockCard)
  })

  it('does not call onEdit when isDragOverlay is true', () => {
    const onEdit = vi.fn()
    const mockOnDelete = vi.fn()
    render(<KanbanCard card={mockCard} onEdit={onEdit} onDelete={mockOnDelete} isDragOverlay />)
    fireEvent.click(screen.getByText('測試卡片標題').closest('div')!)
    expect(onEdit).not.toHaveBeenCalled()
  })

  it('calls onDelete with card id when delete button clicked after confirm', () => {
    const onEdit = vi.fn()
    const mockOnDelete = vi.fn()
    window.confirm = vi.fn().mockReturnValue(true)
    render(<KanbanCard card={mockCard} onEdit={onEdit} onDelete={mockOnDelete} />)
    fireEvent.click(screen.getByLabelText('刪除'))
    expect(mockOnDelete).toHaveBeenCalledWith('test-01')
  })

  it('does not call onDelete when delete button clicked but confirm cancelled', () => {
    const onEdit = vi.fn()
    const mockOnDelete = vi.fn()
    window.confirm = vi.fn().mockReturnValue(false)
    render(<KanbanCard card={mockCard} onEdit={onEdit} onDelete={mockOnDelete} />)
    fireEvent.click(screen.getByLabelText('刪除'))
    expect(mockOnDelete).not.toHaveBeenCalled()
  })

  it('pencil button calls onEdit exactly once and does not bubble to outer div', () => {
    const onEdit = vi.fn()
    const mockOnDelete = vi.fn()
    render(<KanbanCard card={mockCard} onEdit={onEdit} onDelete={mockOnDelete} />)
    fireEvent.click(screen.getByLabelText('編輯'))
    expect(onEdit).toHaveBeenCalledTimes(1)
    expect(onEdit).toHaveBeenCalledWith(mockCard)
  })

  it('does not render icon buttons when isDragOverlay is true', () => {
    const onEdit = vi.fn()
    const mockOnDelete = vi.fn()
    render(<KanbanCard card={mockCard} onEdit={onEdit} onDelete={mockOnDelete} isDragOverlay />)
    expect(screen.queryByLabelText('編輯')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('刪除')).not.toBeInTheDocument()
  })
})

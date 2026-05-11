import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import KanbanCard from './KanbanCard'
import type { Card } from '@/types/kanban'

const mockCard: Card = {
  id: 'test-01',
  title: '測試卡片',
  description: '測試描述',
  tags: ['標籤A', '標籤B'],
  assignee: 'Alice',
  priority: 'high',
  dueDate: '2026-05-15',
}

describe('KanbanCard', () => {
  it('renders title, description, assignee initial and dueDate', () => {
    render(<KanbanCard card={mockCard} />)
    expect(screen.getByText('測試卡片')).toBeInTheDocument()
    expect(screen.getByText('測試描述')).toBeInTheDocument()
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('2026-05-15')).toBeInTheDocument()
  })

  it('applies red left border for high priority', () => {
    const { container } = render(<KanbanCard card={{ ...mockCard, priority: 'high' }} />)
    expect(container.firstChild).toHaveClass('border-red-500')
  })

  it('applies yellow left border for medium priority', () => {
    const { container } = render(<KanbanCard card={{ ...mockCard, priority: 'medium' }} />)
    expect(container.firstChild).toHaveClass('border-yellow-400')
  })

  it('applies gray left border for low priority', () => {
    const { container } = render(<KanbanCard card={{ ...mockCard, priority: 'low' }} />)
    expect(container.firstChild).toHaveClass('border-gray-300')
  })

  it('does not render tag elements when tags is empty', () => {
    const { container } = render(<KanbanCard card={{ ...mockCard, tags: [] }} />)
    expect(container.querySelectorAll('.rounded-md.bg-slate-100').length).toBe(0)
  })

  it('renders all tags when tags has values', () => {
    render(<KanbanCard card={mockCard} />)
    expect(screen.getByText('標籤A')).toBeInTheDocument()
    expect(screen.getByText('標籤B')).toBeInTheDocument()
  })
})

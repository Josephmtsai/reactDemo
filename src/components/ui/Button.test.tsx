import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Button from './Button'

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button variant="primary">Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('is disabled when disabled prop is passed', () => {
    render(
      <Button variant="secondary" disabled>
        Disabled
      </Button>
    )
    expect(screen.getByRole('button', { name: /disabled/i })).toBeDisabled()
  })

  it('calls onClick callback when clicked', async () => {
    const handleClick = vi.fn()
    render(
      <Button variant="primary" onClick={handleClick}>
        Submit
      </Button>
    )
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})

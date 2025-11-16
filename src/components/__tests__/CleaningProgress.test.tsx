import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CleaningProgress from '../CleaningProgress'

describe('CleaningProgress', () => {
  const mockOnCancel = vi.fn()

  const defaultProps = {
    isVisible: true,
    currentTask: 'Cleaning Metro Cache...',
    totalTasks: 12,
    completedTasks: 5,
    totalSpaceCleaned: 1500000000, // 1.5 GB
    totalSpaceToClean: 3000000000, // 3 GB
    speedMBps: 15.5,
    etaSeconds: 45,
    errors: 0,
    onCancel: mockOnCancel,
  }

  beforeEach(() => {
    mockOnCancel.mockClear()
  })

  it('does not render when not visible', () => {
    render(<CleaningProgress {...defaultProps} isVisible={false} />)
    expect(screen.queryByText('Limpeza em Progresso')).not.toBeInTheDocument()
  })

  it('renders progress header with task counts', () => {
    render(<CleaningProgress {...defaultProps} />)
    expect(screen.getByText('Limpeza em Progresso')).toBeInTheDocument()
    expect(screen.getByText('5 de 12 categorias')).toBeInTheDocument()
  })

  it('displays current task being processed', () => {
    render(<CleaningProgress {...defaultProps} />)
    expect(screen.getByText('Cleaning Metro Cache...')).toBeInTheDocument()
  })

  it('calculates and displays correct percentage', () => {
    render(<CleaningProgress {...defaultProps} />)
    // 5/12 = 41.666... should display as "42%"
    expect(screen.getByText('42%')).toBeInTheDocument()
  })

  it('displays formatted space cleaned', () => {
    render(<CleaningProgress {...defaultProps} />)
    // Should show "Liberado" section with formatted bytes
    expect(screen.getByText(/Liberado/i)).toBeInTheDocument()
  })

  it('displays speed in MB/s', () => {
    render(<CleaningProgress {...defaultProps} />)
    expect(screen.getByText('15.5 MB/s')).toBeInTheDocument()
  })

  it('displays ETA in correct format (seconds)', () => {
    render(<CleaningProgress {...defaultProps} />)
    expect(screen.getByText('45s')).toBeInTheDocument()
  })

  it('displays ETA in minutes format for long durations', () => {
    const longDurationProps = {
      ...defaultProps,
      etaSeconds: 135, // 2m 15s
    }
    render(<CleaningProgress {...longDurationProps} />)
    expect(screen.getByText('2m 15s')).toBeInTheDocument()
  })

  it('shows "Calculando..." for invalid speed', () => {
    const invalidSpeedProps = {
      ...defaultProps,
      speedMBps: 0,
    }
    render(<CleaningProgress {...invalidSpeedProps} />)
    expect(screen.getAllByText('Calculando...').length).toBeGreaterThan(0)
  })

  it('displays speed in KB/s for slow speeds', () => {
    const slowSpeedProps = {
      ...defaultProps,
      speedMBps: 0.5, // Should show as 512 KB/s
    }
    render(<CleaningProgress {...slowSpeedProps} />)
    expect(screen.getByText(/KB\/s/)).toBeInTheDocument()
  })

  it('displays total space to clean', () => {
    render(<CleaningProgress {...defaultProps} />)
    expect(screen.getByText(/Total a limpar:/)).toBeInTheDocument()
  })

  it('renders cancel button when onCancel is provided', () => {
    render(<CleaningProgress {...defaultProps} />)
    const cancelButton = screen.getByTitle('Cancelar limpeza')
    expect(cancelButton).toBeInTheDocument()
  })

  it('calls onCancel when cancel button is clicked', () => {
    render(<CleaningProgress {...defaultProps} />)
    const cancelButton = screen.getByTitle('Cancelar limpeza')
    fireEvent.click(cancelButton)
    expect(mockOnCancel).toHaveBeenCalledTimes(1)
  })

  it('does not render cancel button when onCancel is not provided', () => {
    const noCancelProps = {
      ...defaultProps,
      onCancel: undefined,
    }
    render(<CleaningProgress {...noCancelProps} />)
    expect(screen.queryByTitle('Cancelar limpeza')).not.toBeInTheDocument()
  })

  it('shows error section when errors > 0', () => {
    const errorProps = {
      ...defaultProps,
      errors: 3,
    }
    render(<CleaningProgress {...errorProps} />)
    expect(screen.getByText(/3 erros encontrados/)).toBeInTheDocument()
  })

  it('hides error section when errors = 0', () => {
    render(<CleaningProgress {...defaultProps} />)
    expect(screen.queryByText(/erros encontrados/)).not.toBeInTheDocument()
  })

  it('handles singular error correctly', () => {
    const singleErrorProps = {
      ...defaultProps,
      errors: 1,
    }
    render(<CleaningProgress {...singleErrorProps} />)
    expect(screen.getByText(/1 erro encontrado/)).toBeInTheDocument()
  })

  it('shows progress bar animation', () => {
    const { container } = render(<CleaningProgress {...defaultProps} />)
    const progressBar = container.querySelector('.bg-gradient-to-r.from-primary')
    expect(progressBar).toBeInTheDocument()
  })

  it('displays 100% when all tasks completed', () => {
    const completedProps = {
      ...defaultProps,
      completedTasks: 12,
      totalTasks: 12,
    }
    render(<CleaningProgress {...completedProps} />)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('displays 0% when no tasks completed', () => {
    const noProgressProps = {
      ...defaultProps,
      completedTasks: 0,
    }
    render(<CleaningProgress {...noProgressProps} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('handles edge case with 0 total tasks', () => {
    const edgeCaseProps = {
      ...defaultProps,
      totalTasks: 0,
      completedTasks: 0,
    }
    render(<CleaningProgress {...edgeCaseProps} />)
    // Should not crash and should show 0%
    expect(screen.getByText('0%')).toBeInTheDocument()
  })
})

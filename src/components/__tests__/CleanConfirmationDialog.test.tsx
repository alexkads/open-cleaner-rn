import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CleanConfirmationDialog from '../CleanConfirmationDialog'

describe('CleanConfirmationDialog', () => {
  const mockOnConfirm = vi.fn()
  const mockOnCancel = vi.fn()

  const defaultProps = {
    isVisible: true,
    categories: ['Expo Cache', 'Metro Cache', 'npm Cache'],
    totalSize: 2500000000, // 2.5 GB
    fileCount: 1500,
    warnings: ['System Data: iOS backups will be removed', 'This action cannot be undone'],
    onConfirm: mockOnConfirm,
    onCancel: mockOnCancel,
  }

  beforeEach(() => {
    mockOnConfirm.mockClear()
    mockOnCancel.mockClear()
  })

  it('renders dialog when visible', () => {
    render(<CleanConfirmationDialog {...defaultProps} />)
    expect(screen.getByText('Confirmar Limpeza')).toBeInTheDocument()
  })

  it('does not render when not visible', () => {
    render(<CleanConfirmationDialog {...defaultProps} isVisible={false} />)
    expect(screen.queryByText('Confirmar Limpeza')).not.toBeInTheDocument()
  })

  it('displays correct number of categories', () => {
    render(<CleanConfirmationDialog {...defaultProps} />)
    expect(screen.getByText('3')).toBeInTheDocument()
    // Check for category count text
    const categoryText = screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'p' && content.includes('Categoria')
    })
    expect(categoryText).toBeInTheDocument()
  })

  it('displays correct file count', () => {
    render(<CleanConfirmationDialog {...defaultProps} />)
    expect(screen.getByText('1,500')).toBeInTheDocument()
    // Check for file count text
    const fileText = screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'p' && content.includes('Arquivo')
    })
    expect(fileText).toBeInTheDocument()
  })

  it('displays formatted file size', () => {
    render(<CleanConfirmationDialog {...defaultProps} />)
    // 2.5 GB should be displayed as "2.3 GB" (formatBytes)
    expect(screen.getByText(/GB/)).toBeInTheDocument()
  })

  it('displays all category names', () => {
    render(<CleanConfirmationDialog {...defaultProps} />)
    expect(screen.getByText('Expo Cache')).toBeInTheDocument()
    expect(screen.getByText('Metro Cache')).toBeInTheDocument()
    expect(screen.getByText('npm Cache')).toBeInTheDocument()
  })

  it('displays warnings when provided', () => {
    render(<CleanConfirmationDialog {...defaultProps} />)
    expect(screen.getByText('Avisos Importantes')).toBeInTheDocument()
    expect(screen.getByText(/System Data: iOS backups will be removed/)).toBeInTheDocument()
    expect(screen.getByText(/This action cannot be undone/)).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', () => {
    render(<CleanConfirmationDialog {...defaultProps} />)
    const confirmButton = screen.getByText('✓ Confirmar Limpeza')
    fireEvent.click(confirmButton)
    expect(mockOnConfirm).toHaveBeenCalledTimes(1)
    expect(mockOnCancel).toHaveBeenCalledTimes(1) // Also closes dialog
  })

  it('calls onCancel when cancel button is clicked', () => {
    render(<CleanConfirmationDialog {...defaultProps} />)
    const cancelButton = screen.getByText('Cancelar')
    fireEvent.click(cancelButton)
    expect(mockOnCancel).toHaveBeenCalledTimes(1)
    expect(mockOnConfirm).not.toHaveBeenCalled()
  })

  it('calls onCancel when close button (X) is clicked', () => {
    render(<CleanConfirmationDialog {...defaultProps} />)
    const closeButton = screen.getByTitle('Fechar (ESC)')
    fireEvent.click(closeButton)
    expect(mockOnCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when clicking outside (overlay)', () => {
    render(<CleanConfirmationDialog {...defaultProps} />)
    const overlay = screen.getByText('Confirmar Limpeza').closest('.fixed')
    if (overlay) {
      fireEvent.click(overlay)
      expect(mockOnCancel).toHaveBeenCalledTimes(1)
    }
  })

  it('displays irreversibility warning', () => {
    render(<CleanConfirmationDialog {...defaultProps} />)
    expect(screen.getByText(/Esta ação é irreversível/)).toBeInTheDocument()
  })

  it('shows ESC keyboard hint', () => {
    render(<CleanConfirmationDialog {...defaultProps} />)
    expect(screen.getByText(/Pressione/)).toBeInTheDocument()
    expect(screen.getByText('ESC')).toBeInTheDocument()
  })

  it('handles singular category correctly', () => {
    const singleCategoryProps = {
      ...defaultProps,
      categories: ['Expo Cache'],
    }
    render(<CleanConfirmationDialog {...singleCategoryProps} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    // Check for singular "Categoria" text (not "Categorias")
    const categoryText = screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'p' && content === 'Categoria'
    })
    expect(categoryText).toBeInTheDocument()
  })

  it('handles singular file correctly', () => {
    const singleFileProps = {
      ...defaultProps,
      fileCount: 1,
    }
    render(<CleanConfirmationDialog {...singleFileProps} />)
    expect(screen.getByText('Arquivo')).toBeInTheDocument()
  })

  it('hides warning section when no warnings provided', () => {
    const noWarningsProps = {
      ...defaultProps,
      warnings: [],
    }
    render(<CleanConfirmationDialog {...noWarningsProps} />)
    expect(screen.queryByText('Avisos Importantes')).not.toBeInTheDocument()
  })
})

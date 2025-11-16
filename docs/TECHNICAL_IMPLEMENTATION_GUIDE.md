# 🛠️ Guia Técnico de Implementação

> **Guia detalhado de implementação das melhorias prioritárias do Open Cleaner RN**

---

## 📋 Índice

1. [Scan Paralelo](#1-scan-paralelo)
2. [Limpeza Seletiva](#2-limpeza-seletiva)
3. [Dialog de Confirmação](#3-dialog-de-confirmação)
4. [Barra de Progresso](#4-barra-de-progresso)
5. [Error Boundaries](#5-error-boundaries)
6. [Testes](#6-testes)

---

## 1. Scan Paralelo

### **Objetivo**
Reduzir tempo de scan de ~15s para ~5s usando Promise.allSettled

### **Implementação Passo a Passo**

#### **Passo 1: Refatorar handleScan**

**Arquivo:** `src/pages/Dashboard.tsx`

**Antes:**
```typescript
const handleScan = useCallback(async () => {
  for (const task of CLEANING_TASKS) {
    try {
      setCurrentTask(task.name)
      updateTaskStatus(task.id, { status: 'scanning' })
      
      const results = await task.scanFunction() // ❌ Sequencial
      const taskSize = results.reduce((sum, item) => sum + item.size, 0)
      
      updateTaskStatus(task.id, {
        status: taskSize > 0 ? 'found' : 'completed',
        size: taskSize,
        items: results,
      })
    } catch (error) {
      updateTaskStatus(task.id, { status: 'error' })
    }
  }
}, [])
```

**Depois:**
```typescript
const handleScan = useCallback(async () => {
  if (isScanning || isCleaning) return
  
  const scanToast = toast.loading('Iniciando scan paralelo...', {
    duration: Infinity,
    description: `Scaneando ${CLEANING_TASKS.length} categorias simultaneamente`,
  })

  try {
    setIsScanning(true)
    setTotalSpaceFound(0)

    // Reset all tasks to pending
    setTasks(prev =>
      prev.map(task => ({
        ...task,
        status: 'pending' as const,
        size: 0,
        items: [],
      }))
    )

    // ✅ Create promises for all scans
    const scanPromises = CLEANING_TASKS.map(async (task) => {
      try {
        // Update to scanning state
        updateTaskStatus(task.id, { status: 'scanning' })
        
        // Execute scan
        const results = await task.scanFunction()
        const taskSize = results.reduce((sum, item) => sum + item.size, 0)
        
        // Update with results
        updateTaskStatus(task.id, {
          status: taskSize > 0 ? 'found' : 'completed',
          size: taskSize,
          items: results,
        })
        
        return { taskId: task.id, size: taskSize, success: true }
      } catch (error) {
        console.error(`Failed to scan ${task.name}:`, error)
        updateTaskStatus(task.id, { status: 'error' })
        return { taskId: task.id, size: 0, success: false, error }
      }
    })

    // ✅ Execute all scans in parallel
    const results = await Promise.allSettled(scanPromises)
    
    // Calculate total space found
    let totalFound = 0
    let successCount = 0
    let failureCount = 0
    
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value.success) {
        totalFound += result.value.size
        successCount++
      } else {
        failureCount++
      }
    })
    
    setTotalSpaceFound(totalFound)

    // Show completion toast
    if (failureCount === 0) {
      toast.success('Scan concluído com sucesso!', {
        id: scanToast,
        description: `${formatBytes(totalFound)} encontrados em ${successCount} categorias`,
        duration: 5000,
      })
    } else {
      toast.warning('Scan concluído com avisos', {
        id: scanToast,
        description: `${formatBytes(totalFound)} encontrados, ${failureCount} erros`,
        duration: 5000,
      })
    }
    
  } catch (error) {
    console.error('Scan failed:', error)
    toast.error('Falha no scan do sistema', {
      id: scanToast,
      description: `${error}`,
      duration: 5000,
    })
  } finally {
    setIsScanning(false)
    setCurrentTask(null)
  }
}, [isScanning, isCleaning])
```

#### **Passo 2: Adicionar Indicador Visual de Progresso Paralelo**

```typescript
// Novo componente: ParallelScanProgress.tsx
interface ParallelScanProgressProps {
  tasks: CleaningTask[]
  totalTasks: number
}

export function ParallelScanProgress({ tasks, totalTasks }: ParallelScanProgressProps) {
  const completedTasks = tasks.filter(t => 
    t.status === 'found' || t.status === 'completed' || t.status === 'error'
  ).length
  
  const scanningTasks = tasks.filter(t => t.status === 'scanning')
  const percentage = (completedTasks / totalTasks) * 100
  
  return (
    <div className="glass-effect rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Scan em Progresso</span>
        <span className="text-xs text-gray-400">
          {completedTasks}/{totalTasks} categorias
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-dark-surface-2 rounded-full h-2 mb-3">
        <div 
          className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Currently scanning */}
      {scanningTasks.length > 0 && (
        <div className="space-y-1">
          {scanningTasks.map(task => (
            <div key={task.id} className="flex items-center space-x-2 text-xs text-gray-400">
              <Loader2 className="w-3 h-3 animate-spin text-primary" />
              <span>Scaneando {task.name}...</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

#### **Passo 3: Testes**

```typescript
// src/pages/__tests__/Dashboard.parallel-scan.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Dashboard from '../Dashboard'

describe('Parallel Scan', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should execute scans in parallel', async () => {
    const user = userEvent.setup()
    render(<Dashboard />)
    
    const scanButton = screen.getByText('Quick Scan')
    const startTime = Date.now()
    
    await user.click(scanButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Found:/)).toBeInTheDocument()
    }, { timeout: 10000 })
    
    const duration = Date.now() - startTime
    
    // Should complete in less than 10 seconds (vs 15-20s sequential)
    expect(duration).toBeLessThan(10000)
  })

  it('should handle partial failures gracefully', async () => {
    // Mock one scan to fail
    vi.spyOn(TauriService, 'scanExpoCache').mockRejectedValue(new Error('Network error'))
    
    const user = userEvent.setup()
    render(<Dashboard />)
    
    await user.click(screen.getByText('Quick Scan'))
    
    await waitFor(() => {
      expect(screen.getByText(/Scan concluído com avisos/)).toBeInTheDocument()
    })
  })

  it('should update progress correctly during parallel scan', async () => {
    const user = userEvent.setup()
    render(<Dashboard />)
    
    await user.click(screen.getByText('Quick Scan'))
    
    // Should show parallel progress
    expect(screen.getByText(/Scan em Progresso/)).toBeInTheDocument()
    
    // Wait for completion
    await waitFor(() => {
      expect(screen.getByText(/Scan concluído/)).toBeInTheDocument()
    })
  })
})
```

---

## 2. Limpeza Seletiva

### **Objetivo**
Permitir usuário selecionar categorias específicas para limpar

### **Implementação**

#### **Passo 1: Adicionar Estado de Seleção**

```typescript
// Atualizar interface CleaningTask
interface CleaningTask {
  id: string
  name: string
  // ... outros campos
  selected: boolean  // ✅ Novo campo
}

// No Dashboard, adicionar estado de seleção
const [tasks, setTasks] = useState<CleaningTask[]>([])

const toggleTaskSelection = useCallback((taskId: string) => {
  setTasks(prev =>
    prev.map(task =>
      task.id === taskId
        ? { ...task, selected: !task.selected }
        : task
    )
  )
}, [])

const selectAllTasks = useCallback((select: boolean) => {
  setTasks(prev =>
    prev.map(task => ({
      ...task,
      selected: select && task.status === 'found' && task.items.length > 0
    }))
  )
}, [])

// Calcular totais selecionados
const selectedStats = useMemo(() => {
  const selectedTasks = tasks.filter(t => t.selected)
  return {
    count: selectedTasks.length,
    totalSize: selectedTasks.reduce((sum, t) => sum + t.size, 0),
    totalFiles: selectedTasks.reduce((sum, t) => sum + t.items.length, 0),
  }
}, [tasks])
```

#### **Passo 2: Componente de Checkbox**

```typescript
// src/components/TaskCard.tsx
interface TaskCardProps {
  task: CleaningTask
  onToggleSelection: (taskId: string) => void
}

export function TaskCard({ task, onToggleSelection }: TaskCardProps) {
  const canSelect = task.status === 'found' && task.items.length > 0
  
  return (
    <div className={clsx(
      'glass-effect rounded-xl p-4 border transition-all duration-200',
      task.selected && 'ring-2 ring-primary'
    )}>
      <div className="flex items-start justify-between mb-3">
        {/* Checkbox de seleção */}
        {canSelect && (
          <button
            onClick={() => onToggleSelection(task.id)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            aria-label={`${task.selected ? 'Desmarcar' : 'Marcar'} ${task.name}`}
          >
            {task.selected ? (
              <CheckSquare className="w-5 h-5 text-primary" />
            ) : (
              <Square className="w-5 h-5 text-gray-400" />
            )}
          </button>
        )}
        
        {/* Resto do card */}
        <div className="flex items-center space-x-3 flex-1">
          <div className="p-2 rounded-lg bg-dark-surface-2">
            <task.icon className={clsx('w-5 h-5', task.color)} />
          </div>
          <div>
            <h3 className="font-medium">{task.name}</h3>
            <p className="text-xs text-gray-400">{task.description}</p>
          </div>
        </div>
        
        <div>{getStatusIcon(task.status)}</div>
      </div>
      
      {/* Informações de tamanho */}
      {task.size > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Size:</span>
          <span className="font-medium text-primary">
            {formatBytes(task.size)}
          </span>
        </div>
      )}
    </div>
  )
}
```

#### **Passo 3: Barra de Seleção**

```typescript
// src/components/SelectionBar.tsx
interface SelectionBarProps {
  selectedCount: number
  totalSize: number
  totalFiles: number
  onSelectAll: () => void
  onDeselectAll: () => void
  onCleanSelected: () => void
}

export function SelectionBar({
  selectedCount,
  totalSize,
  totalFiles,
  onSelectAll,
  onDeselectAll,
  onCleanSelected,
}: SelectionBarProps) {
  if (selectedCount === 0) return null
  
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="glass-effect rounded-2xl p-4 border border-primary/50 shadow-2xl min-w-[500px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CheckCircle className="w-6 h-6 text-primary" />
            <div>
              <p className="font-semibold text-white">
                {selectedCount} categoria{selectedCount !== 1 ? 's' : ''} selecionada{selectedCount !== 1 ? 's' : ''}
              </p>
              <p className="text-sm text-gray-400">
                {formatBytes(totalSize)} • {totalFiles} arquivos
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onDeselectAll}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
            >
              Desmarcar Tudo
            </button>
            
            <button
              onClick={onCleanSelected}
              className="px-6 py-2 rounded-lg bg-primary hover:bg-primary/80 transition-colors font-semibold flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Limpar Selecionados</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
```

#### **Passo 4: Atualizar handleClean**

```typescript
const handleCleanSelected = useCallback(async () => {
  if (isScanning || isCleaning) return

  const selectedTasks = tasks.filter(t => t.selected && t.items.length > 0)

  if (selectedTasks.length === 0) {
    toast.warning('Nenhuma categoria selecionada', {
      description: 'Selecione ao menos uma categoria para limpar',
    })
    return
  }

  // Mostrar dialog de confirmação (ver próxima seção)
  const confirmed = await showConfirmationDialog({
    categories: selectedTasks.map(t => t.name),
    totalSize: selectedStats.totalSize,
    fileCount: selectedStats.totalFiles,
  })

  if (!confirmed) return

  // Proceder com limpeza apenas das selecionadas
  const cleanToast = toast.loading('Iniciando limpeza...', {
    duration: Infinity,
    description: `${selectedTasks.length} categorias serão limpas`,
  })

  try {
    setIsCleaning(true)
    // ... resto da lógica de limpeza
  } finally {
    setIsCleaning(false)
  }
}, [tasks, selectedStats, isScanning, isCleaning])
```

#### **Passo 5: Persistir Preferências**

```typescript
// src/hooks/useSelectionPreferences.ts
export function useSelectionPreferences() {
  const savePreferences = useCallback((tasks: CleaningTask[]) => {
    const preferences = tasks
      .filter(t => t.selected)
      .map(t => t.id)
    
    localStorage.setItem('cleanerPreferences', JSON.stringify(preferences))
  }, [])

  const loadPreferences = useCallback((tasks: CleaningTask[]): CleaningTask[] => {
    const saved = localStorage.getItem('cleanerPreferences')
    if (!saved) return tasks

    const preferredIds = JSON.parse(saved)
    
    return tasks.map(task => ({
      ...task,
      selected: preferredIds.includes(task.id) && task.status === 'found',
    }))
  }, [])

  return { savePreferences, loadPreferences }
}
```

---

## 3. Dialog de Confirmação

### **Implementação**

```typescript
// src/components/CleanConfirmationDialog.tsx
import { AlertTriangle, CheckCircle, FileText, HardDrive, Trash2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface CleanConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  categories: string[]
  totalSize: number
  fileCount: number
  warnings: string[]
}

export function CleanConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  categories,
  totalSize,
  fileCount,
  warnings,
}: CleanConfirmationDialogProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false)

  const handleConfirm = () => {
    if (dontShowAgain) {
      localStorage.setItem('skipCleanConfirmation', 'true')
    }
    onConfirm()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Dialog */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="glass-effect rounded-2xl border border-warning/50 p-6 max-w-md w-full shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-warning/20">
                    <AlertTriangle className="w-6 h-6 text-warning" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Confirmar Limpeza
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <p className="text-gray-300">
                  Você está prestes a limpar:
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="glass-effect rounded-lg p-3 text-center">
                    <FileText className="w-5 h-5 text-primary mx-auto mb-1" />
                    <p className="text-2xl font-bold text-white">{categories.length}</p>
                    <p className="text-xs text-gray-400">categoria{categories.length !== 1 ? 's' : ''}</p>
                  </div>
                  
                  <div className="glass-effect rounded-lg p-3 text-center">
                    <Trash2 className="w-5 h-5 text-accent mx-auto mb-1" />
                    <p className="text-2xl font-bold text-white">{fileCount.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">arquivo{fileCount !== 1 ? 's' : ''}</p>
                  </div>
                  
                  <div className="glass-effect rounded-lg p-3 text-center">
                    <HardDrive className="w-5 h-5 text-success mx-auto mb-1" />
                    <p className="text-2xl font-bold text-white">{formatBytes(totalSize)}</p>
                    <p className="text-xs text-gray-400">espaço</p>
                  </div>
                </div>

                {/* Categories List */}
                <div className="glass-effect rounded-lg p-3 max-h-40 overflow-y-auto">
                  <p className="text-sm font-semibold text-gray-300 mb-2">
                    Categorias:
                  </p>
                  <ul className="space-y-1">
                    {categories.map(cat => (
                      <li key={cat} className="text-sm text-gray-400 flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-success" />
                        <span>{cat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Warnings */}
                {warnings.length > 0 && (
                  <div className="border border-warning/30 rounded-lg p-3 bg-warning/5">
                    <p className="text-sm font-semibold text-warning mb-2 flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Avisos Importantes:</span>
                    </p>
                    <ul className="space-y-1">
                      {warnings.map((warning, idx) => (
                        <li key={idx} className="text-xs text-warning/80">
                          • {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Important Notice */}
                <div className="border border-danger/30 rounded-lg p-3 bg-danger/5">
                  <p className="text-xs text-danger font-medium">
                    ⚠️ Esta ação não pode ser desfeita. Os arquivos serão removidos permanentemente.
                  </p>
                </div>

                {/* Don't show again */}
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                    className="rounded border-gray-600 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-400">
                    Não mostrar novamente
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium"
                >
                  Cancelar
                </button>
                
                <button
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-3 rounded-lg bg-primary hover:bg-primary/80 transition-colors font-semibold flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Confirmar Limpeza</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

---

## 4. Barra de Progresso

### **Implementação**

```typescript
// src/components/ProgressBar.tsx
interface ProgressBarProps {
  percentage: number
  label: string
  speed?: string
  eta?: string
  onCancel?: () => void
}

export function ProgressBar({
  percentage,
  label,
  speed,
  eta,
  onCancel,
}: ProgressBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl p-6 border border-primary/30"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <div>
            <h3 className="font-bold text-white">{label}</h3>
            {speed && (
              <p className="text-sm text-gray-400">
                Velocidade: {speed}
              </p>
            )}
          </div>
        </div>
        
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-danger/20 hover:bg-danger/30 transition-colors text-danger font-medium"
          >
            Cancelar
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative w-full bg-dark-surface-2 rounded-full h-4 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary via-accent to-success rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        
        {/* Percentage Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white drop-shadow-lg">
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* ETA */}
      {eta && (
        <p className="text-sm text-gray-400 mt-2 text-right">
          Tempo restante: {eta}
        </p>
      )}
    </motion.div>
  )
}
```

### **Hook de Progresso**

```typescript
// src/hooks/useProgress.ts
interface UseProgressOptions {
  total: number
  onComplete?: () => void
}

export function useProgress({ total, onComplete }: UseProgressOptions) {
  const [current, setCurrent] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [speed, setSpeed] = useState(0)

  const percentage = useMemo(() => {
    return total > 0 ? (current / total) * 100 : 0
  }, [current, total])

  const eta = useMemo(() => {
    if (!startTime || current === 0) return null
    
    const elapsed = Date.now() - startTime
    const rate = current / elapsed
    const remaining = total - current
    const etaMs = remaining / rate
    
    return formatDuration(etaMs)
  }, [current, total, startTime])

  const increment = useCallback((amount = 1) => {
    setCurrent(prev => {
      const next = Math.min(prev + amount, total)
      
      if (next === total && onComplete) {
        onComplete()
      }
      
      return next
    })
  }, [total, onComplete])

  const reset = useCallback(() => {
    setCurrent(0)
    setStartTime(null)
    setSpeed(0)
  }, [])

  const start = useCallback(() => {
    setStartTime(Date.now())
  }, [])

  return {
    current,
    total,
    percentage,
    speed,
    eta,
    increment,
    reset,
    start,
  }
}
```

---

## 5. Error Boundaries

### **Implementação**

```typescript
// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    
    // Log to error tracking service
    this.logErrorToService(error, errorInfo)
    
    this.setState({
      error,
      errorInfo,
    })
  }

  logErrorToService(error: Error, errorInfo: ErrorInfo) {
    // TODO: Integrate with Sentry, LogRocket, etc.
    console.error('Error logged:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
        />
      )
    }

    return this.props.children
  }
}

// Fallback UI
interface ErrorFallbackProps {
  error: Error | null
  errorInfo: ErrorInfo | null
  onReset: () => void
}

function ErrorFallback({ error, errorInfo, onReset }: ErrorFallbackProps) {
  const isDev = import.meta.env.DEV

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-[#1a1a2e] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full glass-effect rounded-2xl p-8 border border-danger/50">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-danger/20">
            <AlertTriangle className="w-12 h-12 text-danger" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-2 gradient-text">
          Oops! Algo deu errado
        </h1>
        
        <p className="text-center text-gray-400 mb-6">
          Ocorreu um erro inesperado. Tente recarregar a página.
        </p>

        {/* Error Details (Dev only) */}
        {isDev && error && (
          <div className="mb-6 p-4 bg-danger/10 rounded-lg border border-danger/30">
            <p className="text-sm font-semibold text-danger mb-2">
              Error: {error.message}
            </p>
            
            {error.stack && (
              <pre className="text-xs text-gray-400 overflow-auto max-h-40">
                {error.stack}
              </pre>
            )}
            
            {errorInfo?.componentStack && (
              <details className="mt-2">
                <summary className="text-xs text-gray-400 cursor-pointer">
                  Component Stack
                </summary>
                <pre className="text-xs text-gray-500 mt-2 overflow-auto max-h-40">
                  {errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onReset}
            className="flex-1 px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 transition-colors font-semibold flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Tentar Novamente</span>
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Voltar ao Início</span>
          </button>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Se o problema persistir, por favor{' '}
          <a
            href="https://github.com/alexkads/open-cleaner-rn/issues"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            reporte este bug
          </a>
          .
        </p>
      </div>
    </div>
  )
}
```

### **Uso no App**

```typescript
// src/App.tsx
import { ErrorBoundary } from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <div className="h-screen bg-gradient-to-br from-dark-bg to-[#1a1a2e] text-white overflow-hidden">
        {/* ... resto do app */}
      </div>
    </ErrorBoundary>
  )
}

// Para componentes específicos
function Dashboard() {
  return (
    <ErrorBoundary fallback={<DashboardErrorFallback />}>
      {/* ... dashboard content */}
    </ErrorBoundary>
  )
}
```

---

## 6. Testes

### **Configuração de Testes**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test-setup.ts',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### **Testes de Integração**

```typescript
// src/pages/__tests__/Dashboard.integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router'
import Dashboard from '../Dashboard'
import { TauriService } from '@/services/tauri'

vi.mock('@/services/tauri')

describe('Dashboard Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Complete Scan and Clean Flow', () => {
    it('should complete full workflow: scan → select → clean', async () => {
      const user = userEvent.setup()
      
      // Mock scan results
      vi.spyOn(TauriService, 'scanExpoCache').mockResolvedValue([
        {
          path: '/Users/test/.expo',
          size: 1024 * 1024 * 100, // 100 MB
          file_type: 'expo_cache',
          can_delete: true,
        },
      ])

      // Mock clean
      vi.spyOn(TauriService, 'cleanFiles').mockResolvedValue({
        files_deleted: 1,
        space_freed: 1024 * 1024 * 100,
        duration: 1000,
        errors: [],
      })

      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      )

      // 1. Execute scan
      const scanButton = screen.getByText('Quick Scan')
      await user.click(scanButton)

      // 2. Wait for results
      await waitFor(() => {
        expect(screen.getByText(/Found:/)).toBeInTheDocument()
      })

      // 3. Select task
      const checkbox = screen.getByLabelText(/Marcar Expo Cache/)
      await user.click(checkbox)

      // 4. Clean selected
      const cleanButton = screen.getByText(/Limpar Selecionados/)
      await user.click(cleanButton)

      // 5. Confirm dialog
      const confirmButton = screen.getByText(/Confirmar Limpeza/)
      await user.click(confirmButton)

      // 6. Verify completion
      await waitFor(() => {
        expect(screen.getByText(/Limpeza Concluída/)).toBeInTheDocument()
      })

      // Verify clean was called
      expect(TauriService.cleanFiles).toHaveBeenCalledWith(['/Users/test/.expo'])
    })
  })

  describe('Error Handling', () => {
    it('should recover from scan error gracefully', async () => {
      const user = userEvent.setup()
      
      vi.spyOn(TauriService, 'scanExpoCache').mockRejectedValue(
        new Error('Network error')
      )

      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      )

      await user.click(screen.getByText('Quick Scan'))

      await waitFor(() => {
        expect(screen.getByText(/Falha no scan/)).toBeInTheDocument()
      })

      // Should still be able to retry
      expect(screen.getByText('Quick Scan')).not.toBeDisabled()
    })
  })
})
```

---

## 📊 Checklist de Implementação

### **Scan Paralelo**
- [ ] Refatorar handleScan para usar Promise.allSettled
- [ ] Adicionar componente ParallelScanProgress
- [ ] Implementar cálculo de progresso em tempo real
- [ ] Adicionar testes de performance
- [ ] Documentar nova arquitetura

### **Limpeza Seletiva**
- [ ] Adicionar campo `selected` em CleaningTask
- [ ] Criar componente TaskCard com checkbox
- [ ] Implementar SelectionBar
- [ ] Adicionar hooks de persistência
- [ ] Atualizar handleClean para usar seleção
- [ ] Testes E2E do fluxo completo

### **Dialog de Confirmação**
- [ ] Criar componente CleanConfirmationDialog
- [ ] Implementar animações com Framer Motion
- [ ] Adicionar "Não mostrar novamente"
- [ ] Integrar com fluxo de limpeza
- [ ] Testes de acessibilidade

### **Barra de Progresso**
- [ ] Criar componente ProgressBar
- [ ] Implementar hook useProgress
- [ ] Adicionar cálculo de ETA
- [ ] Implementar cancelamento
- [ ] Testes de performance

### **Error Boundaries**
- [ ] Criar ErrorBoundary component
- [ ] Criar ErrorFallback UI
- [ ] Adicionar logging de erros
- [ ] Integrar com serviço de monitoramento
- [ ] Wrap componentes críticos
- [ ] Testes de erro simulados

---

**Próximos Passos:** Começar com Scan Paralelo (maior impacto) e seguir a ordem de prioridade.

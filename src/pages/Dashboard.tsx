import { clsx } from 'clsx'
import {
  AlertTriangle,
  Bug,
  CheckCircle,
  Clock,
  Cpu,
  Database,
  Download,
  HardDrive,
  Layers,
  Loader2,
  RotateCcw,
  Search,
  Shield,
  Smartphone,
  Trash2,
  Zap,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import CleanConfirmationDialog from '../components/CleanConfirmationDialog'
import CleaningProgress from '../components/CleaningProgress'
import DebugPanel from '../components/DebugPanel'
import { CleaningHistory, DatabaseService } from '../services/database'
import { MockTauriService } from '../services/mock-tauri'
import {
  formatBytes,
  formatDuration,
  ScanResult,
  TauriService,
} from '../services/tauri'

const useMockEnv =
  import.meta.env.VITE_USE_MOCK === '1' ||
  import.meta.env.VITE_USE_MOCK === 'true'
const TestTauriService = useMockEnv ? MockTauriService : TauriService

// Tipos de tarefa de limpeza
interface CleaningTask {
  id: string
  name: string
  description: string
  category: 'cache' | 'logs' | 'temp' | 'build' | 'docker' | 'tools' | 'system'
  icon: React.ComponentType<{ className?: string }>
  scanFunction: () => Promise<ScanResult[]>
  color: string
  status: 'pending' | 'scanning' | 'found' | 'cleaning' | 'completed' | 'error'
  size: number
  items: ScanResult[]
  lastUpdated?: Date
  selected: boolean
}

// Definição das tarefas de limpeza disponíveis
const CLEANING_TASKS: Omit<CleaningTask, 'status' | 'size' | 'items' | 'selected'>[] = [
  {
    id: 'expo-cache',
    name: 'Expo Cache',
    description: 'Clean Expo development cache and temporary files',
    category: 'cache',
    icon: Smartphone,
    scanFunction: TestTauriService.scanExpoCache,
    color: 'text-blue-400',
  },
  {
    id: 'metro-cache',
    name: 'Metro Cache',
    description: 'Clean Metro bundler cache files',
    category: 'cache',
    icon: Layers,
    scanFunction: TestTauriService.scanMetroCache,
    color: 'text-green-400',
  },
  {
    id: 'npm-cache',
    name: 'NPM Cache',
    description: 'Clean Node.js package manager cache',
    category: 'cache',
    icon: Download,
    scanFunction: TestTauriService.scanNpmCache,
    color: 'text-red-400',
  },
  {
    id: 'ios-cache',
    name: 'iOS Build Cache',
    description: 'Clean iOS simulator and build artifacts',
    category: 'build',
    icon: Cpu,
    scanFunction: TestTauriService.scanIosCache,
    color: 'text-purple-400',
  },
  {
    id: 'android-cache',
    name: 'Android Cache',
    description: 'Clean Android build cache and temporary files',
    category: 'build',
    icon: Shield,
    scanFunction: TestTauriService.scanAndroidCache,
    color: 'text-yellow-400',
  },
  {
    id: 'watchman-cache',
    name: 'Watchman Logs',
    description: 'Clean Watchman file watching service logs',
    category: 'logs',
    icon: Clock,
    scanFunction: TestTauriService.scanWatchmanCache,
    color: 'text-orange-400',
  },
  {
    id: 'cocoapods-cache',
    name: 'CocoaPods Cache',
    description: 'Clean CocoaPods dependency cache',
    category: 'cache',
    icon: HardDrive,
    scanFunction: TestTauriService.scanCocoaPodsCache,
    color: 'text-pink-400',
  },
  {
    id: 'flipper-logs',
    name: 'Flipper Logs',
    description: 'Clean Flipper debugging tool logs',
    category: 'logs',
    icon: AlertTriangle,
    scanFunction: TestTauriService.scanFlipperLogs,
    color: 'text-cyan-400',
  },
  {
    id: 'temp-files',
    name: 'Temp Files',
    description: 'Clean system temporary files',
    category: 'temp',
    icon: Trash2,
    scanFunction: TestTauriService.scanTempFiles,
    color: 'text-gray-400',
  },
  {
    id: 'react-native-cache',
    name: 'React Native Cache',
    description: 'Clean React Native CLI cache and development files',
    category: 'cache',
    icon: Smartphone,
    scanFunction: TestTauriService.scanReactNativeCache,
    color: 'text-sky-400',
  },
  {
    id: 'hermes-cache',
    name: 'Hermes Cache',
    description: 'Clean Hermes JavaScript engine cache',
    category: 'cache',
    icon: Cpu,
    scanFunction: TestTauriService.scanHermesCache,
    color: 'text-violet-400',
  },
  // VS Code cache scanning DISABLED - User doesn't want VS Code cleaning
  /*
  {
    id: 'vscode-cache',
    name: 'VS Code Cache', 
    description: 'Clean Visual Studio Code logs and extensions',
    category: 'tools',
    icon: HardDrive,
    scanFunction: TestTauriService.scanVsCodeCache,
    color: 'text-blue-500',
  },
  */
  {
    id: 'android-studio-cache',
    name: 'Android Studio Cache',
    description: 'Clean Android Studio system cache and logs',
    category: 'tools',
    icon: Shield,
    scanFunction: TestTauriService.scanAndroidStudioCache,
    color: 'text-green-500',
  },
  {
    id: 'build-artifacts',
    name: 'Build Artifacts',
    description: 'Clean old APK and IPA files from common folders',
    category: 'build',
    icon: Trash2,
    scanFunction: TestTauriService.scanBuildArtifacts,
    color: 'text-amber-400',
  },
  {
    id: 'homebrew-cache',
    name: 'Homebrew Cache',
    description: 'Clean Homebrew package manager cache',
    category: 'tools',
    icon: Download,
    scanFunction: TestTauriService.scanHomebrewCache,
    color: 'text-orange-500',
  },
  {
    id: 'system-data',
    name: 'System Data',
    description: 'Deep clean OS caches, backups, and diagnostic data with warnings',
    category: 'system',
    icon: Database,
    scanFunction: TestTauriService.scanSystemData,
    color: 'text-warning',
  },
  {
    id: 'system-logs',
    name: 'System Logs',
    description: 'Clean OS logs, crash reports, and temporary system files',
    category: 'logs',
    icon: HardDrive,
    scanFunction: TestTauriService.scanSystemLogs,
    color: 'text-red-500',
  },
]

// Removed unnecessary animation variants to simplify the interface

export default function Dashboard() {
  const [tasks, setTasks] = useState<CleaningTask[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [isCleaning, setIsCleaning] = useState(false)
  const [currentTask, setCurrentTask] = useState<string | null>(null)
  const [totalSpaceFound, setTotalSpaceFound] = useState(0)
  const [lastCleanResult, setLastCleanResult] = useState<{
    files_deleted: number
    space_freed: number
    duration: number
    errors: string[]
    warnings: string[]
  } | null>(null)
  const [lastError, setLastError] = useState<string | undefined>()
  const [recentHistory, setRecentHistory] = useState<CleaningHistory[]>([])
  const [stats, setStats] = useState({
    total_space_cleaned: 0,
    total_files_deleted: 0,
    total_sessions: 0,
    avg_duration: 0,
  })
  const [systemStatus, setSystemStatus] = useState({
    reactNative: 'checking' as 'active' | 'idle' | 'error' | 'checking',
    metroBundle: 'checking' as 'active' | 'idle' | 'error' | 'checking',
  })
  const [showDebugPanel, setShowDebugPanel] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [cleaningProgress, setCleaningProgress] = useState({
    totalTasks: 0,
    completedTasks: 0,
    totalSpaceCleaned: 0,
    totalSpaceToClean: 0,
    speedMBps: 0,
    etaSeconds: 0,
    errors: 0,
  })
  const [cancelRequested, setCancelRequested] = useState(false)

  const totalWarnings = useMemo(
    () =>
      tasks.reduce(
        (count, task) =>
          count + task.items.filter(item => Boolean(item.warning)).length,
        0
      ),
    [tasks]
  )

  const loadTasks = useCallback(() => {
    const initialTasks: CleaningTask[] = CLEANING_TASKS.map(task => ({
      ...task,
      size: 0,
      status: 'pending',
      items: [],
      selected: true, // Todas selecionadas por padrão
    }))
    setTasks(initialTasks)
  }, [])

  const loadRecentHistory = useCallback(async () => {
    try {
      console.log('Loading recent history...')
      const history = await DatabaseService.getCleaningHistory(5)
      console.log('Loaded history:', history)
      setRecentHistory(history)
    } catch (error) {
      console.error('Failed to load recent history:', error)
    }
  }, [])

  const loadStats = useCallback(async () => {
    try {
      console.log('Loading stats...')
      const statsData = await DatabaseService.getCleaningStats()
      console.log('Loaded stats:', statsData)
      setStats(statsData)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }, [])

  const checkSystemStatus = useCallback(async () => {
    try {
      // Simular verificação de status do sistema
      // Em uma implementação real, isso verificaria se os serviços estão rodando
      setSystemStatus({
        reactNative: Math.random() > 0.5 ? 'active' : 'idle',
        metroBundle: Math.random() > 0.3 ? 'active' : 'idle',
      })
    } catch (error) {
      console.error('Failed to check system status:', error)
      setSystemStatus({
        reactNative: 'error',
        metroBundle: 'error',
      })
    }
  }, [])

  const initializeDashboard = useCallback(async () => {
    if (isInitialized) return // Evitar inicialização duplicada

    try {
      console.log('Initializing dashboard...')

      // Inicializar banco de dados
      await DatabaseService.init()

      // Carregar dados paralelos
      await Promise.all([
        loadTasks(),
        loadRecentHistory(),
        loadStats(),
        checkSystemStatus(),
      ])

      // Toast de boas-vindas
      toast.success('Sistema inicializado com sucesso!', {
        description:
          'Clean RN está pronto para otimizar seu ambiente de desenvolvimento',
        duration: 3000,
      })

      setIsInitialized(true)
      console.log('Dashboard initialized successfully')
    } catch (error) {
      console.error('Failed to initialize dashboard:', error)
      setLastError(`Initialization failed: ${error}`)

      toast.error('Falha na inicialização do sistema', {
        description: 'Alguns recursos podem não funcionar corretamente',
        duration: 5000,
      })
    }
  }, [
    checkSystemStatus,
    isInitialized,
    loadRecentHistory,
    loadStats,
    loadTasks,
  ])

  // Inicializar componente
  useEffect(() => {
    if (!isInitialized) {
      initializeDashboard()
    }
  }, [initializeDashboard, isInitialized])

  // Debug event listener
  useEffect(() => {
    const handleDebugLogTasks = () => {
      console.log('=== TASK DEBUG FROM DASHBOARD ===')
      console.log(
        'Current tasks state:',
        tasks.map(t => ({
          id: t.id,
          name: t.name,
          status: t.status,
          size: t.size,
          itemsLength: t.items.length,
          items: t.items,
        }))
      )
      console.log('Current states:', {
        isScanning,
        isCleaning,
        totalSpaceFound,
        cleanableTasks: tasks.filter(
          task => task.status === 'found' && task.items.length > 0
        ).length,
      })
    }

    window.addEventListener('debug-log-tasks', handleDebugLogTasks)
    return () =>
      window.removeEventListener('debug-log-tasks', handleDebugLogTasks)
  }, [tasks, isScanning, isCleaning, totalSpaceFound])

  // ESC key to close confirmation dialog
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showConfirmDialog) {
        setShowConfirmDialog(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [showConfirmDialog])

  const updateTaskStatus = (taskId: string, updates: Partial<CleaningTask>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, ...updates, lastUpdated: new Date() }
          : task
      )
    )
  }

  const handleScan = useCallback(async () => {
    if (isScanning || isCleaning) return

    // Toast de início do scan
    const scanToast = toast.loading('Iniciando scan paralelo do sistema...', {
      duration: Infinity,
      description: 'Scaneando todas as categorias simultaneamente',
    })

    const startTime = Date.now()

    try {
      setIsScanning(true)
      setTotalSpaceFound(0)

      // Reset task status
      setTasks(prev =>
        prev.map(task => ({
          ...task,
          status: 'pending',
          size: 0,
          items: [],
        }))
      )

      // ✅ SCAN PARALELO: Executar todos os scans simultaneamente
      console.log('Starting parallel scan for', CLEANING_TASKS.length, 'tasks')

      // Marcar todas as tasks como 'scanning'
      CLEANING_TASKS.forEach(task => {
        updateTaskStatus(task.id, { status: 'scanning' })
      })

      // Criar promises para todos os scans
      const scanPromises = CLEANING_TASKS.map(task =>
        task
          .scanFunction()
          .then(results => ({
            taskId: task.id,
            taskName: task.name,
            status: 'success' as const,
            results,
          }))
          .catch(error => ({
            taskId: task.id,
            taskName: task.name,
            status: 'error' as const,
            error: String(error),
          }))
      )

      // Atualizar toast mostrando que o scan está em progresso
      toast.loading('Scan paralelo em andamento...', {
        id: scanToast,
        description: `${CLEANING_TASKS.length} categorias sendo scaneadas simultaneamente`,
      })

      // Aguardar todos os scans (paralelos)
      const scanResults = await Promise.all(scanPromises)

      // Processar resultados
      let totalFound = 0
      let successCount = 0
      let errorCount = 0

      scanResults.forEach(result => {
        if (result.status === 'success') {
          const taskSize = result.results.reduce(
            (sum, item) => sum + item.size,
            0
          )

          updateTaskStatus(result.taskId, {
            status: taskSize > 0 ? 'found' : 'completed',
            size: taskSize,
            items: result.results,
          })

          totalFound += taskSize
          successCount++

          console.log(
            `✅ Scan completed for ${result.taskName}: ${formatBytes(taskSize)}`
          )
        } else {
          // Error handling individual por task
          console.error(`❌ Failed to scan ${result.taskName}:`, result.error)
          setLastError(`Failed to scan ${result.taskName}: ${result.error}`)
          updateTaskStatus(result.taskId, { status: 'error' })
          errorCount++

          // Toast de erro específico da task
          toast.error(`Erro ao scanear ${result.taskName}`, {
            description: result.error,
            duration: 3000,
          })
        }
      })

      setTotalSpaceFound(totalFound)

      const duration = Date.now() - startTime
      const speedupMessage =
        duration < 10000
          ? ' ⚡ Scan ultra-rápido!'
          : duration < 15000
            ? ' ⚡ Scan rápido!'
            : ''

      // Toast de sucesso
      if (errorCount === 0) {
        toast.success('Scan paralelo concluído com sucesso!' + speedupMessage, {
          id: scanToast,
          description: `${formatBytes(totalFound)} encontrados em ${successCount} categorias • ${formatDuration(duration)}`,
          duration: 5000,
        })
      } else {
        toast.warning('Scan paralelo concluído com avisos', {
          id: scanToast,
          description: `${formatBytes(totalFound)} encontrados em ${successCount} categorias • ${errorCount} erro(s) • ${formatDuration(duration)}`,
          duration: 5000,
        })
      }

      console.log('Parallel scan completed:', {
        totalFound,
        successCount,
        errorCount,
        duration: formatDuration(duration),
      })
    } catch (error) {
      console.error('Scan failed:', error)
      setLastError(`Scan failed: ${error}`)

      // Toast de erro geral
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

  // Executar limpeza (chamado após confirmação)
  const executeClean = useCallback(async () => {
    if (isScanning || isCleaning) return

    // Debug: Log estado atual das tasks
    console.log('=== EXECUTE CLEAN ===')
    console.log('Total tasks:', tasks.length)
    console.log('Total space found:', totalSpaceFound)

    const cleanableTasks = tasks.filter(
      task => task.status === 'found' && task.items.length > 0 && task.selected
    )

    console.log('Cleanable tasks (selected):', cleanableTasks.length)

    // Verificar se há tarefas limpeáveis selecionadas
    const hasCleanableContent = cleanableTasks.length > 0

    if (!hasCleanableContent) {
      // Check what's wrong
      const tasksWithItems = tasks.filter(task => task.items.length > 0)
      const tasksWithFoundStatus = tasks.filter(task => task.status === 'found')

      let errorMessage = 'Nenhum item encontrado para limpeza'
      let errorDescription = ''

      if (tasks.length === 0) {
        errorDescription = 'Nenhuma tarefa foi carregada.'
      } else if (tasksWithItems.length === 0) {
        errorDescription = 'Execute um scan primeiro para encontrar arquivos.'
      } else if (tasksWithFoundStatus.length === 0) {
        errorDescription = `Status das tarefas: ${tasks
          .map(t => `${t.name}:${t.status}`)
          .slice(0, 3)
          .join(', ')}`
      } else {
        errorDescription = 'Erro desconhecido na filtragem de tarefas.'
      }

      console.error('Clean failed:', errorMessage, errorDescription)
      toast.warning(errorMessage, {
        description: errorDescription,
        duration: 5000,
      })
      return
    }

    // Se não há cleanableTasks mas há totalSpaceFound, tentar recarregar as tasks
    if (cleanableTasks.length === 0 && totalSpaceFound > 0) {
      console.log(
        'No cleanable tasks found but space exists, attempting to reload tasks...'
      )

      // Recarregar tasks e tentar novamente
      const reloadedTasks = tasks.map(task => ({
        ...task,
        status: task.items.length > 0 ? 'found' : task.status,
      }))

      const reloadedCleanableTasks = reloadedTasks.filter(
        task => task.status === 'found' && task.items.length > 0
      )

      if (reloadedCleanableTasks.length > 0) {
        console.log(
          'Successfully reloaded cleanable tasks:',
          reloadedCleanableTasks.length
        )
        // Continuar com as tasks recarregadas
        const tasksToClean = reloadedCleanableTasks

        // Toast de início da limpeza
        const cleanToast = toast.loading('Iniciando limpeza...', {
          duration: Infinity,
          description: `${tasksToClean.length} categorias serão limpas`,
        })

        try {
          console.log('Starting cleaning process with reloaded tasks...')
          setIsCleaning(true)
          setCancelRequested(false)
          const startTime = Date.now()
          let totalSpaceCleaned = 0
          let totalFilesDeleted = 0
          let completedTasks = 0
          const errors: string[] = []
          const warningsLog: string[] = []

          // Inicializar progresso
          const totalSpaceToClean = tasksToClean.reduce(
            (sum, task) => sum + task.size,
            0
          )
          setCleaningProgress({
            totalTasks: tasksToClean.length,
            completedTasks: 0,
            totalSpaceCleaned: 0,
            totalSpaceToClean,
            speedMBps: 0,
            etaSeconds: 0,
            errors: 0,
          })

          for (const task of tasksToClean) {
            try {
              console.log(
                `Processing task: ${task.name} with ${task.items.length} items`
              )
              setCurrentTask(`Cleaning ${task.name}`)
              updateTaskStatus(task.id, { status: 'cleaning' })

              // Atualizar toast com progresso
              toast.loading(`Limpando ${task.name}...`, {
                id: cleanToast,
                description: `${completedTasks + 1}/${tasksToClean.length} - ${formatBytes(totalSpaceCleaned)} liberados`,
              })

              const warningItems = task.items.filter(item => item.warning)
              if (warningItems.length > 0) {
                const summary = warningItems
                  .map(item => {
                    const note = item.warning ? ` — ${item.warning}` : ''
                    return `${item.path}${note}`
                  })
                  .join('; ')

                warningsLog.push(`${task.name}: ${summary}`)
                console.warn(
                  '[Clean RN] Warnings detected while cleaning',
                  task.name,
                  warningItems
                )
              }

              const filePaths = task.items
                .filter(item => item.can_delete)
                .map(item => item.path)

              console.log(`Cleaning ${task.name}:`, filePaths.length, 'files')
              console.log('File paths:', filePaths)

              if (filePaths.length > 0) {
                console.log(
                  `Calling TestTauriService.cleanFiles with ${filePaths.length} files`
                )
                const result = await TestTauriService.cleanFiles(filePaths)
                console.log(`Clean result for ${task.name}:`, result)

                totalSpaceCleaned += result.space_freed
                totalFilesDeleted += result.files_deleted
                errors.push(...result.errors)

                console.log(`Cleaned ${task.name}:`, {
                  files: result.files_deleted,
                  space: result.space_freed,
                  errors: result.errors,
                })
              } else {
                console.log(`No files to clean for ${task.name}`)
              }

              updateTaskStatus(task.id, {
                status: 'completed',
                size: 0,
                items: [],
              })

              completedTasks++

              // Atualizar progresso
              const elapsedSeconds = (Date.now() - startTime) / 1000
              const speedMBps =
                elapsedSeconds > 0
                  ? totalSpaceCleaned / (1024 * 1024) / elapsedSeconds
                  : 0
              const remainingTasks = tasksToClean.length - completedTasks
              const etaSeconds =
                speedMBps > 0 && remainingTasks > 0
                  ? ((totalSpaceToClean - totalSpaceCleaned) / (1024 * 1024)) /
                    speedMBps
                  : 0

              setCleaningProgress({
                totalTasks: tasksToClean.length,
                completedTasks,
                totalSpaceCleaned,
                totalSpaceToClean,
                speedMBps,
                etaSeconds,
                errors: errors.length,
              })

              // Verificar se cancelamento foi solicitado
              if (cancelRequested) {
                console.log('Cleaning cancelled by user')
                toast.warning('Limpeza cancelada', {
                  description: `${completedTasks} de ${tasksToClean.length} categorias foram limpas`,
                  duration: 5000,
                })
                break
              }
            } catch (error) {
              console.error(`Failed to clean ${task.name}:`, error)
              setLastError(`Failed to clean ${task.name}: ${error}`)
              updateTaskStatus(task.id, { status: 'error' })
              errors.push(`Failed to clean ${task.name}: ${error}`)

              // Toast de erro específico da task
              toast.error(`Erro ao limpar ${task.name}`, {
                description: `${error}`,
              })
            }

            await new Promise(resolve => setTimeout(resolve, 500))
          }

          const duration = Date.now() - startTime

          console.log('Clean completed:', {
            totalSpaceCleaned,
            totalFilesDeleted,
            duration,
            errors,
            warnings: warningsLog,
          })

          const hasErrors = errors.length > 0
          const hasWarnings = warningsLog.length > 0
          const toastType = hasErrors || hasWarnings ? 'warning' : 'success'
          const toastTitle = hasErrors
            ? 'Limpeza concluída com avisos'
            : hasWarnings
              ? 'Limpeza concluída com avisos de sistema'
              : 'Limpeza concluída com sucesso!'
          const toastDescription = `${formatBytes(totalSpaceCleaned)} liberados • ${totalFilesDeleted} arquivos removidos • ${formatDuration(duration)}`

          toast[toastType](toastTitle, {
            id: cleanToast,
            description: toastDescription,
            duration: 7000,
          })

          if (hasErrors) {
            setTimeout(() => {
              toast.error('Alguns erros ocorreram durante a limpeza', {
                description: `${errors.length} erro(s) encontrado(s). Verifique o console para detalhes.`,
                duration: 5000,
              })
            }, 1000)
          } else if (hasWarnings) {
            setTimeout(() => {
              toast.warning('Avisos de dados do sistema registrados', {
                description: `${warningsLog.length} item(s) com aviso foram limpos. Consulte o console para detalhes.`,
                duration: 5000,
              })
            }, 1000)
          }

          const cleaningRecord: Omit<CleaningHistory, 'id' | 'created_at'> = {
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().split(' ')[0],
            space_cleaned: totalSpaceCleaned,
            files_deleted: totalFilesDeleted,
            duration: duration,
            type: tasksToClean.length > 5 ? 'deep' : 'quick',
            status: hasErrors || hasWarnings ? 'warning' : 'success',
            errors:
              hasErrors || hasWarnings
                ? [...errors, ...warningsLog].join('; ')
                : undefined,
          }

          console.log('Saving cleaning record to database:', cleaningRecord)
          const recordId = await DatabaseService.addCleaningRecord(cleaningRecord)
          console.log('Successfully saved cleaning record with ID:', recordId)

          setLastCleanResult({
            files_deleted: totalFilesDeleted,
            space_freed: totalSpaceCleaned,
            duration: duration,
            errors: errors,
            warnings: warningsLog,
          })

          // Recarregar dados após pequeno delay
          console.log('Reloading data after cleaning...')
          await new Promise(resolve => setTimeout(resolve, 100))
          await Promise.all([loadRecentHistory(), loadStats()])
          console.log('Data reloaded successfully')

          setTotalSpaceFound(0)
        } catch (error) {
          console.error('Cleaning failed:', error)
          setLastError(`Cleaning failed: ${error}`)

          // Toast de erro geral
          toast.error('Falha na limpeza do sistema', {
            id: cleanToast,
            description: `${error}`,
            duration: 5000,
          })
        } finally {
          setIsCleaning(false)
          setCurrentTask(null)
        }

        return
      }
    }

    // Toast de início da limpeza
    const cleanToast = toast.loading('Iniciando limpeza...', {
      duration: Infinity,
      description: `${cleanableTasks.length} categorias serão limpas`,
    })

    try {
      console.log('Starting cleaning process with original tasks...')
      setIsCleaning(true)
      setCancelRequested(false)
      const startTime = Date.now()
      let totalSpaceCleaned = 0
      let totalFilesDeleted = 0
      let completedTasks = 0
      const errors: string[] = []
      const warningsLog: string[] = []

      // Inicializar progresso
      const totalSpaceToClean = cleanableTasks.reduce(
        (sum, task) => sum + task.size,
        0
      )
      setCleaningProgress({
        totalTasks: cleanableTasks.length,
        completedTasks: 0,
        totalSpaceCleaned: 0,
        totalSpaceToClean,
        speedMBps: 0,
        etaSeconds: 0,
        errors: 0,
      })

      for (const task of cleanableTasks) {
        try {
          console.log(
            `Processing task: ${task.name} with ${task.items.length} items`
          )
          setCurrentTask(`Cleaning ${task.name}`)
          updateTaskStatus(task.id, { status: 'cleaning' })

      // Atualizar toast com progresso
      toast.loading(`Limpando ${task.name}...`, {
        id: cleanToast,
        description: `${completedTasks + 1}/${cleanableTasks.length} - ${formatBytes(totalSpaceCleaned)} liberados`,
      })

      const warningItems = task.items.filter(item => item.warning)
      if (warningItems.length > 0) {
        const summary = warningItems
          .map(item => {
            const note = item.warning ? ` — ${item.warning}` : ''
            return `${item.path}${note}`
          })
          .join('; ')

        warningsLog.push(`${task.name}: ${summary}`)
        console.warn(
          '[Clean RN] Warnings detected while cleaning',
          task.name,
          warningItems
        )
      }

      const filePaths = task.items
        .filter(item => item.can_delete)
        .map(item => item.path)

          console.log(`Cleaning ${task.name}:`, filePaths.length, 'files')
          console.log('File paths:', filePaths)

          if (filePaths.length > 0) {
            console.log(
              `Calling TestTauriService.cleanFiles with ${filePaths.length} files`
            )
            const result = await TestTauriService.cleanFiles(filePaths)
            console.log(`Clean result for ${task.name}:`, result)

            totalSpaceCleaned += result.space_freed
            totalFilesDeleted += result.files_deleted
            errors.push(...result.errors)

            console.log(`Cleaned ${task.name}:`, {
              files: result.files_deleted,
              space: result.space_freed,
              errors: result.errors,
            })
          } else {
            console.log(`No files to clean for ${task.name}`)
          }

          updateTaskStatus(task.id, {
            status: 'completed',
            size: 0,
            items: [],
          })

          completedTasks++

          // Atualizar progresso
          const elapsedSeconds = (Date.now() - startTime) / 1000
          const speedMBps =
            elapsedSeconds > 0
              ? totalSpaceCleaned / (1024 * 1024) / elapsedSeconds
              : 0
          const remainingTasks = cleanableTasks.length - completedTasks
          const etaSeconds =
            speedMBps > 0 && remainingTasks > 0
              ? ((totalSpaceToClean - totalSpaceCleaned) / (1024 * 1024)) /
                speedMBps
              : 0

          setCleaningProgress({
            totalTasks: cleanableTasks.length,
            completedTasks,
            totalSpaceCleaned,
            totalSpaceToClean,
            speedMBps,
            etaSeconds,
            errors: errors.length,
          })

          // Verificar se cancelamento foi solicitado
          if (cancelRequested) {
            console.log('Cleaning cancelled by user')
            toast.warning('Limpeza cancelada', {
              description: `${completedTasks} de ${cleanableTasks.length} categorias foram limpas`,
              duration: 5000,
            })
            break
          }
        } catch (error) {
          console.error(`Failed to clean ${task.name}:`, error)
          setLastError(`Failed to clean ${task.name}: ${error}`)
          updateTaskStatus(task.id, { status: 'error' })
          errors.push(`Failed to clean ${task.name}: ${error}`)

          // Toast de erro específico da task
          toast.error(`Erro ao limpar ${task.name}`, {
            description: `${error}`,
          })
        }

        await new Promise(resolve => setTimeout(resolve, 500))
      }

      const duration = Date.now() - startTime

      console.log('Clean completed:', {
        totalSpaceCleaned,
        totalFilesDeleted,
        duration,
        errors,
        warnings: warningsLog,
      })

      const hasErrors = errors.length > 0
      const hasWarnings = warningsLog.length > 0
      const toastType = hasErrors || hasWarnings ? 'warning' : 'success'
      const toastTitle = hasErrors
        ? 'Limpeza concluída com avisos'
        : hasWarnings
          ? 'Limpeza concluída com avisos de sistema'
          : 'Limpeza concluída com sucesso!'
      const toastDescription = `${formatBytes(totalSpaceCleaned)} liberados • ${totalFilesDeleted} arquivos removidos • ${formatDuration(duration)}`

      toast[toastType](toastTitle, {
        id: cleanToast,
        description: toastDescription,
        duration: 7000,
      })

      if (hasErrors) {
        setTimeout(() => {
          toast.error('Alguns erros ocorreram durante a limpeza', {
            description: `${errors.length} erro(s) encontrado(s). Verifique o console para detalhes.`,
            duration: 5000,
          })
        }, 1000)
      } else if (hasWarnings) {
        setTimeout(() => {
          toast.warning('Avisos de dados do sistema registrados', {
            description: `${warningsLog.length} item(s) com aviso foram limpos. Consulte o console para detalhes.`,
            duration: 5000,
          })
        }, 1000)
      }

      const cleaningRecord: Omit<CleaningHistory, 'id' | 'created_at'> = {
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0],
        space_cleaned: totalSpaceCleaned,
        files_deleted: totalFilesDeleted,
        duration: duration,
        type: cleanableTasks.length > 5 ? 'deep' : 'quick',
        status: hasErrors || hasWarnings ? 'warning' : 'success',
        errors:
          hasErrors || hasWarnings
            ? [...errors, ...warningsLog].join('; ')
            : undefined,
      }

      console.log('Saving cleaning record to database:', cleaningRecord)
      const recordId = await DatabaseService.addCleaningRecord(cleaningRecord)
      console.log('Successfully saved cleaning record with ID:', recordId)

      setLastCleanResult({
        files_deleted: totalFilesDeleted,
        space_freed: totalSpaceCleaned,
        duration: duration,
        errors: errors,
        warnings: warningsLog,
      })

      // Recarregar dados após pequeno delay
      console.log('Reloading data after cleaning...')
      await new Promise(resolve => setTimeout(resolve, 100))
      await Promise.all([loadRecentHistory(), loadStats()])
      console.log('Data reloaded successfully')

      setTotalSpaceFound(0)
    } catch (error) {
      console.error('Cleaning failed:', error)
      setLastError(`Cleaning failed: ${error}`)

      // Toast de erro geral
      toast.error('Falha na limpeza do sistema', {
        id: cleanToast,
        description: `${error}`,
        duration: 5000,
      })
    } finally {
      setIsCleaning(false)
      setCurrentTask(null)
    }
  }, [
    tasks,
    isCleaning,
    isScanning,
    loadRecentHistory,
    loadStats,
    totalSpaceFound,
  ])

  // Selecionar/Desmarcar todas as tasks
  const selectAllTasks = useCallback(() => {
    setTasks(prev =>
      prev.map(task => ({
        ...task,
        selected: task.status === 'found' ? true : task.selected,
      }))
    )
  }, [])

  const deselectAllTasks = useCallback(() => {
    setTasks(prev =>
      prev.map(task => ({
        ...task,
        selected: task.status === 'found' ? false : task.selected,
      }))
    )
  }, [])

  // Mostrar dialog de confirmação antes de limpar
  const handleClean = useCallback(() => {
    if (isScanning || isCleaning) return

    const cleanableTasks = tasks.filter(
      task => task.status === 'found' && task.items.length > 0 && task.selected
    )

    // Verificar se há conteúdo limpável
    const hasCleanableContent = cleanableTasks.length > 0

    if (!hasCleanableContent) {
      toast.warning('Nenhum item selecionado para limpeza', {
        description: 'Selecione pelo menos uma categoria para limpar.',
        duration: 5000,
      })
      return
    }

    // Mostrar dialog de confirmação
    setShowConfirmDialog(true)
  }, [tasks, isScanning, isCleaning])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scanning':
        return <Loader2 className="w-5 h-5 animate-spin text-warning" />
      case 'found':
        return <AlertTriangle className="w-5 h-5 text-primary" />
      case 'cleaning':
        return <Loader2 className="w-5 h-5 animate-spin text-accent" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success" />
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-danger" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-success'
      case 'idle':
        return 'text-warning'
      case 'error':
        return 'text-danger'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'idle':
        return 'Idle'
      case 'error':
        return 'Error'
      default:
        return 'Checking...'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header com stats reais */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Clean RN
            </h1>
            <p className="text-gray-400">
              Keep your React Native development environment clean and fast
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-400">
              Total Cleaned
            </p>
            <p className="text-2xl font-bold gradient-text">
              {formatBytes(stats.total_space_cleaned)}
            </p>
            <p className="text-xs text-gray-500">
              {stats.total_sessions} sessions
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          className={clsx(
            'glass-effect rounded-2xl p-6 text-left transition-all duration-200',
            !isScanning && !isCleaning
              ? 'hover:bg-primary/5 cursor-pointer'
              : 'opacity-75 cursor-not-allowed'
          )}
          onClick={handleScan}
          disabled={isScanning || isCleaning}
        >
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-full bg-primary/30">
              {isScanning ? (
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              ) : (
                <Search className="w-8 h-8 text-primary" />
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">
                {isScanning ? 'Scanning...' : 'Quick Scan'}
              </h3>
              <p className="text-gray-400 text-sm">
                {isScanning
                  ? `Scanning ${currentTask || 'system'}...`
                  : 'Scan for React Native cache and temporary files'}
              </p>
              {totalSpaceFound > 0 && (
                <p className="text-primary font-bold mt-2">
                  Found: {formatBytes(totalSpaceFound)}
                </p>
              )}
            </div>
          </div>
        </button>

        <button
          className={clsx(
            'glass-effect rounded-2xl p-6 text-left transition-all duration-200',
            !isScanning &&
              !isCleaning &&
              (totalSpaceFound > 0 ||
                tasks.some(t => t.status === 'found' && t.items.length > 0))
              ? 'hover:bg-success/5 cursor-pointer'
              : 'opacity-75 cursor-not-allowed'
          )}
          onClick={handleClean}
          disabled={
            isScanning ||
            isCleaning ||
            (totalSpaceFound === 0 &&
              !tasks.some(t => t.status === 'found' && t.items.length > 0))
          }
        >
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-full bg-success/30">
              {isCleaning ? (
                <Loader2 className="w-8 h-8 text-success animate-spin" />
              ) : (
                <Zap className="w-8 h-8 text-success" />
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">
                {isCleaning ? 'Cleaning...' : 'Clean Now'}
              </h3>
              <p className="text-gray-400 text-sm">
                {isCleaning
                  ? currentTask || 'Cleaning files...'
                  : (() => {
                      const selectedTasks = tasks.filter(
                        t => t.status === 'found' && t.items.length > 0 && t.selected
                      )
                      const selectedSize = selectedTasks.reduce(
                        (sum, t) => sum + t.size,
                        0
                      )
                      const totalFound = tasks.filter(
                        t => t.status === 'found' && t.items.length > 0
                      ).length

                      if (selectedTasks.length === 0) {
                        return totalFound > 0
                          ? 'Selecione categorias para limpar'
                          : 'Scan first to find cleanable files'
                      }

                      return `${selectedTasks.length} categoria${selectedTasks.length > 1 ? 's' : ''} selecionada${selectedTasks.length > 1 ? 's' : ''} • ${formatBytes(selectedSize)}`
                    })()}
              </p>
              {totalWarnings > 0 && !isCleaning && (
                <p className="text-xs text-warning mt-1">
                  {totalWarnings} warning{totalWarnings === 1 ? '' : 's'} flagged.
                  Review details below before cleaning.
                </p>
              )}
            </div>
          </div>
        </button>
      </div>

      {/* Last Clean Result */}
      {lastCleanResult && (
        <div className="glass-effect rounded-2xl p-6 border border-success/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-success" />
              <div>
                <h3 className="font-bold text-success">
                  Cleaning Completed!
                </h3>
                <p className="text-sm text-gray-400">
                  Freed {formatBytes(lastCleanResult.space_freed)} • Deleted{' '}
                  {lastCleanResult.files_deleted} files • Took{' '}
                  {formatDuration(lastCleanResult.duration)}
                </p>
                {lastCleanResult.warnings.length > 0 && (
                  <p className="text-xs text-warning mt-1">
                    {lastCleanResult.warnings.length} warning
                    {lastCleanResult.warnings.length === 1 ? '' : 's'} logged
                  </p>
                )}
                {lastCleanResult.errors.length > 0 && (
                  <p className="text-xs text-danger mt-1">
                    {lastCleanResult.errors.length} error
                    {lastCleanResult.errors.length === 1 ? '' : 's'} occurred
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setLastCleanResult(null)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* System Status */}
      <div className="glass-effect rounded-2xl p-6">
        <h3 className="text-lg font-semibold gradient-text mb-4">
          System Status
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">React Native</span>
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  systemStatus.reactNative === 'active'
                    ? 'bg-success'
                    : systemStatus.reactNative === 'idle'
                      ? 'bg-warning'
                      : 'bg-danger'
                }`}
              ></div>
              <span
                className={`text-sm ${getStatusColor(systemStatus.reactNative)}`}
              >
                {getStatusLabel(systemStatus.reactNative)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Metro Bundler</span>
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  systemStatus.metroBundle === 'active'
                    ? 'bg-success'
                    : systemStatus.metroBundle === 'idle'
                      ? 'bg-warning'
                      : 'bg-danger'
                }`}
              ></div>
              <span
                className={`text-sm ${getStatusColor(systemStatus.metroBundle)}`}
              >
                {getStatusLabel(systemStatus.metroBundle)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cleaning Progress */}
      {isCleaning && (
        <CleaningProgress
          isVisible={isCleaning}
          currentTask={currentTask || 'Iniciando...'}
          totalTasks={cleaningProgress.totalTasks}
          completedTasks={cleaningProgress.completedTasks}
          totalSpaceCleaned={cleaningProgress.totalSpaceCleaned}
          totalSpaceToClean={cleaningProgress.totalSpaceToClean}
          speedMBps={cleaningProgress.speedMBps}
          etaSeconds={cleaningProgress.etaSeconds}
          errors={cleaningProgress.errors}
          onCancel={() => setCancelRequested(true)}
        />
      )}

      {/* Scanning Activity */}
      {isScanning && !isCleaning && (
        <div className="glass-effect rounded-2xl p-6 border border-primary/30">
          <div className="flex items-center space-x-4">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <div>
              <h3 className="font-bold text-primary">Scanning in Progress</h3>
              <p className="text-sm text-gray-400">{currentTask}</p>
            </div>
          </div>
        </div>
      )}

      {/* Selection Controls */}
      {tasks.some(task => task.status === 'found') && (
        <div className="glass-effect rounded-xl p-4 border border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <p className="text-sm text-gray-400">
                {tasks.filter(task => task.status === 'found' && task.selected).length} de{' '}
                {tasks.filter(task => task.status === 'found').length} categorias selecionadas
              </p>
              <span className="text-sm font-medium text-primary">
                ({formatBytes(
                  tasks
                    .filter(task => task.status === 'found' && task.selected)
                    .reduce((sum, task) => sum + task.size, 0)
                )})
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={selectAllTasks}
                className="px-3 py-2 text-sm bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors border border-primary/30"
              >
                Selecionar Tudo
              </button>
              <button
                onClick={deselectAllTasks}
                className="px-3 py-2 text-sm bg-dark-surface-2 hover:bg-dark-surface text-white rounded-lg transition-colors border border-gray-600"
              >
                Desmarcar Tudo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {tasks.map(task => {
          const warningItems = task.items.filter(item => item.warning)

          return (
            <div
              key={task.id}
              className={clsx(
                'glass-effect rounded-xl p-4 border transition-all duration-200',
                task.status === 'found' && 'border-primary/50 bg-primary/5',
                task.status === 'scanning' && 'border-warning/50 bg-warning/5',
                task.status === 'cleaning' && 'border-success/50 bg-success/5',
                task.status === 'completed' && 'border-success/30 bg-success/10',
                task.status === 'error' && 'border-danger/50 bg-danger/5',
                warningItems.length > 0 && 'ring-1 ring-warning/40'
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3 flex-1">
                  {/* Checkbox for selection */}
                  {task.status === 'found' && (
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={task.selected}
                        onChange={(e) => {
                          updateTaskStatus(task.id, { selected: e.target.checked })
                        }}
                        className="w-5 h-5 rounded border-2 border-primary/50 text-primary focus:ring-2 focus:ring-primary/20 bg-dark-surface-2 cursor-pointer transition-all duration-200"
                      />
                    </label>
                  )}

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

              <div className="space-y-2">
                {task.size > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Size:</span>
                    <span className="font-medium text-primary">
                      {formatBytes(task.size)}
                    </span>
                  </div>
                )}

                {task.items.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Items:</span>
                    <span className="font-medium">{task.items.length}</span>
                  </div>
                )}

                {task.lastUpdated && (
                  <div className="text-xs text-gray-500">
                    Last scan: {task.lastUpdated.toLocaleTimeString()}
                  </div>
                )}

                {warningItems.length > 0 && (
                  <div className="mt-2 p-3 rounded-lg border border-warning/40 bg-warning/5">
                    <div className="flex items-start space-x-2 text-warning">
                      <AlertTriangle className="w-4 h-4 mt-0.5" />
                      <div className="space-y-1 w-full">
                        {warningItems.slice(0, 2).map(item => (
                          <div key={item.path} className="text-xs leading-relaxed">
                            <span className="font-medium">
                              {item.warning ?? 'Review before cleaning'}
                            </span>
                            <span
                              className="block text-warning/70 break-all"
                              title={item.path}
                            >
                              {item.path}
                              {!item.can_delete && ' • Requires manual removal'}
                            </span>
                          </div>
                        ))}
                        {warningItems.length > 2 && (
                          <p className="text-xs text-warning/80">
                            +{warningItems.length - 2} additional warning
                            {warningItems.length - 2 === 1 ? '' : 's'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent History Preview */}
      {recentHistory.length > 0 ? (
        <div className="glass-effect rounded-2xl p-6">
          <h3 className="text-lg font-semibold gradient-text mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentHistory.slice(0, 3).map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 rounded-lg bg-dark-surface-2/50"
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(record.status)}
                  <div>
                    <p className="text-sm font-medium">
                      {record.date} {record.time}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatBytes(record.space_cleaned)} •{' '}
                      {record.files_deleted} files
                    </p>
                  </div>
                </div>
                <span
                  className={clsx(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    record.type === 'quick' && 'bg-primary/20 text-primary',
                    record.type === 'deep' && 'bg-accent/20 text-accent',
                    record.type === 'custom' && 'bg-secondary/20 text-secondary'
                  )}
                >
                  {record.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass-effect rounded-2xl p-6">
          <h3 className="text-lg font-semibold gradient-text mb-4">
            Recent Activity
          </h3>
          <p className="text-gray-400 text-center py-4">
            No cleaning history yet. Perform a scan and clean to see activity here.
          </p>
        </div>
      )}

      {/* Debug Button - Fixed position */}
      <button
        className="fixed bottom-6 right-6 p-3 bg-purple-600/20 hover:bg-purple-600/30 rounded-full transition-colors border border-purple-600/50 z-40"
        onClick={() => setShowDebugPanel(true)}
        title="Open Debug Panel"
      >
        <Bug className="w-6 h-6 text-purple-400" />
      </button>

      {/* Clean Confirmation Dialog */}
      <CleanConfirmationDialog
        isVisible={showConfirmDialog}
        categories={tasks
          .filter(task => task.status === 'found' && task.items.length > 0)
          .map(task => task.name)}
        totalSize={totalSpaceFound}
        fileCount={tasks
          .filter(task => task.status === 'found' && task.items.length > 0)
          .reduce((total, task) => total + task.items.length, 0)}
        warnings={[
          ...tasks
            .filter(task => task.status === 'found' && task.items.length > 0)
            .flatMap(task =>
              task.items
                .filter(item => item.warning)
                .map(item => `${task.name}: ${item.warning}`)
            ),
          'Esta ação não pode ser desfeita',
        ]}
        onConfirm={executeClean}
        onCancel={() => setShowConfirmDialog(false)}
      />

      {/* Debug Panel */}
      <DebugPanel
        isVisible={showDebugPanel}
        onClose={() => setShowDebugPanel(false)}
        debugInfo={{
          isScanning,
          isCleaning,
          totalSpaceFound,
          tasksCount: tasks.length,
          cleanableTasks: tasks.filter(
            task => task.status === 'found' && task.items.length > 0
          ).length,
          lastError,
          tauriConnectionStatus: 'testing',
          databaseStatus: 'testing',
        }}
      />
    </div>
  )
}

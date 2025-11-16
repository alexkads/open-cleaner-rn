import { motion } from 'framer-motion'
import { AlertTriangle, Loader2, X, Zap } from 'lucide-react'
import { formatBytes } from '../services/tauri'

interface CleaningProgressProps {
  isVisible: boolean
  currentTask: string
  totalTasks: number
  completedTasks: number
  totalSpaceCleaned: number
  totalSpaceToClean: number
  speedMBps: number
  etaSeconds: number
  errors: number
  onCancel?: () => void
}

export default function CleaningProgress({
  isVisible,
  currentTask,
  totalTasks,
  completedTasks,
  totalSpaceCleaned,
  totalSpaceToClean,
  speedMBps,
  etaSeconds,
  errors,
  onCancel,
}: CleaningProgressProps) {
  if (!isVisible) return null

  const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
  const hasErrors = errors > 0

  const formatETA = (seconds: number): string => {
    if (!seconds || seconds <= 0 || !isFinite(seconds)) return 'Calculando...'
    if (seconds < 60) return `${Math.round(seconds)}s`
    const minutes = Math.floor(seconds / 60)
    const secs = Math.round(seconds % 60)
    return `${minutes}m ${secs}s`
  }

  const formatSpeed = (mbps: number): string => {
    if (!mbps || mbps <= 0 || !isFinite(mbps)) return 'Calculando...'
    if (mbps < 1) return `${(mbps * 1024).toFixed(1)} KB/s`
    return `${mbps.toFixed(1)} MB/s`
  }

  return (
    <motion.div
      className="glass-effect rounded-2xl p-6 border-2 border-primary/30 shadow-lg shadow-primary/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-primary/20">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Limpeza em Progresso</h3>
            <p className="text-sm text-gray-400">
              {completedTasks} de {totalTasks} categorias
            </p>
          </div>
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 hover:bg-danger/20 rounded-lg transition-colors border border-danger/30 group"
            title="Cancelar limpeza"
          >
            <X className="w-5 h-5 text-danger group-hover:text-danger-light" />
          </button>
        )}
      </div>

      {/* Current Task */}
      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-2">Processando:</p>
        <div className="flex items-center space-x-2 bg-dark-surface-2/50 rounded-lg p-3">
          <Zap className="w-4 h-4 text-primary animate-pulse" />
          <p className="font-medium text-white truncate">{currentTask}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-400">Progresso</span>
          <span className="text-sm font-bold text-primary">
            {percentage.toFixed(0)}%
          </span>
        </div>

        <div className="relative h-3 bg-dark-surface-2 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />

          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {/* Space Cleaned */}
        <div className="bg-success/10 border border-success/30 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Liberado</p>
          <p className="text-sm font-bold text-success">
            {formatBytes(totalSpaceCleaned)}
          </p>
        </div>

        {/* Speed */}
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Velocidade</p>
          <p className="text-sm font-bold text-primary">{formatSpeed(speedMBps)}</p>
        </div>

        {/* ETA */}
        <div className="bg-accent/10 border border-accent/30 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Tempo Restante</p>
          <p className="text-sm font-bold text-accent">{formatETA(etaSeconds)}</p>
        </div>
      </div>

      {/* Total Progress */}
      <div className="flex items-center justify-between bg-dark-surface-2/50 rounded-lg p-3">
        <span className="text-sm text-gray-400">Total a limpar:</span>
        <span className="text-sm font-bold text-white">
          {formatBytes(totalSpaceToClean)}
        </span>
      </div>

      {/* Errors */}
      {hasErrors && (
        <motion.div
          className="mt-4 flex items-center space-x-2 bg-warning/10 border border-warning/30 rounded-lg p-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />
          <p className="text-sm text-warning">
            {errors} erro{errors > 1 ? 's' : ''} encontrado{errors > 1 ? 's' : ''}
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

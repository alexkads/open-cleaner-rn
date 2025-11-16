import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, FileWarning, Trash2, X } from 'lucide-react'
import { formatBytes } from '../services/tauri'

interface CleanConfirmDialogProps {
  isVisible: boolean
  categories: string[]
  totalSize: number
  fileCount: number
  warnings: string[]
  onConfirm: () => void
  onCancel: () => void
}

export default function CleanConfirmationDialog({
  isVisible,
  categories,
  totalSize,
  fileCount,
  warnings,
  onConfirm,
  onCancel,
}: CleanConfirmDialogProps) {
  const hasWarnings = warnings.length > 0

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            className="glass-effect rounded-2xl p-8 max-w-lg w-full border-2 border-warning/30"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-full bg-warning/20">
                  <AlertTriangle className="w-7 h-7 text-warning" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Confirmar Limpeza
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Esta ação não pode ser desfeita
                  </p>
                </div>
              </div>
              <button
                onClick={onCancel}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Fechar dialog"
                title="Fechar (ESC)"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Summary */}
              <div>
                <p className="text-gray-300 mb-4">
                  Você está prestes a limpar:
                </p>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-2xl font-bold text-primary">
                      {categories.length}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {categories.length === 1 ? 'Categoria' : 'Categorias'}
                    </p>
                  </div>

                  <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <FileWarning className="w-5 h-5 text-accent" />
                    </div>
                    <p className="text-2xl font-bold text-accent">
                      {fileCount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {fileCount === 1 ? 'Arquivo' : 'Arquivos'}
                    </p>
                  </div>

                  <div className="bg-success/10 border border-success/30 rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Trash2 className="w-5 h-5 text-success" />
                    </div>
                    <p className="text-xl font-bold text-success">
                      {formatBytes(totalSize)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Espaço</p>
                  </div>
                </div>
              </div>

              {/* Categories List */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase">
                  Categorias Selecionadas
                </h3>
                <div className="bg-dark-surface-2/50 rounded-lg p-3 max-h-32 overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full border border-primary/30"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Warnings */}
              {hasWarnings && (
                <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-warning mb-2">
                        Avisos Importantes
                      </h3>
                      <ul className="space-y-1 text-sm text-warning/90">
                        {warnings.map((warning, index) => (
                          <li key={index}>• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Important Notice */}
              <div className="bg-danger/10 border border-danger/30 rounded-lg p-3">
                <p className="text-sm text-danger/90 text-center">
                  ⚠️ <strong>Atenção:</strong> Esta ação é irreversível e os
                  arquivos serão permanentemente removidos.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 mt-8">
              <button
                onClick={onCancel}
                className="flex-1 px-6 py-3 bg-dark-surface-2 hover:bg-dark-surface text-white rounded-xl transition-all duration-200 font-medium border border-gray-600 hover:border-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onConfirm()
                  onCancel()
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 text-white rounded-xl transition-all duration-200 font-medium shadow-lg shadow-success/20 hover:shadow-success/30"
              >
                ✓ Confirmar Limpeza
              </button>
            </div>

            {/* Keyboard hint */}
            <p className="text-xs text-gray-500 text-center mt-4">
              Pressione <kbd className="px-2 py-1 bg-dark-surface-2 rounded">ESC</kbd> para cancelar
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Bug, CheckCircle, Loader2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { DatabaseService } from '../services/database'
import { MockTauriService } from '../services/mock-tauri'
import { formatBytes } from '../services/tauri'

// Use MockTauriService para testes
const TestTauriService = MockTauriService

interface DebugInfo {
  isScanning: boolean
  isCleaning: boolean
  totalSpaceFound: number
  tasksCount: number
  cleanableTasks: number
  lastError?: string
  tauriConnectionStatus: 'connected' | 'disconnected' | 'testing'
  databaseStatus: 'connected' | 'disconnected' | 'testing'
}

interface DebugPanelProps {
  isVisible: boolean
  onClose: () => void
  debugInfo: DebugInfo
}

export default function DebugPanel({
  isVisible,
  onClose,
  debugInfo,
}: DebugPanelProps) {
  const [testResults, setTestResults] = useState<{
    tauri: 'pending' | 'success' | 'error'
    database: 'pending' | 'success' | 'error'
    scan: 'pending' | 'success' | 'error'
    clean: 'pending' | 'success' | 'error'
  }>({
    tauri: 'pending',
    database: 'pending',
    scan: 'pending',
    clean: 'pending',
  })

  const runDiagnostics = async () => {
    // Toast de início dos diagnósticos
    const diagnosticToast = toast.loading('Executando diagnósticos...', {
      description: 'Testando conexões e funcionalidades',
      duration: Infinity,
    })

    let successCount = 0
    let totalTests = 4

    // Test Tauri connection
    try {
      await TestTauriService.greet('Debug')
      setTestResults(prev => ({ ...prev, tauri: 'success' }))
      successCount++
    } catch (error) {
      console.error('Tauri test failed:', error)
      setTestResults(prev => ({ ...prev, tauri: 'error' }))
    }

    // Test Database connection
    try {
      await DatabaseService.init()
      setTestResults(prev => ({ ...prev, database: 'success' }))
      successCount++
    } catch (error) {
      console.error('Database test failed:', error)
      setTestResults(prev => ({ ...prev, database: 'error' }))
    }

    // Test scan function
    try {
      const result = await TestTauriService.scanExpoCache()
      console.log('Scan test result:', result)
      setTestResults(prev => ({ ...prev, scan: 'success' }))
      successCount++
    } catch (error) {
      console.error('Scan test failed:', error)
      setTestResults(prev => ({ ...prev, scan: 'error' }))
    }

    // Test clean function (mock)
    try {
      // Don't actually clean, just test if the function exists
      await TestTauriService.cleanFiles([])
      setTestResults(prev => ({ ...prev, clean: 'success' }))
      successCount++
    } catch (error) {
      console.error('Clean test failed:', error)
      setTestResults(prev => ({ ...prev, clean: 'error' }))
    }

    // Toast de resultado final
    const isAllSuccess = successCount === totalTests
    const toastType = isAllSuccess
      ? 'success'
      : successCount > 0
        ? 'warning'
        : 'error'
    const toastTitle = isAllSuccess
      ? 'Todos os testes passaram!'
      : successCount > 0
        ? 'Alguns testes falharam'
        : 'Todos os testes falharam'
    const toastDescription = `${successCount}/${totalTests} testes bem-sucedidos`

    toast[toastType](toastTitle, {
      id: diagnosticToast,
      description: toastDescription,
      duration: 5000,
    })
  }

  useEffect(() => {
    if (isVisible) {
      runDiagnostics()
    }
  }, [isVisible])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'pending':
        return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />
      default:
        return <div className="w-4 h-4 bg-gray-500 rounded-full" />
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass-effect rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Bug className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold">Debug Panel</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close debug panel"
                title="Close debug panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Current State */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-primary">
                  Current State
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <p>
                      Scanning:{' '}
                      <span
                        className={
                          debugInfo.isScanning
                            ? 'text-yellow-500'
                            : 'text-green-500'
                        }
                      >
                        {debugInfo.isScanning ? 'Yes' : 'No'}
                      </span>
                    </p>
                    <p>
                      Cleaning:{' '}
                      <span
                        className={
                          debugInfo.isCleaning
                            ? 'text-yellow-500'
                            : 'text-green-500'
                        }
                      >
                        {debugInfo.isCleaning ? 'Yes' : 'No'}
                      </span>
                    </p>
                    <p>
                      Total Space Found:{' '}
                      <span className="text-primary">
                        {formatBytes(debugInfo.totalSpaceFound)}
                      </span>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p>
                      Total Tasks:{' '}
                      <span className="text-primary">
                        {debugInfo.tasksCount}
                      </span>
                    </p>
                    <p>
                      Cleanable Tasks:{' '}
                      <span className="text-primary">
                        {debugInfo.cleanableTasks}
                      </span>
                    </p>
                    {debugInfo.lastError && (
                      <p className="text-red-500 text-xs break-all">
                        Last Error: {debugInfo.lastError}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* System Tests */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-primary">
                  System Tests
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span>Tauri Connection</span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(testResults.tauri)}
                      <span className="text-sm">{testResults.tauri}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span>Database Connection</span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(testResults.database)}
                      <span className="text-sm">{testResults.database}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span>Scan Function</span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(testResults.scan)}
                      <span className="text-sm">{testResults.scan}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span>Clean Function</span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(testResults.clean)}
                      <span className="text-sm">{testResults.clean}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-primary">
                  Debug Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={runDiagnostics}
                    className="p-3 bg-primary/20 hover:bg-primary/30 rounded-lg transition-colors text-sm"
                  >
                    Run Diagnostics
                  </button>

                  <button
                    onClick={() => {
                      console.log('Debug Info:', debugInfo)
                      console.log('Test Results:', testResults)
                    }}
                    className="p-3 bg-secondary/20 hover:bg-secondary/30 rounded-lg transition-colors text-sm"
                  >
                    Log to Console
                  </button>
                </div>
              </div>

              {/* Clean Button Analysis */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-primary">
                  Clean Button Analysis
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="font-medium mb-2">
                      Button should be enabled when:
                    </p>
                    <ul className="space-y-1 text-gray-300">
                      <li>
                        • Not scanning: {debugInfo.isScanning ? '❌' : '✅'}
                      </li>
                      <li>
                        • Not cleaning: {debugInfo.isCleaning ? '❌' : '✅'}
                      </li>
                      <li>
                        • Has space found:{' '}
                        {debugInfo.totalSpaceFound > 0 ? '✅' : '❌'}
                      </li>
                      <li>
                        • Has cleanable tasks:{' '}
                        {debugInfo.cleanableTasks > 0 ? '✅' : '❌'}
                      </li>
                    </ul>

                    <div className="mt-3 p-2 rounded bg-black/20">
                      <p className="font-medium">
                        Button Status:{' '}
                        {!debugInfo.isScanning &&
                        !debugInfo.isCleaning &&
                        (debugInfo.totalSpaceFound > 0 ||
                          debugInfo.cleanableTasks > 0) ? (
                          <span className="text-green-500">ENABLED ✅</span>
                        ) : (
                          <span className="text-red-500">DISABLED ❌</span>
                        )}
                      </p>
                    </div>

                    <div className="mt-3 p-2 rounded bg-black/20">
                      <p className="font-medium mb-1">Debug Info:</p>
                      <ul className="text-xs space-y-1">
                        <li>
                          • Total Space Found:{' '}
                          {formatBytes(debugInfo.totalSpaceFound)}
                        </li>
                        <li>• Cleanable Tasks: {debugInfo.cleanableTasks}</li>
                        <li>• Total Tasks: {debugInfo.tasksCount}</li>
                        <li>• Last Error: {debugInfo.lastError || 'None'}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Task Status Details */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-primary">
                  Task Status Details
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-white/5 rounded-lg max-h-40 overflow-y-auto">
                    <p className="font-medium mb-2">Task Breakdown:</p>
                    <div className="space-y-1 font-mono">
                      <div>
                        Total Tasks:{' '}
                        <span className="text-primary">
                          {debugInfo.tasksCount}
                        </span>
                      </div>
                      <div>
                        Space Found:{' '}
                        <span className="text-primary">
                          {formatBytes(debugInfo.totalSpaceFound)}
                        </span>
                      </div>
                      <div>
                        Cleanable:{' '}
                        <span className="text-primary">
                          {debugInfo.cleanableTasks}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        // Log detailed task info to console
                        console.log('=== TASK DEBUG FROM PANEL ===')
                        console.log('Debug Info:', debugInfo)
                        window.dispatchEvent(new CustomEvent('debug-log-tasks'))

                        // Toast informativo
                        toast.info('Logs enviados para o console', {
                          description:
                            'Pressione F12 para abrir o DevTools e ver os detalhes',
                          duration: 4000,
                        })
                      }}
                      className="mt-2 px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 rounded text-xs"
                    >
                      Log Task Details to Console
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

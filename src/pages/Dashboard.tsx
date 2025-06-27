import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Activity,
    AlertCircle,
    CheckCircle,
    Clock,
    HardDrive,
    Loader2,
    RefreshCw,
    Settings,
    Smartphone,
    Trash2,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { CleaningResult, formatBytes, formatDuration, ScanResult, TauriService } from '../services/tauri';

interface CleaningTask {
  id: string;
  name: string;
  description: string;
  path: string;
  size: number;
  status: 'pending' | 'scanning' | 'found' | 'cleaning' | 'completed' | 'error';
  type: 'expo' | 'metro' | 'ios' | 'android' | 'npm' | 'watchman' | 'cocoapods' | 'flipper' | 'temp' | 'docker_containers' | 'docker_images' | 'docker_volumes' | 'docker_cache' | 'node_modules';
  items?: ScanResult[];
  error?: string;
}

const CLEANING_TASKS: Omit<CleaningTask, 'size' | 'status' | 'items'>[] = [
  { 
    id: 'expo', 
    name: 'Expo Cache', 
    description: 'Cache de builds e assets do Expo',
    path: '~/.expo', 
    type: 'expo' 
  },
  { 
    id: 'metro', 
    name: 'Metro Bundler Cache', 
    description: 'Cache do Metro bundler (React Native)',
    path: '~/.metro', 
    type: 'metro' 
  },
  { 
    id: 'ios', 
    name: 'iOS Development Cache', 
    description: 'Xcode DerivedData, Simulador e logs iOS',
    path: '~/Library/Developer/Xcode/DerivedData', 
    type: 'ios' 
  },
  { 
    id: 'android', 
    name: 'Android Development Cache', 
    description: 'Gradle cache, emulador e builds Android',
    path: '~/.gradle/caches', 
    type: 'android' 
  },
  { 
    id: 'npm', 
    name: 'NPM/Yarn Cache', 
    description: 'Cache de pacotes npm e yarn',
    path: '~/.npm/_cacache', 
    type: 'npm' 
  },
  { 
    id: 'watchman', 
    name: 'Watchman Cache', 
    description: 'Cache e logs do Watchman (file watcher)',
    path: '~/.watchman', 
    type: 'watchman' 
  },
  { 
    id: 'cocoapods', 
    name: 'CocoaPods Cache', 
    description: 'Cache de pods e repositórios CocoaPods',
    path: '~/Library/Caches/CocoaPods', 
    type: 'cocoapods' 
  },
  { 
    id: 'flipper', 
    name: 'Flipper Logs', 
    description: 'Logs e cache do Flipper debugger',
    path: '~/.flipper', 
    type: 'flipper' 
  },
  { 
    id: 'temp', 
    name: 'Temporary Files', 
    description: 'Arquivos temporários de desenvolvimento',
    path: '/tmp/react-native-*', 
    type: 'temp' 
  },
  { 
    id: 'docker_containers', 
    name: 'Docker Containers', 
    description: 'Containers Docker parados e não utilizados',
    path: 'docker://containers', 
    type: 'docker_containers' 
  },
  { 
    id: 'docker_images', 
    name: 'Docker Images', 
    description: 'Imagens Docker órfãs e não utilizadas',
    path: 'docker://images', 
    type: 'docker_images' 
  },
  { 
    id: 'docker_volumes', 
    name: 'Docker Volumes', 
    description: 'Volumes Docker órfãos sem containers ativos',
    path: 'docker://volumes', 
    type: 'docker_volumes' 
  },
  { 
    id: 'docker_cache', 
    name: 'Docker Build Cache', 
    description: 'Cache de builds Docker e camadas intermediárias',
    path: 'docker://cache', 
    type: 'docker_cache' 
  },
];

export default function Dashboard() {
  const [tasks, setTasks] = useState<CleaningTask[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [totalSpaceFound, setTotalSpaceFound] = useState(0);
  const [totalSpaceCleaned, setTotalSpaceCleaned] = useState(0);
  const [lastCleanResult, setLastCleanResult] = useState<CleaningResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [currentTask, setCurrentTask] = useState<string | null>(null);

  // Initialize tasks
  useEffect(() => {
    const initialTasks: CleaningTask[] = CLEANING_TASKS.map(task => ({
      ...task,
      size: 0,
      status: 'pending',
      items: []
    }));
    setTasks(initialTasks);
  }, []);

  const updateTaskStatus = (taskId: string, updates: Partial<CleaningTask>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const handleQuickScan = async () => {
    setIsScanning(true);
    setTotalSpaceFound(0);
    setCurrentTask(null);

    // Reset all tasks to pending
    setTasks(prev => prev.map(task => ({ 
      ...task, 
      status: 'pending' as const, 
      size: 0, 
      items: [] 
    })));

    const scanTasks = [
      { 
        id: 'expo', 
        name: 'Expo Cache', 
        scanner: TauriService.scanExpoCache 
      },
      { 
        id: 'metro', 
        name: 'Metro Bundler Cache', 
        scanner: TauriService.scanMetroCache 
      },
      { 
        id: 'ios', 
        name: 'iOS Development Cache', 
        scanner: TauriService.scanIosCache 
      },
      { 
        id: 'android', 
        name: 'Android Development Cache', 
        scanner: TauriService.scanAndroidCache 
      },
      { 
        id: 'npm', 
        name: 'NPM/Yarn Cache', 
        scanner: TauriService.scanNpmCache 
      },
      { 
        id: 'watchman', 
        name: 'Watchman Cache', 
        scanner: TauriService.scanWatchmanCache 
      },
      { 
        id: 'cocoapods', 
        name: 'CocoaPods Cache', 
        scanner: TauriService.scanCocoaPodsCache 
      },
      { 
        id: 'flipper', 
        name: 'Flipper Logs', 
        scanner: TauriService.scanFlipperLogs 
      },
      { 
        id: 'temp', 
        name: 'Temporary Files', 
        scanner: TauriService.scanTempFiles 
      },
      { 
        id: 'docker_containers', 
        name: 'Docker Containers', 
        scanner: TauriService.scanDockerContainers 
      },
      { 
        id: 'docker_images', 
        name: 'Docker Images', 
        scanner: TauriService.scanDockerImages 
      },
      { 
        id: 'docker_volumes', 
        name: 'Docker Volumes', 
        scanner: TauriService.scanDockerVolumes 
      },
      { 
        id: 'docker_cache', 
        name: 'Docker Build Cache', 
        scanner: TauriService.scanDockerCache 
      },
    ];

    try {
      for (const scanTask of scanTasks) {
        setCurrentTask(`Scanning ${scanTask.name}...`);
        updateTaskStatus(scanTask.id, { status: 'scanning' });
        
        try {
          const results = await scanTask.scanner();
          const totalSize = results.reduce((sum, item) => sum + item.size, 0);
          
          updateTaskStatus(scanTask.id, { 
            status: totalSize > 0 ? 'found' : 'completed', 
            size: totalSize,
            items: results 
          });
          
          setTotalSpaceFound(prev => prev + totalSize);
        } catch (error) {
          updateTaskStatus(scanTask.id, { 
            status: 'error', 
            error: error instanceof Error ? error.message : `Failed to scan ${scanTask.name}` 
          });
        }

        // Add small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 300));
      }

    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      setIsScanning(false);
      setCurrentTask(null);
    }
  };

  const handleCleanSelected = async () => {
    const tasksToClean = tasks.filter(task => task.status === 'found' && task.items && task.items.length > 0);
    
    if (tasksToClean.length === 0) {
      return;
    }

    setIsCleaning(true);
    setTotalSpaceCleaned(0);

    const startTime = Date.now();
    let totalFiles = 0;
    let totalErrors: string[] = [];

    try {
      for (const task of tasksToClean) {
        setCurrentTask(`Cleaning ${task.name}...`);
        updateTaskStatus(task.id, { status: 'cleaning' });

        try {
          if (task.items && task.items.length > 0) {
            let result: CleaningResult;
            
            // Use different cleaning method for Docker resources
            if (task.type.startsWith('docker_')) {
              const dockerPaths = task.items.map(item => item.path);
              result = await TauriService.cleanDockerResources(dockerPaths);
            } else {
              const filePaths = task.items.map(item => item.path);
              result = await TauriService.cleanFiles(filePaths);
            }
            
            totalFiles += result.files_deleted;
            totalErrors = [...totalErrors, ...result.errors];
            setTotalSpaceCleaned(prev => prev + result.space_freed);
            
            updateTaskStatus(task.id, { 
              status: 'completed',
              size: 0,
              items: []
            });
          }
        } catch (error) {
          updateTaskStatus(task.id, { 
            status: 'error',
            error: error instanceof Error ? error.message : 'Failed to clean'
          });
          totalErrors.push(`Failed to clean ${task.name}: ${error}`);
        }

        // Add delay for visual feedback
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const duration = Date.now() - startTime;
      const result: CleaningResult = {
        files_deleted: totalFiles,
        space_freed: totalSpaceCleaned,
        duration,
        errors: totalErrors
      };

      setLastCleanResult(result);
      setShowResults(true);

    } catch (error) {
      console.error('Cleaning failed:', error);
    } finally {
      setIsCleaning(false);
      setCurrentTask(null);
    }
  };

  const getStatusIcon = (status: CleaningTask['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-400" />;
      case 'scanning':
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      case 'found':
        return <AlertCircle className="w-4 h-4 text-warning" />;
      case 'cleaning':
        return <Loader2 className="w-4 h-4 text-accent animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'error':
        return <X className="w-4 h-4 text-danger" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: CleaningTask['status']) => {
    switch (status) {
      case 'scanning':
      case 'cleaning':
        return 'border-primary bg-primary/10';
      case 'found':
        return 'border-warning bg-warning/10';
      case 'completed':
        return 'border-success bg-success/10';
      case 'error':
        return 'border-danger bg-danger/10';
      default:
        return 'border-gray-600 bg-gray-600/10';
    }
  };

  const foundTasks = tasks.filter(task => task.status === 'found');
  const hasItemsToClean = foundTasks.length > 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div 
          className="glass-effect rounded-2xl p-6 neon-border"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-full bg-primary/20">
              <HardDrive className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Space Found</p>
              <p className="text-2xl font-bold gradient-text">{formatBytes(totalSpaceFound)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="glass-effect rounded-2xl p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-full bg-success/20">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Space Cleaned</p>
              <p className="text-2xl font-bold text-success">{formatBytes(totalSpaceCleaned)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="glass-effect rounded-2xl p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-full bg-warning/20">
              <Smartphone className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Items Found</p>
              <p className="text-2xl font-bold text-warning">{foundTasks.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="glass-effect rounded-2xl p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-full bg-accent/20">
              <Activity className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Status</p>
              <p className="text-lg font-bold text-accent">
                {isScanning ? 'Scanning' : isCleaning ? 'Cleaning' : 'Ready'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Current Operation Status */}
      <AnimatePresence>
        {(isScanning || isCleaning) && currentTask && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-effect rounded-2xl p-6 border border-primary"
          >
            <div className="flex items-center space-x-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <div>
                <h3 className="text-lg font-bold text-primary">
                  {isScanning ? 'Scanning Environment...' : 'Cleaning Files...'}
                </h3>
                <p className="text-gray-400">{currentTask}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cleaning Tasks */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="glass-effect rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6 gradient-text">Cleaning Tasks</h3>
            <div className="space-y-4">
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  className={clsx(
                    "p-4 rounded-xl border transition-all duration-300",
                    getStatusColor(task.status)
                  )}
                  layout
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(task.status)}
                      <div>
                        <h4 className="font-medium">{task.name}</h4>
                        <p className="text-sm text-gray-400">{task.description}</p>
                        <p className="text-xs text-gray-500">{task.path}</p>
                        {task.error && (
                          <p className="text-sm text-danger mt-1">{task.error}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {task.size > 0 ? formatBytes(task.size) : '—'}
                      </p>
                      <p className="text-sm text-gray-400 capitalize">{task.status}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="space-y-4"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="glass-effect rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 gradient-text">Quick Actions</h3>
            <div className="space-y-3">
              <motion.button
                onClick={handleQuickScan}
                disabled={isScanning || isCleaning}
                className={clsx(
                  "w-full p-4 rounded-xl flex items-center space-x-3 transition-all duration-300",
                  isScanning 
                    ? "bg-primary/30 cursor-not-allowed" 
                    : "bg-primary/20 hover:bg-primary/30 neon-border"
                )}
                whileHover={!isScanning ? { scale: 1.02 } : {}}
                whileTap={!isScanning ? { scale: 0.98 } : {}}
              >
                {isScanning ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <RefreshCw className="w-5 h-5" />
                )}
                <span className="font-medium">
                  {isScanning ? 'Scanning...' : 'Quick Scan'}
                </span>
              </motion.button>

              <motion.button
                onClick={handleCleanSelected}
                disabled={!hasItemsToClean || isScanning || isCleaning}
                className={clsx(
                  "w-full p-4 rounded-xl flex items-center space-x-3 transition-all duration-300",
                  !hasItemsToClean || isScanning || isCleaning
                    ? "bg-gray-600/20 cursor-not-allowed text-gray-500"
                    : "bg-accent/20 hover:bg-accent/30 neon-border"
                )}
                whileHover={hasItemsToClean && !isScanning && !isCleaning ? { scale: 1.02 } : {}}
                whileTap={hasItemsToClean && !isScanning && !isCleaning ? { scale: 0.98 } : {}}
              >
                {isCleaning ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
                <span className="font-medium">
                  {isCleaning ? 'Cleaning...' : `Clean Selected (${foundTasks.length})`}
                </span>
              </motion.button>

              <motion.button
                className="w-full p-4 rounded-xl bg-secondary/20 hover:bg-secondary/30 flex items-center space-x-3 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Advanced Settings</span>
              </motion.button>
            </div>
          </div>

          {/* Last Clean Results */}
          {lastCleanResult && (
            <motion.div 
              className="glass-effect rounded-2xl p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h3 className="text-lg font-bold mb-4 text-success">Last Clean Results</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Files Deleted:</span>
                  <span className="font-medium">{lastCleanResult.files_deleted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Space Freed:</span>
                  <span className="font-medium text-success">{formatBytes(lastCleanResult.space_freed)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span className="font-medium">{formatDuration(lastCleanResult.duration)}</span>
                </div>
                {lastCleanResult.errors.length > 0 && (
                  <div className="mt-3 p-3 bg-danger/10 border border-danger/20 rounded-lg">
                    <p className="text-danger font-medium mb-1">Errors ({lastCleanResult.errors.length}):</p>
                    {lastCleanResult.errors.slice(0, 2).map((error, index) => (
                      <p key={index} className="text-xs text-danger/80">{error}</p>
                    ))}
                    {lastCleanResult.errors.length > 2 && (
                      <p className="text-xs text-danger/60">...and {lastCleanResult.errors.length - 2} more</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 
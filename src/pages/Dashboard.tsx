import { clsx } from 'clsx';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  HardDrive,
  Loader2,
  RefreshCw,
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

// Variantes de animação para containers
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    }
  }
};

const pulseVariants = {
  scale: [1, 1.02, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut" as const
  }
};

const glowVariants = {
  boxShadow: [
    "0 0 20px rgba(99, 102, 241, 0.3)",
    "0 0 40px rgba(99, 102, 241, 0.5)",
    "0 0 20px rgba(99, 102, 241, 0.3)"
  ],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut" as const
  }
};

export default function Dashboard() {
  const [tasks, setTasks] = useState<CleaningTask[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [totalSpaceFound, setTotalSpaceFound] = useState(0);
  const [totalSpaceCleaned, setTotalSpaceCleaned] = useState(0);
  const [lastCleanResult, setLastCleanResult] = useState<CleaningResult | null>(null);
  const [currentTask, setCurrentTask] = useState<string | null>(null);

  const scanButtonControls = useAnimation();
  const cleanButtonControls = useAnimation();

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

  // Função para animar botões durante o scan
  const animateScanButton = async () => {
    await scanButtonControls.start({
      scale: [1, 1.05, 1],
      rotate: [0, 5, -5, 0],
      transition: { duration: 0.5 }
    });
  };

  const animateCleanButton = async () => {
    await cleanButtonControls.start({
      scale: [1, 1.1, 1],
      y: [0, -5, 0],
      transition: { duration: 0.6, ease: "easeOut" as const }
    });
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Space Available Card */}
        <motion.div
          className="glass-effect rounded-2xl p-6 relative overflow-hidden"
          variants={itemVariants}
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 10px 40px rgba(59, 130, 246, 0.2)"
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
            animate={{
              x: [-100, 100],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut" as const
            }}
          />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <motion.div
                className="p-3 rounded-full bg-primary/20"
                animate={pulseVariants}
              >
                <HardDrive className="w-6 h-6 text-primary" />
              </motion.div>
              <motion.div
                className="text-right"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-sm text-gray-400">Espaço Liberável</p>
                <motion.p
                  className="text-2xl font-bold gradient-text"
                  animate={{
                    scale: totalSpaceFound > 0 ? [1, 1.1, 1] : 1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {formatBytes(totalSpaceFound)}
                </motion.p>
              </motion.div>
            </div>
            
            <motion.div
              className="w-full bg-dark-surface rounded-full h-2 overflow-hidden"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: "0%" }}
                animate={{ width: totalSpaceFound > 0 ? "75%" : "0%" }}
                transition={{ duration: 1, ease: "easeOut" as const }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="glass-effect rounded-2xl p-6"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="text-lg font-semibold gradient-text mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <motion.button
              className="w-full p-3 rounded-xl bg-primary/20 hover:bg-primary/30 neon-border flex items-center space-x-3 transition-all duration-300"
              onClick={() => {
                handleQuickScan();
                animateScanButton();
              }}
              disabled={isScanning}
              animate={scanButtonControls}
              whileHover={{ 
                scale: 1.05,
                x: 5
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={isScanning ? { rotate: 360 } : {}}
                                 transition={{
                   duration: 1,
                   repeat: isScanning ? Infinity : 0,
                   ease: "linear" as const
                 }}
              >
                {isScanning ? (
                  <Loader2 className="w-5 h-5 text-primary" />
                ) : (
                  <RefreshCw className="w-5 h-5 text-primary" />
                )}
              </motion.div>
              <span className="font-medium">
                {isScanning ? 'Escaneando...' : 'Scan Rápido'}
              </span>
            </motion.button>

            <motion.button
              className="w-full p-3 rounded-xl bg-success/20 hover:bg-success/30 border border-success/30 flex items-center space-x-3 transition-all duration-300"
              onClick={() => {
                handleCleanSelected();
                animateCleanButton();
              }}
              disabled={isCleaning || tasks.filter(t => t.status === 'found').length === 0}
              animate={cleanButtonControls}
              whileHover={{ 
                scale: 1.05,
                x: 5,
                boxShadow: "0 5px 20px rgba(34, 197, 94, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={isCleaning ? { scale: [1, 1.2, 1] } : {}}
                transition={{
                  duration: 0.8,
                  repeat: isCleaning ? Infinity : 0
                }}
              >
                <Trash2 className="w-5 h-5 text-success" />
              </motion.div>
              <span className="font-medium">
                {isCleaning ? 'Limpando...' : 'Limpar Selecionados'}
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          className="glass-effect rounded-2xl p-6"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="text-lg font-semibold gradient-text mb-4">Status do Sistema</h3>
          <div className="space-y-3">
            <motion.div
              className="flex items-center justify-between"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <span className="text-gray-400">React Native</span>
              <motion.div
                className="flex items-center space-x-2"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                <span className="text-success text-sm">Ativo</span>
              </motion.div>
            </motion.div>
            
            <motion.div
              className="flex items-center justify-between"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-gray-400">Metro Bundler</span>
              <motion.div
                className="flex items-center space-x-2"
                animate={{ x: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <div className="w-2 h-2 rounded-full bg-warning animate-pulse"></div>
                <span className="text-warning text-sm">Idle</span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Current Activity */}
      <AnimatePresence>
        {(isScanning || isCleaning) && currentTask && (
          <motion.div
            className="glass-effect rounded-2xl p-6 mb-6"
            initial={{ y: -50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -50, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="flex items-center space-x-4">
              <motion.div
                className="p-3 rounded-full bg-primary/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" as const }}
              >
                <Activity className="w-6 h-6 text-primary" />
              </motion.div>
              <div className="flex-1">
                <motion.p
                  className="font-semibold"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {isScanning ? 'Escaneando' : 'Limpando'}: {currentTask}
                </motion.p>
                <motion.div
                  className="w-full bg-dark-surface rounded-full h-1 mt-2 overflow-hidden"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut" as const
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cleaning Tasks Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            className={clsx(
              "glass-effect rounded-xl p-4 border transition-all duration-300",
              task.status === 'found' && "border-primary/50 bg-primary/5",
              task.status === 'scanning' && "border-warning/50 bg-warning/5",
              task.status === 'cleaning' && "border-success/50 bg-success/5",
              task.status === 'completed' && "border-success/30 bg-success/10",
              task.status === 'error' && "border-danger/50 bg-danger/5"
            )}
            variants={itemVariants}
            whileHover={{
              scale: 1.03,
              y: -5,
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)"
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <motion.div
                  className={clsx(
                    "p-2 rounded-lg",
                    task.type === 'expo' && "bg-purple-500/20",
                    task.type === 'metro' && "bg-blue-500/20",
                    task.type === 'ios' && "bg-gray-500/20",
                    task.type === 'android' && "bg-green-500/20",
                    task.type === 'npm' && "bg-red-500/20",
                    task.type === 'docker_containers' && "bg-cyan-500/20"
                  )}
                  animate={task.status === 'scanning' ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Smartphone className="w-4 h-4" />
                </motion.div>
                <div>
                  <motion.h3
                    className="font-medium"
                    animate={task.status === 'found' ? { color: ["#ffffff", "#6366f1", "#ffffff"] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {task.name}
                  </motion.h3>
                  <p className="text-xs text-gray-400">{task.description}</p>
                </div>
              </div>
              
              <motion.div
                animate={task.status === 'scanning' ? { rotate: 360 } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" as const }}
              >
                {getStatusIcon(task.status)}
              </motion.div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <motion.span
                className={clsx(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  getStatusColor(task.status)
                )}
                animate={task.status === 'found' ? pulseVariants : {}}
              >
                {task.status === 'pending' && 'Pendente'}
                {task.status === 'scanning' && 'Escaneando...'}
                {task.status === 'found' && `${task.items?.length || 0} items`}
                {task.status === 'cleaning' && 'Limpando...'}
                {task.status === 'completed' && 'Concluído'}
                {task.status === 'error' && 'Erro'}
              </motion.span>
              
              {task.size > 0 && (
                <motion.span
                  className="font-mono text-primary"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  {formatBytes(task.size)}
                </motion.span>
              )}
            </div>

            {task.error && (
              <motion.div
                className="mt-2 p-2 rounded bg-danger/10 border border-danger/20"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-xs text-danger">{task.error}</p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Last Clean Result */}
      <AnimatePresence>
        {lastCleanResult && (
          <motion.div
            className="glass-effect rounded-2xl p-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold gradient-text">Última Limpeza</h3>
              <motion.button
                onClick={() => setLastCleanResult(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                className="text-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
              >
                <motion.p
                  className="text-2xl font-bold text-success"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  {formatBytes(lastCleanResult.space_freed)}
                </motion.p>
                <p className="text-gray-400 text-sm">Espaço Liberado</p>
              </motion.div>
              
              <motion.div
                className="text-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <motion.p
                  className="text-2xl font-bold text-primary"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {lastCleanResult.files_deleted}
                </motion.p>
                <p className="text-gray-400 text-sm">Itens Removidos</p>
              </motion.div>
              
              <motion.div
                className="text-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <motion.p
                  className="text-2xl font-bold text-accent"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {formatDuration(lastCleanResult.duration)}
                </motion.p>
                <p className="text-gray-400 text-sm">Tempo Gasto</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
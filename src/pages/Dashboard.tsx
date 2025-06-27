import { clsx } from 'clsx';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Cpu,
  Download,
  HardDrive,
  Layers,
  Loader2,
  RotateCcw,
  Search,
  Shield,
  Smartphone,
  Trash2,
  Zap
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { CleaningHistory, DatabaseService } from '../services/database';
import { CleaningResult, formatBytes, formatDuration, ScanResult, TauriService } from '../services/tauri';

// Tipos de tarefa de limpeza
interface CleaningTask {
  id: string;
  name: string;
  description: string;
  category: 'cache' | 'logs' | 'temp' | 'build' | 'docker';
  icon: React.ComponentType<{ className?: string }>;
  scanFunction: () => Promise<ScanResult[]>;
  color: string;
  status: 'pending' | 'scanning' | 'found' | 'cleaning' | 'completed' | 'error';
  size: number;
  items: ScanResult[];
  lastUpdated?: Date;
}

// Definição das tarefas de limpeza disponíveis
const CLEANING_TASKS: Omit<CleaningTask, 'status' | 'size' | 'items'>[] = [
  {
    id: 'expo-cache',
    name: 'Expo Cache',
    description: 'Clean Expo development cache and temporary files',
    category: 'cache',
    icon: Smartphone,
    scanFunction: TauriService.scanExpoCache,
    color: 'text-blue-400'
  },
  {
    id: 'metro-cache',
    name: 'Metro Cache',
    description: 'Clean Metro bundler cache files',
    category: 'cache',
    icon: Layers,
    scanFunction: TauriService.scanMetroCache,
    color: 'text-green-400'
  },
  {
    id: 'npm-cache',
    name: 'NPM Cache',
    description: 'Clean Node.js package manager cache',
    category: 'cache',
    icon: Download,
    scanFunction: TauriService.scanNpmCache,
    color: 'text-red-400'
  },
  {
    id: 'ios-cache',
    name: 'iOS Build Cache',
    description: 'Clean iOS simulator and build artifacts',
    category: 'build',
    icon: Cpu,
    scanFunction: TauriService.scanIosCache,
    color: 'text-purple-400'
  },
  {
    id: 'android-cache',
    name: 'Android Cache',
    description: 'Clean Android build cache and temporary files',
    category: 'build',
    icon: Shield,
    scanFunction: TauriService.scanAndroidCache,
    color: 'text-yellow-400'
  },
  {
    id: 'watchman-cache',
    name: 'Watchman Logs',
    description: 'Clean Watchman file watching service logs',
    category: 'logs',
    icon: Clock,
    scanFunction: TauriService.scanWatchmanCache,
    color: 'text-orange-400'
  },
  {
    id: 'cocoapods-cache',
    name: 'CocoaPods Cache',
    description: 'Clean CocoaPods dependency cache',
    category: 'cache',
    icon: HardDrive,
    scanFunction: TauriService.scanCocoaPodsCache,
    color: 'text-pink-400'
  },
  {
    id: 'flipper-logs',
    name: 'Flipper Logs',
    description: 'Clean Flipper debugging tool logs',
    category: 'logs',
    icon: AlertTriangle,
    scanFunction: TauriService.scanFlipperLogs,
    color: 'text-cyan-400'
  },
  {
    id: 'temp-files',
    name: 'Temp Files',
    description: 'Clean system temporary files',
    category: 'temp',
    icon: Trash2,
    scanFunction: TauriService.scanTempFiles,
    color: 'text-gray-400'
  }
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

const pulseAnimation = {
  scale: [1, 1.02, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut" as const
  }
};

const glowAnimation = {
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
  const [systemStatus, setSystemStatus] = useState({
    reactNative: 'checking',
    metroBundle: 'checking'
  });
  const [recentHistory, setRecentHistory] = useState<CleaningHistory[]>([]);
  const [stats, setStats] = useState({
    total_space_cleaned: 0,
    total_sessions: 0,
    avg_duration: 0
  });

  const scanButtonControls = useAnimation();
  const cleanButtonControls = useAnimation();

  // Inicializar componente
  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    try {
      // Inicializar banco de dados
      await DatabaseService.init();
      
      // Carregar dados paralelos
      await Promise.all([
        loadTasks(),
        loadRecentHistory(),
        loadStats(),
        checkSystemStatus()
      ]);
    } catch (error) {
      console.error('Failed to initialize dashboard:', error);
    }
  };

  const loadTasks = () => {
    const initialTasks: CleaningTask[] = CLEANING_TASKS.map(task => ({
      ...task,
      size: 0,
      status: 'pending',
      items: []
    }));
    setTasks(initialTasks);
  };

  const loadRecentHistory = async () => {
    try {
      const history = await DatabaseService.getCleaningHistory(5);
      setRecentHistory(history);
    } catch (error) {
      console.error('Failed to load recent history:', error);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await DatabaseService.getCleaningStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const checkSystemStatus = async () => {
    try {
      // Simular verificação de status do sistema
      // Em uma implementação real, isso verificaria se os serviços estão rodando
      setSystemStatus({
        reactNative: Math.random() > 0.5 ? 'active' : 'idle',
        metroBundle: Math.random() > 0.3 ? 'active' : 'idle'
      });
    } catch (error) {
      console.error('Failed to check system status:', error);
      setSystemStatus({
        reactNative: 'error',
        metroBundle: 'error'
      });
    }
  };

  const updateTaskStatus = (taskId: string, updates: Partial<CleaningTask>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates, lastUpdated: new Date() } : task
    ));
  };

  const handleScan = useCallback(async () => {
    if (isScanning || isCleaning) return;
    
    try {
      setIsScanning(true);
      setTotalSpaceFound(0);
      
      await scanButtonControls.start({
        scale: [1, 1.1, 1],
        rotate: [0, 360],
        transition: { duration: 0.8 }
      });

      // Reset task status
      setTasks(prev => prev.map(task => ({ 
        ...task, 
        status: 'pending', 
        size: 0, 
        items: [] 
      })));

      let totalFound = 0;
      
      // Scan each task
      for (const task of CLEANING_TASKS) {
        try {
          setCurrentTask(task.name);
          updateTaskStatus(task.id, { status: 'scanning' });
          
          const results = await task.scanFunction();
          const taskSize = results.reduce((sum, item) => sum + item.size, 0);
          
          updateTaskStatus(task.id, {
            status: taskSize > 0 ? 'found' : 'completed',
            size: taskSize,
            items: results
          });
          
          totalFound += taskSize;
          setTotalSpaceFound(totalFound);
          
        } catch (error) {
          console.error(`Failed to scan ${task.name}:`, error);
          updateTaskStatus(task.id, { status: 'error' });
        }
        
        // Pequena pausa para UX
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      setIsScanning(false);
      setCurrentTask(null);
    }
  }, [isScanning, isCleaning, scanButtonControls]);

  const handleClean = useCallback(async () => {
    if (isScanning || isCleaning) return;
    
    const cleanableTasks = tasks.filter(task => 
      task.status === 'found' && task.items.length > 0
    );
    
    if (cleanableTasks.length === 0) {
      alert('No items found to clean. Please scan first.');
      return;
    }
    
    try {
      setIsCleaning(true);
      const startTime = Date.now();
      let totalSpaceCleaned = 0;
      let totalFilesDeleted = 0;
      const errors: string[] = [];
      
      await cleanButtonControls.start({
        scale: [1, 1.2, 1],
        rotate: [0, -360],
        transition: { duration: 0.8 }
      });

      for (const task of cleanableTasks) {
        try {
          setCurrentTask(`Cleaning ${task.name}`);
          updateTaskStatus(task.id, { status: 'cleaning' });
          
          const filePaths = task.items
            .filter(item => item.can_delete)
            .map(item => item.path);
          
          if (filePaths.length > 0) {
            const result = await TauriService.cleanFiles(filePaths);
            totalSpaceCleaned += result.space_freed;
            totalFilesDeleted += result.files_deleted;
            errors.push(...result.errors);
          }
          
          updateTaskStatus(task.id, { 
            status: 'completed',
            size: 0,
            items: []
          });
          
        } catch (error) {
          console.error(`Failed to clean ${task.name}:`, error);
          updateTaskStatus(task.id, { status: 'error' });
          errors.push(`Failed to clean ${task.name}: ${error}`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      const duration = Date.now() - startTime;
      
      // Salvar resultado no banco de dados
      const cleaningRecord: Omit<CleaningHistory, 'id' | 'created_at'> = {
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0],
        space_cleaned: totalSpaceCleaned,
        files_deleted: totalFilesDeleted,
        duration: duration,
        type: cleanableTasks.length > 5 ? 'deep' : 'quick',
        status: errors.length > 0 ? 'warning' : 'success',
        errors: errors.length > 0 ? errors.join('; ') : undefined
      };
      
      await DatabaseService.addCleaningRecord(cleaningRecord);
      
      // Atualizar resultado para exibição
      setLastCleanResult({
        files_deleted: totalFilesDeleted,
        space_freed: totalSpaceCleaned,
        duration: duration,
        errors: errors
      });
      
      // Recarregar dados
      await Promise.all([
        loadRecentHistory(),
        loadStats()
      ]);
      
      setTotalSpaceFound(0);
      
    } catch (error) {
      console.error('Cleaning failed:', error);
    } finally {
      setIsCleaning(false);
      setCurrentTask(null);
    }
  }, [tasks, isCleaning, isScanning, cleanButtonControls]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scanning':
        return <Loader2 className="w-5 h-5 animate-spin text-warning" />;
      case 'found':
        return <AlertTriangle className="w-5 h-5 text-primary" />;
      case 'cleaning':
        return <Loader2 className="w-5 h-5 animate-spin text-accent" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-danger" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-success';
      case 'idle':
        return 'text-warning';
      case 'error':
        return 'text-danger';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'idle':
        return 'Idle';
      case 'error':
        return 'Error';
      default:
        return 'Checking...';
    }
  };

  return (
    <motion.div
      className="p-6 space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header com stats reais */}
      <motion.div 
        className="glass-effect rounded-2xl p-6 relative overflow-hidden"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10"
          animate={{
            x: [-100, 100, -100],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut" as const
          }}
        />
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <motion.h1 
              className="text-3xl font-bold gradient-text mb-2"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Clean RN
            </motion.h1>
            <motion.p 
              className="text-gray-400"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Keep your React Native development environment clean and fast
            </motion.p>
          </div>
          
          <div className="text-right">
            <motion.p 
              className="text-sm text-gray-400"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Total Cleaned
            </motion.p>
            <motion.p 
              className="text-2xl font-bold gradient-text"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {formatBytes(stats.total_space_cleaned)}
            </motion.p>
            <motion.p 
              className="text-xs text-gray-500"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {stats.total_sessions} sessions
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        variants={containerVariants}
      >
        <motion.button
          className={clsx(
            "glass-effect rounded-2xl p-6 text-left transition-all duration-300 relative overflow-hidden",
            !isScanning && !isCleaning 
              ? "hover:scale-105 neon-border cursor-pointer" 
              : "opacity-75 cursor-not-allowed"
          )}
          variants={itemVariants}
          onClick={handleScan}
          disabled={isScanning || isCleaning}
          animate={scanButtonControls}
                     whileHover={!isScanning && !isCleaning ? glowAnimation : {}}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20"
            animate={{
              opacity: isScanning ? [0.5, 0.8, 0.5] : 0.5,
              scale: isScanning ? [1, 1.05, 1] : 1
            }}
            transition={{
              duration: 2,
              repeat: isScanning ? Infinity : 0,
              ease: "easeInOut" as const
            }}
          />
          
          <div className="relative z-10 flex items-center space-x-4">
            <motion.div
              className="p-4 rounded-full bg-primary/30"
              animate={isScanning ? { rotate: 360 } : {}}
              transition={{ duration: 2, repeat: isScanning ? Infinity : 0, ease: "linear" as const }}
            >
              <Search className="w-8 h-8 text-primary" />
            </motion.div>
            
            <div>
              <h3 className="text-xl font-bold mb-2">
                {isScanning ? 'Scanning...' : 'Quick Scan'}
              </h3>
              <p className="text-gray-400 text-sm">
                {isScanning 
                  ? `Scanning ${currentTask || 'system'}...`
                  : 'Scan for React Native cache and temporary files'
                }
              </p>
              {totalSpaceFound > 0 && (
                <motion.p 
                  className="text-primary font-bold mt-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Found: {formatBytes(totalSpaceFound)}
                </motion.p>
              )}
            </div>
          </div>
        </motion.button>

        <motion.button
          className={clsx(
            "glass-effect rounded-2xl p-6 text-left transition-all duration-300 relative overflow-hidden",
            !isScanning && !isCleaning && totalSpaceFound > 0
              ? "hover:scale-105 neon-border cursor-pointer" 
              : "opacity-75 cursor-not-allowed"
          )}
          variants={itemVariants}
          onClick={handleClean}
          disabled={isScanning || isCleaning || totalSpaceFound === 0}
          animate={cleanButtonControls}
                     whileHover={!isScanning && !isCleaning && totalSpaceFound > 0 ? glowAnimation : {}}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-success/20 to-accent/20"
            animate={{
              opacity: isCleaning ? [0.5, 0.8, 0.5] : 0.5,
              scale: isCleaning ? [1, 1.05, 1] : 1
            }}
            transition={{
              duration: 2,
              repeat: isCleaning ? Infinity : 0,
              ease: "easeInOut" as const
            }}
          />
          
          <div className="relative z-10 flex items-center space-x-4">
            <motion.div
              className="p-4 rounded-full bg-success/30"
              animate={isCleaning ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 1, repeat: isCleaning ? Infinity : 0 }}
            >
              <Zap className="w-8 h-8 text-success" />
            </motion.div>
            
            <div>
              <h3 className="text-xl font-bold mb-2">
                {isCleaning ? 'Cleaning...' : 'Clean Now'}
              </h3>
              <p className="text-gray-400 text-sm">
                {isCleaning 
                  ? currentTask || 'Cleaning files...'
                  : totalSpaceFound > 0 
                    ? `Ready to clean ${formatBytes(totalSpaceFound)}`
                    : 'Scan first to find cleanable files'
                }
              </p>
            </div>
          </div>
        </motion.button>
      </motion.div>

      {/* Last Clean Result */}
      <AnimatePresence>
        {lastCleanResult && (
          <motion.div
            className="glass-effect rounded-2xl p-6 border border-success/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            variants={itemVariants}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-success" />
                <div>
                  <h3 className="font-bold text-success">Cleaning Completed!</h3>
                  <p className="text-sm text-gray-400">
                    Freed {formatBytes(lastCleanResult.space_freed)} • 
                    Deleted {lastCleanResult.files_deleted} files • 
                    Took {formatDuration(lastCleanResult.duration)}
                  </p>
                  {lastCleanResult.errors.length > 0 && (
                    <p className="text-xs text-warning mt-1">
                      {lastCleanResult.errors.length} warnings occurred
                    </p>
                  )}
                </div>
              </div>
              
              <motion.button
                onClick={() => setLastCleanResult(null)}
                className="p-2 rounded-lg hover:bg-white/10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <RotateCcw className="w-5 h-5 text-gray-400" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* System Status com dados reais */}
      <motion.div
        className="glass-effect rounded-2xl p-6"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
      >
        <h3 className="text-lg font-semibold gradient-text mb-4">System Status</h3>
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
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                systemStatus.reactNative === 'active' ? 'bg-success' :
                systemStatus.reactNative === 'idle' ? 'bg-warning' : 'bg-danger'
              }`}></div>
              <span className={`text-sm ${getStatusColor(systemStatus.reactNative)}`}>
                {getStatusLabel(systemStatus.reactNative)}
              </span>
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
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                systemStatus.metroBundle === 'active' ? 'bg-success' :
                systemStatus.metroBundle === 'idle' ? 'bg-warning' : 'bg-danger'
              }`}></div>
              <span className={`text-sm ${getStatusColor(systemStatus.metroBundle)}`}>
                {getStatusLabel(systemStatus.metroBundle)}
              </span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Current Activity */}
      <AnimatePresence>
        {(isScanning || isCleaning) && (
          <motion.div
            className="glass-effect rounded-2xl p-6 border border-primary/30"
                         initial={{ opacity: 0, scale: 0.9 }}
             animate={{ 
               opacity: 1,
               ...pulseAnimation
             }}
             exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex items-center space-x-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" as const }}
              >
                <Loader2 className="w-6 h-6 text-primary" />
              </motion.div>
              
              <div>
                <h3 className="font-bold text-primary">
                  {isScanning ? 'Scanning in Progress' : 'Cleaning in Progress'}
                </h3>
                <p className="text-sm text-gray-400">{currentTask}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasks Grid */}
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
                  className="p-2 rounded-lg bg-dark-surface-2"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <task.icon className={clsx("w-5 h-5", task.color)} />
                </motion.div>
                <div>
                  <h3 className="font-medium">{task.name}</h3>
                  <p className="text-xs text-gray-400">{task.description}</p>
                </div>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.2 }}
              >
                {getStatusIcon(task.status)}
              </motion.div>
            </div>
            
            <div className="space-y-2">
              {task.size > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-400">Size:</span>
                  <span className="font-medium text-primary">{formatBytes(task.size)}</span>
                </motion.div>
              )}
              
              {task.items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-400">Items:</span>
                  <span className="font-medium">{task.items.length}</span>
                </motion.div>
              )}
              
              {task.lastUpdated && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-gray-500"
                >
                  Last scan: {task.lastUpdated.toLocaleTimeString()}
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent History Preview */}
      {recentHistory.length > 0 && (
        <motion.div
          className="glass-effect rounded-2xl p-6"
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold gradient-text mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentHistory.slice(0, 3).map((record, index) => (
              <motion.div
                key={record.id}
                className="flex items-center justify-between p-3 rounded-lg bg-dark-surface-2/50"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(record.status)}
                  <div>
                    <p className="text-sm font-medium">{record.date} {record.time}</p>
                    <p className="text-xs text-gray-400">
                      {formatBytes(record.space_cleaned)} • {record.files_deleted} files
                    </p>
                  </div>
                </div>
                <span className={clsx(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  record.type === 'quick' && "bg-primary/20 text-primary",
                  record.type === 'deep' && "bg-accent/20 text-accent",
                  record.type === 'custom' && "bg-secondary/20 text-secondary"
                )}>
                  {record.type}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
} 
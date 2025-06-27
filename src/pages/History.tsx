import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Filter,
  HardDrive,
  Sparkles,
  Trash2,
  TrendingUp
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CleaningHistory, DatabaseService } from '../services/database';
import { formatBytes, formatDuration } from '../services/tauri';

// Variantes de animação
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 20
    }
  }
};

const sparkleVariants = {
  animate: {
    rotate: [0, 180, 360],
    scale: [1, 1.2, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
};

// Converter CleaningHistory para formato compatível com a UI
const convertToUIFormat = (record: CleaningHistory) => ({
  id: record.id!,
  date: record.date,
  time: record.time,
  spaceCleaned: formatBytes(record.space_cleaned),
  filesDeleted: record.files_deleted,
  duration: formatDuration(record.duration),
  type: record.type,
  status: record.status
});

export default function History() {
  const [filter, setFilter] = useState<'all' | 'quick' | 'deep' | 'custom'>('all');
  const [records, setRecords] = useState<CleaningHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_space_cleaned: 0,
    total_files_deleted: 0,
    total_sessions: 0,
    avg_duration: 0
  });
  const [selectedRecord, setSelectedRecord] = useState<CleaningHistory | null>(null);

  // Carregar dados do banco de dados
  useEffect(() => {
    loadHistoryData();
  }, []);

  const loadHistoryData = async () => {
    try {
      setLoading(true);
      await DatabaseService.init();
      
      const [historyData, statsData] = await Promise.all([
        DatabaseService.getCleaningHistory(),
        DatabaseService.getCleaningStats()
      ]);
      
      setRecords(historyData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load history data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = filter === 'all' 
    ? records 
    : records.filter(record => record.type === filter);

  const handleDeleteRecord = async (id: number) => {
    try {
      await DatabaseService.deleteCleaningRecord(id);
      await loadHistoryData(); // Recarregar dados
    } catch (error) {
      console.error('Failed to delete record:', error);
    }
  };

  const handleExportHistory = async () => {
    try {
      const allHistory = await DatabaseService.exportHistory();
      
      // Criar e baixar arquivo JSON
      const dataStr = JSON.stringify(allHistory, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `clean-rn-history-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export history:', error);
    }
  };

  // Preparar dados do gráfico baseados nos dados reais
  const chartData = records
    .slice(-7) // Últimos 7 registros
    .map(record => ({
      date: record.date.split('-').slice(1).join('/'), // MM/dd format
      space: Math.round(record.space_cleaned / (1024 * 1024)) // Convert to MB
    }))
    .reverse();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-danger" />;
      default:
        return <CheckCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'quick':
        return 'bg-primary/20 text-primary border border-primary/30';
      case 'deep':
        return 'bg-accent/20 text-accent border border-accent/30';
      case 'custom':
        return 'bg-secondary/20 text-secondary border border-secondary/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <motion.div
          className="flex items-center space-x-3"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400">Loading history...</span>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="p-6 space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header com funcionalidade real de export */}
      <motion.div 
        className="glass-effect rounded-2xl p-6 relative overflow-hidden"
        variants={itemVariants}
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)"
        }}
        transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
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
              Cleaning History
            </motion.h1>
            <motion.p 
              className="text-gray-400"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Track your React Native environment cleanup activities
            </motion.p>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.div
              variants={sparkleVariants}
              animate="animate"
              className="p-2"
            >
              <Sparkles className="w-6 h-6 text-accent" />
            </motion.div>
            
            <motion.button 
              className="p-3 rounded-xl bg-primary/20 hover:bg-primary/30 neon-border"
              onClick={handleExportHistory}
              whileHover={{ 
                scale: 1.05,
                rotate: 5,
                boxShadow: "0 10px 30px rgba(99, 102, 241, 0.3)"
              }}
              whileTap={{ scale: 0.95, rotate: -5 }}
              transition={{ type: "spring" as const, stiffness: 400, damping: 15 }}
            >
              <Download className="w-6 h-6 text-primary" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview com dados reais */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        variants={containerVariants}
      >
        <motion.div 
          className="glass-effect rounded-2xl p-6 relative overflow-hidden"
          variants={itemVariants}
          whileHover={{
            scale: 1.03,
            boxShadow: "0 15px 35px rgba(99, 102, 241, 0.2)"
          }}
          transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
        >
          <motion.div
            className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-primary/10"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut" as const
            }}
          />
          
          <div className="relative z-10 flex items-center space-x-3">
            <motion.div 
              className="p-3 rounded-full bg-primary/20"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.3 }}
            >
              <HardDrive className="w-6 h-6 text-primary" />
            </motion.div>
            <div>
              <p className="text-gray-400 text-sm">Total Cleaned</p>
              <motion.p 
                className="text-2xl font-bold gradient-text"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" as const }}
              >
                {formatBytes(stats.total_space_cleaned)}
              </motion.p>
            </div>
          </div>
          
          <motion.div
            className="mt-4 w-full bg-dark-surface rounded-full h-2 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: stats.total_space_cleaned > 0 ? 0.7 : 0 }}
              transition={{ duration: 1.5, ease: "easeOut" as const }}
            />
          </motion.div>
        </motion.div>

        <motion.div 
          className="glass-effect rounded-2xl p-6 relative overflow-hidden"
          variants={itemVariants}
          whileHover={{
            scale: 1.03,
            boxShadow: "0 15px 35px rgba(34, 197, 94, 0.2)"
          }}
          transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
        >
          <motion.div
            className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-success/10"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [360, 180, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut" as const
            }}
          />
          
          <div className="relative z-10 flex items-center space-x-3">
            <motion.div 
              className="p-3 rounded-full bg-success/20"
              whileHover={{ scale: 1.1, rotate: -360 }}
              transition={{ duration: 0.5 }}
            >
              <CheckCircle className="w-6 h-6 text-success" />
            </motion.div>
            <div>
              <p className="text-gray-400 text-sm">Clean Sessions</p>
              <motion.p 
                className="text-2xl font-bold text-success"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring" as const }}
              >
                {stats.total_sessions}
              </motion.p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="glass-effect rounded-2xl p-6 relative overflow-hidden"
          variants={itemVariants}
          whileHover={{
            scale: 1.03,
            boxShadow: "0 15px 35px rgba(245, 158, 11, 0.2)"
          }}
          transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
        >
          <motion.div
            className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-accent/10"
            animate={{
              scale: [1, 1.1, 1.2, 1],
              rotate: [0, 90, 180, 270, 360]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut" as const
            }}
          />
          
          <div className="relative z-10 flex items-center space-x-3">
            <motion.div 
              className="p-3 rounded-full bg-accent/20"
              whileHover={{ scale: 1.1, rotate: 180 }}
              transition={{ duration: 0.4 }}
            >
              <Clock className="w-6 h-6 text-accent" />
            </motion.div>
            <div>
              <p className="text-gray-400 text-sm">Avg Duration</p>
              <motion.p 
                className="text-2xl font-bold text-accent"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring" as const }}
              >
                {formatDuration(stats.avg_duration)}
              </motion.p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Gráfico com dados reais */}
      {chartData.length > 0 && (
        <motion.div 
          className="glass-effect rounded-2xl p-6"
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center justify-between mb-6">
            <motion.h3 
              className="text-xl font-bold gradient-text"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Cleaning Trends
            </motion.h3>
            
            <motion.div
              className="flex items-center space-x-2 text-accent"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Last 7 sessions</span>
            </motion.div>
          </div>
          
          <motion.div
            className="h-64"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(16px)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="space" 
                  stroke="#6366F1" 
                  strokeWidth={3}
                  dot={{ fill: '#6366F1', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#6366F1', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>
      )}

      {/* Lista de registros com funcionalidade real de delete */}
      <motion.div 
        className="glass-effect rounded-2xl p-6"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold gradient-text">Recent Activity</h3>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <div className="flex space-x-2">
              {(['all', 'quick', 'deep', 'custom'] as const).map((filterType) => (
                <motion.button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={clsx(
                    "px-3 py-1 rounded-full text-sm font-medium transition-all duration-300",
                    filter === filterType
                      ? "bg-primary text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={filter === filterType ? { 
                    boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)" 
                  } : {}}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <motion.div 
          className="space-y-3"
          variants={containerVariants}
        >
          <AnimatePresence mode="wait">
            {filteredRecords.length === 0 ? (
              <motion.div
                className="text-center py-8 text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {records.length === 0 ? (
                  <>
                    <div className="mb-2">No cleaning history found</div>
                    <div className="text-sm">Start cleaning to see your history here</div>
                  </>
                ) : (
                  `No ${filter} cleaning sessions found`
                )}
              </motion.div>
            ) : (
              filteredRecords.map((record, index) => {
                const uiRecord = convertToUIFormat(record);
                return (
                  <motion.div
                    key={record.id}
                    className="p-4 rounded-xl bg-dark-surface/50 border border-dark-border hover:border-primary/30 transition-all duration-300 cursor-pointer"
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.02,
                      x: 10,
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedRecord(record)}
                    layout
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{ duration: 0.3 }}
                        >
                          {getStatusIcon(record.status)}
                        </motion.div>
                        
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium">{record.date}</span>
                            <span className="text-gray-400 text-sm">{record.time}</span>
                            <motion.span
                              className={clsx(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                getTypeColor(record.type)
                              )}
                              whileHover={{ scale: 1.1 }}
                            >
                              {record.type}
                            </motion.span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>{uiRecord.spaceCleaned} freed</span>
                            <span>{record.files_deleted} files</span>
                            <span>{uiRecord.duration}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <motion.div
                          className="text-right"
                          whileHover={{ scale: 1.1 }}
                        >
                          <p className="font-bold text-primary">{uiRecord.spaceCleaned}</p>
                          <p className="text-xs text-gray-400">{record.files_deleted} items</p>
                        </motion.div>
                        
                        <motion.button
                          className="p-2 rounded-lg bg-danger/20 hover:bg-danger/30 transition-all duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRecord(record.id!);
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="w-4 h-4 text-danger" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Modal de detalhes */}
      <AnimatePresence>
        {selectedRecord && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRecord(null)}
          >
            <motion.div
              className="glass-effect rounded-2xl p-6 max-w-md w-full mx-4"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold gradient-text mb-4">Cleaning Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Date:</span>
                  <span>{selectedRecord.date} {selectedRecord.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className={getTypeColor(selectedRecord.type).split(' ')[1]}>
                    {selectedRecord.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Space Cleaned:</span>
                  <span className="text-success font-bold">{formatBytes(selectedRecord.space_cleaned)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Files Deleted:</span>
                  <span>{selectedRecord.files_deleted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span>{formatDuration(selectedRecord.duration)}</span>
                </div>
                {selectedRecord.errors && (
                  <div className="pt-3 border-t border-dark-border">
                    <span className="text-danger text-sm">Errors:</span>
                    <p className="text-xs text-gray-400 mt-1">{selectedRecord.errors}</p>
                  </div>
                )}
              </div>
              
              <motion.button
                onClick={() => setSelectedRecord(null)}
                className="w-full mt-6 p-3 rounded-xl bg-primary/20 hover:bg-primary/30 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    Download,
    Filter,
    HardDrive,
    Trash2
} from 'lucide-react';
import { useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface CleaningRecord {
  id: number;
  date: string;
  time: string;
  spaceCleaned: string;
  filesDeleted: number;
  duration: string;
  type: 'quick' | 'deep' | 'custom';
  status: 'success' | 'warning' | 'error';
}

const mockHistory: CleaningRecord[] = [
  {
    id: 1,
    date: '2024-01-15',
    time: '14:30',
    spaceCleaned: '2.3 GB',
    filesDeleted: 1250,
    duration: '2m 15s',
    type: 'quick',
    status: 'success'
  },
  {
    id: 2,
    date: '2024-01-14',
    time: '09:15',
    spaceCleaned: '856 MB',
    filesDeleted: 432,
    duration: '1m 45s',
    type: 'deep',
    status: 'success'
  },
  {
    id: 3,
    date: '2024-01-13',
    time: '16:20',
    spaceCleaned: '423 MB',
    filesDeleted: 89,
    duration: '45s',
    type: 'custom',
    status: 'warning'
  },
  {
    id: 4,
    date: '2024-01-12',
    time: '11:05',
    spaceCleaned: '1.8 GB',
    filesDeleted: 987,
    duration: '3m 20s',
    type: 'deep',
    status: 'success'
  },
  {
    id: 5,
    date: '2024-01-11',
    time: '08:30',
    spaceCleaned: '156 MB',
    filesDeleted: 34,
    duration: '30s',
    type: 'quick',
    status: 'error'
  }
];

const chartData = [
  { date: '11/01', space: 156 },
  { date: '12/01', space: 1800 },
  { date: '13/01', space: 423 },
  { date: '14/01', space: 856 },
  { date: '15/01', space: 2300 },
];

export default function History() {
  const [filter, setFilter] = useState<'all' | 'quick' | 'deep' | 'custom'>('all');
  const [records, _setRecords] = useState<CleaningRecord[]>(mockHistory);

  const filteredRecords = filter === 'all' 
    ? records 
    : records.filter(record => record.type === filter);

  const totalSpaceCleaned = records.reduce((total, record) => {
    const size = parseFloat(record.spaceCleaned);
    const unit = record.spaceCleaned.includes('GB') ? 1024 : 1;
    return total + (size * unit);
  }, 0);

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
        return 'bg-primary/20 text-primary';
      case 'deep':
        return 'bg-accent/20 text-accent';
      case 'custom':
        return 'bg-secondary/20 text-secondary';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div 
        className="glass-effect rounded-2xl p-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Cleaning History</h1>
            <p className="text-gray-400">Track your React Native environment cleanup activities</p>
          </div>
          <motion.button 
            className="p-3 rounded-xl bg-primary/20 hover:bg-primary/30 neon-border"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-6 h-6 text-primary" />
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          className="glass-effect rounded-2xl p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-full bg-primary/20">
              <HardDrive className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Cleaned</p>
              <p className="text-2xl font-bold gradient-text">{(totalSpaceCleaned / 1024).toFixed(1)} GB</p>
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
              <p className="text-gray-400 text-sm">Clean Sessions</p>
              <p className="text-2xl font-bold text-success">{records.length}</p>
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
            <div className="p-3 rounded-full bg-accent/20">
              <Clock className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Avg Duration</p>
              <p className="text-2xl font-bold text-accent">1m 51s</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chart */}
      <motion.div 
        className="glass-effect rounded-2xl p-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl font-bold mb-4 gradient-text">Space Cleaned Over Time</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3a3a4a" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a24', 
                  border: '1px solid #00d2ff',
                  borderRadius: '8px'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="space" 
                stroke="#00d2ff" 
                strokeWidth={3}
                dot={{ fill: '#00d2ff', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#00d2ff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Filter and Records */}
      <motion.div 
        className="glass-effect rounded-2xl p-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold gradient-text">Recent Activities</h3>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
                         <select 
               value={filter}
               onChange={(e) => setFilter(e.target.value as any)}
               className="bg-dark-surface-2 border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
               title="Filter cleaning history by type"
             >
              <option value="all">All Types</option>
              <option value="quick">Quick Clean</option>
              <option value="deep">Deep Clean</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredRecords.map((record, index) => (
            <motion.div 
              key={record.id}
              className="flex items-center justify-between p-4 rounded-lg bg-dark-surface-2 border border-dark-border hover:border-primary/50 transition-all duration-300"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="flex items-center space-x-4">
                {getStatusIcon(record.status)}
                <div>
                  <div className="flex items-center space-x-3">
                    <p className="font-medium">{record.date} at {record.time}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(record.type)}`}>
                      {record.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Cleaned {record.spaceCleaned} • {record.filesDeleted} files • {record.duration}
                  </p>
                </div>
              </div>
              <motion.button 
                className="p-2 rounded-lg bg-danger/20 hover:bg-danger/30 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Trash2 className="w-4 h-4 text-danger" />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
} 
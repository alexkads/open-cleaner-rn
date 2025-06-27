import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import {
    Activity,
    CheckCircle,
    Clock,
    FolderOpen,
    HardDrive,
    Settings,
    Smartphone,
    Zap
} from 'lucide-react';
import { useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const mockData = [
  { name: 'Jan', cleaned: 400, space: 2400 },
  { name: 'Feb', cleaned: 300, space: 1398 },
  { name: 'Mar', cleaned: 200, space: 9800 },
  { name: 'Apr', cleaned: 278, space: 3908 },
  { name: 'May', cleaned: 189, space: 4800 },
  { name: 'Jun', cleaned: 239, space: 3800 },
];

const cleaningTasks = [
  { id: 1, name: 'node_modules', size: '2.3 GB', status: 'completed', type: 'expo' },
  { id: 2, name: '.expo cache', size: '856 MB', status: 'completed', type: 'expo' },
  { id: 3, name: 'Simulator logs', size: '423 MB', status: 'running', type: 'ios' },
  { id: 4, name: 'Metro cache', size: '234 MB', status: 'pending', type: 'metro' },
];

export default function Dashboard() {
  const [isScanning, setIsScanning] = useState(false);
  const [totalSpace, setTotalSpace] = useState('4.2 GB');
  const [lastClean, setLastClean] = useState('2 hours ago');

  const handleQuickClean = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

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
              <p className="text-gray-400 text-sm">Space Cleaned</p>
              <p className="text-2xl font-bold gradient-text">{totalSpace}</p>
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
              <p className="text-gray-400 text-sm">Tasks Completed</p>
              <p className="text-2xl font-bold text-success">42</p>
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
              <p className="text-gray-400 text-sm">RN Projects</p>
              <p className="text-2xl font-bold text-warning">8</p>
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
              <Clock className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Last Clean</p>
              <p className="text-lg font-bold text-accent">{lastClean}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          className="lg:col-span-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="glass-effect rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 gradient-text">Storage Analysis</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockData}>
                  <defs>
                    <linearGradient id="colorCleaned" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d2ff" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00d2ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3a3a4a" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a24', 
                      border: '1px solid #00d2ff',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="space" 
                    stroke="#00d2ff" 
                    fillOpacity={1} 
                    fill="url(#colorCleaned)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

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
                onClick={handleQuickClean}
                disabled={isScanning}
                className={clsx(
                  "w-full p-4 rounded-xl flex items-center space-x-3 transition-all duration-300",
                  isScanning 
                    ? "bg-warning/20 scan-line" 
                    : "bg-primary/20 hover:bg-primary/30 neon-border"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Zap className="w-5 h-5" />
                <span className="font-medium">
                  {isScanning ? 'Scanning...' : 'Quick Clean'}
                </span>
              </motion.button>

              <motion.button
                className="w-full p-4 rounded-xl bg-secondary/20 hover:bg-secondary/30 flex items-center space-x-3 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FolderOpen className="w-5 h-5" />
                <span className="font-medium">Select Folders</span>
              </motion.button>

              <motion.button
                className="w-full p-4 rounded-xl bg-accent/20 hover:bg-accent/30 flex items-center space-x-3 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Deep Clean</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Cleaning Tasks */}
      <motion.div 
        className="glass-effect rounded-2xl p-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <h3 className="text-xl font-bold mb-4 gradient-text">Recent Cleaning Tasks</h3>
        <div className="space-y-3">
          {cleaningTasks.map((task) => (
            <motion.div 
              key={task.id}
              className="flex items-center justify-between p-4 rounded-lg bg-dark-surface-2 border border-dark-border"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * task.id }}
            >
              <div className="flex items-center space-x-3">
                <div className={clsx(
                  "w-3 h-3 rounded-full",
                  task.status === 'completed' && "bg-success animate-pulse",
                  task.status === 'running' && "bg-warning animate-pulse",
                  task.status === 'pending' && "bg-gray-500"
                )} />
                <div>
                  <p className="font-medium">{task.name}</p>
                  <p className="text-sm text-gray-400 capitalize">{task.type} • {task.size}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {task.status === 'completed' && <CheckCircle className="w-5 h-5 text-success" />}
                {task.status === 'running' && <Activity className="w-5 h-5 text-warning animate-spin" />}
                {task.status === 'pending' && <Clock className="w-5 h-5 text-gray-500" />}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
} 
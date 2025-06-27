import { motion, useAnimation } from 'framer-motion';
import {
  Bell,
  Database,
  FolderOpen,
  Monitor,
  RefreshCw,
  Save,
  Settings as SettingsIcon,
  Shield,
  Smartphone,
  Zap
} from 'lucide-react';
import { useState } from 'react';

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

const toggleVariants = {
  off: {
    x: 0,
    backgroundColor: "rgba(75, 85, 99, 0.5)"
  },
  on: {
    x: 24,
    backgroundColor: "rgba(99, 102, 241, 1)"
  }
};

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
};

export default function Settings() {
  const [autoClean, setAutoClean] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [systemTray, setSystemTray] = useState(true);
  const [deepScan, setDeepScan] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  const saveControls = useAnimation();

  const handleSave = async () => {
    await saveControls.start({
      scale: [1, 1.2, 1],
      rotate: [0, 360, 0],
      transition: { duration: 0.6 }
    });
  };

  const AnimatedToggle = ({ enabled, onChange, label }: { 
    enabled: boolean; 
    onChange: () => void;
    label: string;
  }) => (
    <motion.div
      className="flex items-center justify-between p-4 rounded-xl bg-dark-surface-2/50 border border-dark-border hover:border-primary/30 transition-all duration-300"
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div>
        <h3 className="font-medium">{label}</h3>
        <p className="text-sm text-gray-400">Configure this setting</p>
      </div>
      
      <motion.button
        onClick={onChange}
        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
          enabled ? 'bg-primary' : 'bg-gray-600'
        }`}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
          animate={enabled ? "on" : "off"}
          variants={toggleVariants}
          transition={{ type: "spring" as const, stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </motion.div>
  );

  const settingSections = [
    {
      title: 'Cleaning Options',
      icon: <SettingsIcon className="w-6 h-6" />,
      color: 'primary',
      settings: [
        {
          title: 'Auto Clean on Startup',
          description: 'Automatically scan and clean when app starts',
          enabled: autoClean,
          onChange: () => setAutoClean(!autoClean)
        },
        {
          title: 'Deep Scan Mode',
          description: 'More thorough but slower scanning process',
          enabled: deepScan,
          onChange: () => setDeepScan(!deepScan)
        }
      ]
    },
    {
      title: 'Notifications & Interface',
      icon: <Bell className="w-6 h-6" />,
      color: 'accent',
      settings: [
        {
          title: 'Desktop Notifications',
          description: 'Show notifications for cleaning results',
          enabled: notifications,
          onChange: () => setNotifications(!notifications)
        },
        {
          title: 'System Tray',
          description: 'Keep app running in system tray',
          enabled: systemTray,
          onChange: () => setSystemTray(!systemTray)
        },
        {
          title: 'Dark Mode',
          description: 'Use dark theme for better visibility',
          enabled: darkMode,
          onChange: () => setDarkMode(!darkMode)
        },
        {
          title: 'Sound Effects',
          description: 'Play sounds for actions and notifications',
          enabled: soundEffects,
          onChange: () => setSoundEffects(!soundEffects)
        }
      ]
    }
  ];

  return (
    <motion.div
      className="p-6 space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header aprimorado */}
      <motion.div 
        className="glass-effect rounded-2xl p-6 relative overflow-hidden"
        variants={itemVariants}
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)"
        }}
      >
        {/* Background gradient animado */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-accent/10 via-primary/10 to-secondary/10"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear" as const
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
              Settings
            </motion.h1>
            <motion.p 
              className="text-gray-400"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Configure your React Native cleaning preferences
            </motion.p>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.div
              variants={pulseVariants}
              animate="animate"
              className="p-2"
            >
              <Zap className="w-6 h-6 text-primary" />
            </motion.div>
            
            <motion.button 
              className="p-3 rounded-xl bg-success/20 hover:bg-success/30 border border-success/30 flex items-center space-x-2"
              onClick={handleSave}
              animate={saveControls}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(34, 197, 94, 0.3)" 
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Save className="w-5 h-5 text-success" />
              <span className="text-success font-medium">Save</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Setting Sections com animações aprimoradas */}
      {settingSections.map((section, sectionIndex) => (
        <motion.div 
          key={section.title}
          className="glass-effect rounded-2xl p-6 relative overflow-hidden"
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
        >
          {/* Background decorativo */}
          <motion.div
            className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${
              section.color === 'primary' ? 'bg-primary/5' : 
              section.color === 'accent' ? 'bg-accent/5' : 'bg-secondary/5'
            }`}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut" as const,
              delay: sectionIndex * 0.5
            }}
          />
          
          <div className="relative z-10">
            <motion.div 
              className="flex items-center space-x-3 mb-6"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 + sectionIndex * 0.1 }}
            >
              <motion.div 
                className={`p-3 rounded-full ${
                  section.color === 'primary' ? 'bg-primary/20' : 
                  section.color === 'accent' ? 'bg-accent/20' : 'bg-secondary/20'
                }`}
                whileHover={{ 
                  scale: 1.1, 
                  rotate: 360,
                  boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)"
                }}
                transition={{ duration: 0.3 }}
              >
                {section.icon}
              </motion.div>
              <h2 className="text-xl font-bold gradient-text">{section.title}</h2>
            </motion.div>

            <motion.div 
              className="space-y-4"
              variants={containerVariants}
            >
              {section.settings.map((setting, settingIndex) => (
                <motion.div
                  key={setting.title}
                  variants={itemVariants}
                  custom={settingIndex}
                >
                  <AnimatedToggle 
                    enabled={setting.enabled}
                    onChange={setting.onChange}
                    label={setting.title}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      ))}

      {/* Folder Selection com animações */}
      <motion.div 
        className="glass-effect rounded-2xl p-6 relative overflow-hidden"
        variants={itemVariants}
      >
        <motion.div
          className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-secondary/5"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 20, 0],
            y: [0, -10, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut" as const
          }}
        />
        
        <div className="relative z-10">
          <motion.div 
            className="flex items-center space-x-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div 
              className="p-3 rounded-full bg-secondary/20"
              whileHover={{ 
                scale: 1.1, 
                rotate: 180,
                boxShadow: "0 10px 25px rgba(245, 158, 11, 0.3)"
              }}
            >
              <FolderOpen className="w-6 h-6" />
            </motion.div>
            <h2 className="text-xl font-bold gradient-text">Scan Locations</h2>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
            variants={containerVariants}
          >
            <motion.button 
              className="p-4 rounded-xl bg-dark-surface-2/50 border border-dark-border hover:border-primary/50 transition-all duration-300 text-left"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                x: 5,
                boxShadow: "0 10px 25px rgba(99, 102, 241, 0.2)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Monitor className="w-5 h-5 text-primary" />
                </motion.div>
                <div>
                  <h3 className="font-medium">Development Folder</h3>
                  <p className="text-sm text-gray-400">~/Documents/Projects</p>
                </div>
              </div>
            </motion.button>

            <motion.button 
              className="p-4 rounded-xl bg-dark-surface-2/50 border border-dark-border hover:border-accent/50 transition-all duration-300 text-left"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                x: 5,
                boxShadow: "0 10px 25px rgba(245, 158, 11, 0.2)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ rotate: -360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Smartphone className="w-5 h-5 text-accent" />
                </motion.div>
                <div>
                  <h3 className="font-medium">Expo Cache</h3>
                  <p className="text-sm text-gray-400">~/.expo</p>
                </div>
              </div>
            </motion.button>
          </motion.div>

          <motion.button 
            className="w-full p-4 rounded-xl bg-primary/20 hover:bg-primary/30 neon-border flex items-center justify-center space-x-2 transition-all duration-300"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 15px 35px rgba(99, 102, 241, 0.3)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <FolderOpen className="w-5 h-5" />
            </motion.div>
            <span className="font-medium">Add Custom Folder</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Database Settings com animações */}
      <motion.div 
        className="glass-effect rounded-2xl p-6 relative overflow-hidden"
        variants={itemVariants}
      >
        <motion.div
          className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-success/5"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [360, 0, 360]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut" as const
          }}
        />
        
        <div className="relative z-10">
          <motion.div 
            className="flex items-center space-x-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div 
              className="p-3 rounded-full bg-success/20"
              whileHover={{ 
                scale: 1.1, 
                rotate: 360,
                boxShadow: "0 10px 25px rgba(34, 197, 94, 0.3)"
              }}
            >
              <Database className="w-6 h-6" />
            </motion.div>
            <h2 className="text-xl font-bold gradient-text">Database</h2>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            variants={containerVariants}
          >
            <motion.button 
              className="p-4 rounded-xl bg-dark-surface-2/50 border border-dark-border hover:border-success/50 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px rgba(34, 197, 94, 0.2)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.4 }}
                >
                  <RefreshCw className="w-5 h-5 text-success" />
                </motion.div>
                <div className="text-left">
                  <h3 className="font-medium text-success">Export History</h3>
                  <p className="text-sm text-gray-400">Export cleaning history to JSON</p>
                </div>
              </div>
            </motion.button>

            <motion.button 
              className="p-4 rounded-xl bg-dark-surface-2/50 border border-dark-border hover:border-danger/50 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px rgba(239, 68, 68, 0.2)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ rotate: -180, scale: 1.2 }}
                  transition={{ duration: 0.4 }}
                >
                  <Shield className="w-5 h-5 text-danger" />
                </motion.div>
                <div className="text-left">
                  <h3 className="font-medium text-danger">Clear History</h3>
                  <p className="text-sm text-gray-400">Delete all stored cleaning history</p>
                </div>
              </div>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Botão de reset geral */}
      <motion.div
        className="glass-effect rounded-2xl p-6 border border-warning/30"
        variants={itemVariants}
        whileHover={{ 
          scale: 1.01,
          borderColor: "rgba(245, 158, 11, 0.5)"
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              className="p-3 rounded-full bg-warning/20"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut" as const
              }}
            >
              <RefreshCw className="w-6 h-6 text-warning" />
            </motion.div>
            <div>
              <h3 className="font-medium text-warning">Reset All Settings</h3>
              <p className="text-sm text-gray-400">Restore all settings to default values</p>
            </div>
          </div>
          
          <motion.button
            className="px-4 py-2 rounded-lg bg-warning/20 hover:bg-warning/30 border border-warning/30 text-warning font-medium"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(245, 158, 11, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            Reset
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
} 
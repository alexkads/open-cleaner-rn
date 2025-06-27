import { motion } from 'framer-motion';
import {
    Bell,
    Database,
    FolderOpen,
    Monitor,
    Settings as SettingsIcon,
    Smartphone,
    ToggleLeft,
    ToggleRight
} from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const [autoClean, setAutoClean] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [systemTray, setSystemTray] = useState(true);
  const [deepScan, setDeepScan] = useState(false);

  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <motion.button
      onClick={onChange}
      className="relative"
      whileTap={{ scale: 0.95 }}
    >
      {enabled ? (
        <ToggleRight className="w-8 h-8 text-primary" />
      ) : (
        <ToggleLeft className="w-8 h-8 text-gray-500" />
      )}
    </motion.button>
  );

  const settingSections = [
    {
      title: 'Cleaning Options',
      icon: <SettingsIcon className="w-6 h-6" />,
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
      title: 'Notifications',
      icon: <Bell className="w-6 h-6" />,
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
        }
      ]
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <motion.div 
        className="glass-effect rounded-2xl p-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-3xl font-bold gradient-text mb-2">Settings</h1>
        <p className="text-gray-400">Configure your React Native cleaning preferences</p>
      </motion.div>

      {/* Setting Sections */}
      {settingSections.map((section, index) => (
        <motion.div 
          key={section.title}
          className="glass-effect rounded-2xl p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 * (index + 1) }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 rounded-full bg-primary/20">
              {section.icon}
            </div>
            <h2 className="text-xl font-bold gradient-text">{section.title}</h2>
          </div>

          <div className="space-y-4">
            {section.settings.map((setting) => (
              <div key={setting.title} className="flex items-center justify-between p-4 rounded-lg bg-dark-surface-2 border border-dark-border">
                <div>
                  <h3 className="font-medium">{setting.title}</h3>
                  <p className="text-sm text-gray-400">{setting.description}</p>
                </div>
                <Toggle enabled={setting.enabled} onChange={setting.onChange} />
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Folder Selection */}
      <motion.div 
        className="glass-effect rounded-2xl p-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-full bg-secondary/20">
            <FolderOpen className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold gradient-text">Scan Locations</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button 
            className="p-4 rounded-lg bg-dark-surface-2 border border-dark-border hover:border-primary transition-all duration-300 text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <Monitor className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-medium">Development Folder</h3>
                <p className="text-sm text-gray-400">~/Documents/Projects</p>
              </div>
            </div>
          </motion.button>

          <motion.button 
            className="p-4 rounded-lg bg-dark-surface-2 border border-dark-border hover:border-primary transition-all duration-300 text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-accent" />
              <div>
                <h3 className="font-medium">Expo Cache</h3>
                <p className="text-sm text-gray-400">~/.expo</p>
              </div>
            </div>
          </motion.button>
        </div>

        <motion.button 
          className="w-full mt-4 p-4 rounded-xl bg-primary/20 hover:bg-primary/30 neon-border flex items-center justify-center space-x-2 transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FolderOpen className="w-5 h-5" />
          <span className="font-medium">Add Custom Folder</span>
        </motion.button>
      </motion.div>

      {/* Database Settings */}
      <motion.div 
        className="glass-effect rounded-2xl p-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-full bg-success/20">
            <Database className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold gradient-text">Database</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button 
            className="p-4 rounded-lg bg-dark-surface-2 border border-dark-border hover:border-success transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <h3 className="font-medium text-success">Export History</h3>
            <p className="text-sm text-gray-400">Export cleaning history to JSON</p>
          </motion.button>

          <motion.button 
            className="p-4 rounded-lg bg-dark-surface-2 border border-dark-border hover:border-danger transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <h3 className="font-medium text-danger">Clear History</h3>
            <p className="text-sm text-gray-400">Delete all stored cleaning history</p>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
} 
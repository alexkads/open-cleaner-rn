import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import {
    History,
    Home,
    Menu,
    Settings,
    Zap
} from 'lucide-react';
import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import { Toaster } from 'sonner';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'History', href: '/history', icon: History },
  { name: 'Settings', href: '/settings', icon: Settings },
];

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="h-screen bg-gradient-to-br from-dark-bg to-[#1a1a2e] text-white overflow-hidden">
      {/* Sonner Toaster */}
      <Toaster
        theme="dark"
        richColors
        position="top-right"
        expand={true}
        closeButton
        toastOptions={{
          style: {
            background: 'rgba(16, 19, 32, 0.9)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: 'white',
          },
          className: 'sonner-toast',
        }}
      />
      
      <div className="flex h-full">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-64 bg-dark-surface/50 backdrop-blur-xl border-r border-dark-border"
            >
              <div className="p-6">
                <motion.div 
                  className="flex items-center space-x-3 mb-8"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="p-3 rounded-xl bg-primary/20 neon-border">
                    <Zap className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold gradient-text">Clean RN</h1>
                    <p className="text-sm text-gray-400">Dev Environment</p>
                  </div>
                </motion.div>

                <nav className="space-y-2">
                  {navigation.map((item, index) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <Link
                          to={item.href}
                          className={clsx(
                            "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                            isActive
                              ? "bg-primary/20 text-primary neon-border"
                              : "hover:bg-white/5 text-gray-300 hover:text-white"
                          )}
                        >
                          <item.icon className={clsx(
                            "w-5 h-5 transition-all duration-300",
                            isActive ? "text-primary" : "group-hover:text-primary"
                          )} />
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              {/* Sidebar Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <motion.div 
                  className="glass-effect rounded-xl p-4 neon-border"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                      <span className="font-bold text-sm">v1.0</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">System Status</p>
                      <p className="text-xs text-success">All systems operational</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <motion.header 
            className="h-16 bg-dark-surface/30 backdrop-blur-lg border-b border-dark-border flex items-center justify-between px-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Toggle sidebar"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-6 h-6 text-gray-400 hover:text-white" />
            </button>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                <span className="text-sm text-gray-400">Ready to clean</span>
              </div>
            </div>
          </motion.header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;

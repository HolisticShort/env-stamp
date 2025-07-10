import { useState } from 'react';
import { getCurrentEnvironment, getFeatureFlags } from '../../config/environment';
import type { Environment } from '../../types/environment';

interface ModernHeaderProps {
  currentView: string;
  onNavigate: (path: string, viewName: string) => void;
  onToggleSidebar: () => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

export function ModernHeader({ 
  currentView, 
  onNavigate, 
  onToggleSidebar,
  onToggleTheme,
  isDarkMode 
}: ModernHeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const environment = getCurrentEnvironment();
  const features = getFeatureFlags();

  const getEnvironmentConfig = (env: Environment) => {
    const configs = {
      local: { label: 'Local', icon: '💻', color: 'local' },
      dev: { label: 'Development', icon: '🚧', color: 'dev' },
      test: { label: 'Test', icon: '🧪', color: 'test' },
      prod: { label: 'Production', icon: '🚀', color: 'prod' }
    };
    return configs[env] || configs.local;
  };

  const envConfig = getEnvironmentConfig(environment);
  const activeFeatures = Object.values(features).filter(Boolean).length;

  return (
    <header className="glass sticky top-0 z-40 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
              aria-label="Toggle navigation"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">ES</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Env Stamp</h1>
                <p className="text-white/70 text-xs">Environment-Driven Development</p>
              </div>
            </div>
          </div>

          {/* Center section - Quick Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: 'journal', label: 'Journal', icon: '📝' },
              { id: 'dashboard', label: 'Dashboard', icon: '📊', requiresFeature: 'dashboard' },
              { id: 'learning-hub', label: 'Learning', icon: '🎓' },
              { id: 'services', label: 'Services', icon: '⚡' }
            ].map(item => {
              if (item.requiresFeature && !features[item.requiresFeature as keyof typeof features]) {
                return null;
              }
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(`/${item.id}`, item.id)}
                  className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                    currentView === item.id
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Environment Badge */}
            <div className={`env-badge ${envConfig.color} animate-fade-in`}>
              <span>{envConfig.icon}</span>
              <span className="hidden sm:inline">{envConfig.label}</span>
            </div>

            {/* Feature Count */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 text-white text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>{activeFeatures} features active</span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                aria-label="User menu"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">U</span>
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 glass rounded-2xl border border-white/20 shadow-xl animate-scale-in">
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                        <span className="text-white font-bold">U</span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Developer</h3>
                        <p className="text-white/70 text-sm">Environment: {envConfig.label}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-white/5">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white/70 text-sm">Features Active</span>
                          <span className="text-white font-medium">{activeFeatures}/{Object.keys(features).length}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(activeFeatures / Object.keys(features).length) * 100}%` }}
                          />
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          onNavigate('/debug-panel', 'debug-panel');
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left p-3 rounded-xl hover:bg-white/10 transition-colors text-white"
                      >
                        <span className="mr-3">🛠️</span>
                        Debug Panel
                      </button>
                      
                      <button 
                        onClick={() => {
                          onNavigate('/settings', 'settings');
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left p-3 rounded-xl hover:bg-white/10 transition-colors text-white"
                      >
                        <span className="mr-3">⚙️</span>
                        Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
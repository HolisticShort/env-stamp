import { useState, useEffect } from 'react';
import { NavigationService } from '../../services/navigation';
import { getFeatureFlags, getCurrentEnvironment } from '../../config/environment';
import { MetricsService } from '../../services/metrics';
import { StorageService } from '../../services/storage';

interface ModernDashboardProps {
  onNavigate: (path: string, viewName: string) => void;
}

interface DashboardStats {
  totalJournalEntries: number;
  totalMetrics: number;
  featuresActive: number;
  storageUsed: string;
}

export function ModernDashboard({ onNavigate }: ModernDashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalJournalEntries: 0,
    totalMetrics: 0,
    featuresActive: 0,
    storageUsed: '0 KB'
  });

  const features = getFeatureFlags();
  const environment = getCurrentEnvironment();
  const visibleFeatures = NavigationService.getVisibleNavigationItems(features);

  useEffect(() => {
    const journalEntries = StorageService.getAllEntries();
    const metrics = MetricsService.getAllMetrics();
    const storageInfo = StorageService.getStorageInfo();
    const activeFeatures = Object.values(features).filter(Boolean).length;

    setStats({
      totalJournalEntries: journalEntries.length,
      totalMetrics: metrics.length,
      featuresActive: activeFeatures,
      storageUsed: `${(storageInfo.totalSize / 1024).toFixed(1)} KB`
    });
  }, [features]);

  const featuredCards = [
    {
      id: 'journal',
      title: 'Journal Entries',
      description: 'Write and manage your development journal',
      value: stats.totalJournalEntries,
      icon: '📝',
      gradient: 'from-blue-500 to-blue-600',
      action: () => onNavigate('/journal', 'journal')
    },
    {
      id: 'metrics',
      title: 'Performance Metrics',
      description: 'Monitor application performance',
      value: stats.totalMetrics,
      icon: '📊',
      gradient: 'from-green-500 to-green-600',
      action: () => onNavigate('/metrics', 'metrics'),
      disabled: !features.performanceMetrics
    },
    {
      id: 'features',
      title: 'Active Features',
      description: 'Features enabled in current environment',
      value: stats.featuresActive,
      icon: '⚡',
      gradient: 'from-purple-500 to-purple-600',
      action: () => onNavigate('/debug-panel', 'debug-panel')
    },
    {
      id: 'storage',
      title: 'Storage Used',
      description: 'Local storage utilization',
      value: stats.storageUsed,
      icon: '💾',
      gradient: 'from-orange-500 to-orange-600',
      action: () => onNavigate('/debug-panel', 'debug-panel')
    }
  ];

  const quickActions = [
    {
      title: 'Create Journal Entry',
      description: 'Start writing in your development journal',
      icon: '✍️',
      action: () => onNavigate('/journal', 'journal'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'View Learning Hub',
      description: 'Explore tutorials and environment guides',
      icon: '🎓',
      action: () => onNavigate('/learning-hub', 'learning-hub'),
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Monitor Services',
      description: 'Check running services and system status',
      icon: '🔧',
      action: () => onNavigate('/services', 'services'),
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Debug Panel',
      description: 'Access debugging tools and system info',
      icon: '🛠️',
      action: () => onNavigate('/debug-panel', 'debug-panel'),
      color: 'from-red-500 to-red-600',
      disabled: !features.debugPanel
    }
  ];

  const environmentFeatures = Object.entries(features).map(([key, enabled]) => ({
    name: key.replace(/([A-Z])/g, ' $1').trim(),
    enabled,
    icon: enabled ? '✅' : '❌'
  }));

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="heading-xl gradient-text mb-4">
            Welcome to Env Stamp
          </h1>
          <p className="text-white/80 text-xl mb-6 max-w-3xl mx-auto">
            Your environment-driven development platform. Currently running in{' '}
            <span className="font-bold text-white">{environment.toUpperCase()}</span> mode
            with {stats.featuresActive} active features.
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="px-6 py-3 glass rounded-2xl">
              <span className="text-white/70">Environment:</span>
              <span className="ml-2 text-white font-bold">{environment.toUpperCase()}</span>
            </div>
            <div className="px-6 py-3 glass rounded-2xl">
              <span className="text-white/70">Features:</span>
              <span className="ml-2 text-white font-bold">{stats.featuresActive}/{Object.keys(features).length}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-slide-up">
          {featuredCards.map((card, index) => (
            <button
              key={card.id}
              onClick={card.action}
              disabled={card.disabled}
              className={`modern-card text-left group ${card.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <span className="text-2xl">{card.icon}</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{card.value}</div>
                </div>
              </div>
              <h3 className="text-white font-semibold mb-2">{card.title}</h3>
              <p className="text-white/70 text-sm">{card.description}</p>
              {!card.disabled && (
                <div className="mt-4 flex items-center text-white/60 text-sm group-hover:text-white transition-colors">
                  <span>View details</span>
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="modern-card animate-slide-up" style={{ animationDelay: '400ms' }}>
            <h2 className="heading-md text-white mb-6">Quick Actions</h2>
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  disabled={action.disabled}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all group ${
                    action.disabled 
                      ? 'opacity-50 cursor-not-allowed bg-white/5' 
                      : 'hover:bg-white/10 bg-white/5'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <span className="text-xl">{action.icon}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-white font-medium">{action.title}</h3>
                    <p className="text-white/70 text-sm">{action.description}</p>
                  </div>
                  {!action.disabled && (
                    <svg className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Environment Features */}
          <div className="modern-card animate-slide-up" style={{ animationDelay: '500ms' }}>
            <h2 className="heading-md text-white mb-6">Environment Features</h2>
            <div className="space-y-3">
              {environmentFeatures.map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{feature.icon}</span>
                    <span className="text-white font-medium capitalize">{feature.name}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    feature.enabled 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {feature.enabled ? 'Active' : 'Disabled'}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg">💡</span>
                <span className="text-white font-medium">Pro Tip</span>
              </div>
              <p className="text-white/70 text-sm">
                Features are automatically enabled/disabled based on your current environment. 
                Switch environments to access different feature sets.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-12 modern-card animate-slide-up" style={{ animationDelay: '600ms' }}>
          <h2 className="heading-md text-white mb-6">Available Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleFeatures.slice(0, 9).map((feature) => (
              <button
                key={feature.id}
                onClick={() => onNavigate(feature.path, feature.id)}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <span className="text-lg">{feature.icon}</span>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-white font-medium">{feature.label}</h3>
                  <p className="text-white/60 text-sm line-clamp-1">{feature.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
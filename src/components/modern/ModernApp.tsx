import { useState, useEffect } from 'react';
import { ModernHeader } from './ModernHeader';
import { ModernSidebar } from './ModernSidebar';
import { ModernDashboard } from './ModernDashboard';
import { ModernJournal } from './ModernJournal';
import { LearningHub } from '../LearningHub';
import { ServicesView } from '../views/ServicesView';
import { MetricsView } from '../views/MetricsView';
import { DebugView } from '../views/DebugView';
import { TutorialListView } from '../views/TutorialListView';
import { EnvironmentComparisonView } from '../views/EnvironmentComparisonView';
import { AnalyticsView } from '../views/AnalyticsView';
import { DatabaseView } from '../views/DatabaseView';
import { getFeatureFlags } from '../../config/environment';
import { MetricsService } from '../../services/metrics';
import '../../styles/modern-theme.css';

type View = 'dashboard' | 'journal' | 'learning-hub' | 'services' | 'metrics' | 'debug-panel' | 'tutorials' | 'environment-comparison' | 'analytics' | 'database';

export function ModernApp() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const features = getFeatureFlags();

  useEffect(() => {
    // Initialize metrics collection if enabled
    if (features.performanceMetrics) {
      MetricsService.initialize();
      
      // Record metrics periodically
      const interval = setInterval(() => {
        MetricsService.recordMetrics();
      }, 30000); // Every 30 seconds

      // Record metrics on page unload
      const handleBeforeUnload = () => {
        MetricsService.recordMetrics();
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        clearInterval(interval);
        window.removeEventListener('beforeunload', handleBeforeUnload);
        MetricsService.cleanup();
      };
    }
  }, [features.performanceMetrics]);

  useEffect(() => {
    // Load theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const handleNavigate = (_path: string, viewName: string) => {
    setCurrentView(viewName as View);
    setSidebarOpen(false);
  };

  const handleToggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <ModernDashboard onNavigate={handleNavigate} />;
      case 'journal':
        return <ModernJournal />;
      case 'learning-hub':
        return (
          <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto modern-card">
              <LearningHub />
            </div>
          </div>
        );
      case 'services':
        return (
          <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
              <div className="modern-card">
                <ServicesView />
              </div>
            </div>
          </div>
        );
      case 'metrics':
        return (
          <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
              <div className="modern-card">
                <MetricsView />
              </div>
            </div>
          </div>
        );
      case 'debug-panel':
        return (
          <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
              <div className="modern-card">
                <DebugView />
              </div>
            </div>
          </div>
        );
      case 'tutorials':
        return (
          <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
              <div className="modern-card">
                <TutorialListView />
              </div>
            </div>
          </div>
        );
      case 'environment-comparison':
        return (
          <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
              <div className="modern-card">
                <EnvironmentComparisonView />
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
              <div className="modern-card">
                <AnalyticsView />
              </div>
            </div>
          </div>
        );
      case 'database':
        return (
          <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
              <div className="modern-card">
                <DatabaseView />
              </div>
            </div>
          </div>
        );
      default:
        return <ModernDashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Header */}
      <ModernHeader
        currentView={currentView}
        onNavigate={handleNavigate}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onToggleTheme={handleToggleTheme}
        isDarkMode={isDarkMode}
      />

      {/* Main Layout */}
      <div className="flex relative">
        {/* Sidebar */}
        <ModernSidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 relative">
          <div className="animate-fade-in">
            {renderView()}
          </div>
        </main>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center lg:hidden z-40 hover:scale-110"
        aria-label="Open navigation"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Keyboard Shortcuts Indicator */}
      <div className="fixed bottom-6 left-6 glass px-4 py-2 rounded-xl text-white/70 text-sm animate-fade-in z-30">
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-white/10 rounded text-xs">⌘</kbd>
          <span>+</span>
          <kbd className="px-2 py-1 bg-white/10 rounded text-xs">K</kbd>
          <span>to search</span>
        </div>
      </div>
    </div>
  );
}
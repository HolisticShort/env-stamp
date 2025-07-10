import { useState, useEffect } from 'react';
import { EnvironmentBanner } from './components/EnvironmentBanner';
import { Journal } from './components/Journal';
import { Dashboard } from './components/Dashboard';
import { DebugPanel } from './components/DebugPanel';
import { LearningHub } from './components/LearningHub';
import { getFeatureFlags } from './config/environment';
import { MetricsService } from './services/metrics';

type View = 'journal' | 'dashboard' | 'learning';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
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

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
      default:
        return <Dashboard />;
      case 'learning':
        return <LearningHub />;
      case 'journal':
        return (
          <main className="py-6 sm:py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <header className="text-center mb-8 sm:mb-12">
                <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">
                  Env Stamp Journal
                </h1>
                <p className="text-blue-700">
                  A simple journal app that adapts to your environment
                </p>
              </header>
              
              <Journal />
            </div>
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <EnvironmentBanner />
      
      {/* Navigation */}
      <nav className="bg-white border-b border-blue-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-6 sm:space-x-8 overflow-x-auto">
            {features.dashboard && (
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap min-w-0 transition-colors ${
                  currentView === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-blue-600 hover:text-blue-700 hover:border-blue-300'
                }`}
              >
                Dashboard
              </button>
            )}
            
            <button
              onClick={() => setCurrentView('learning')}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap min-w-0 transition-colors ${
                currentView === 'learning'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-blue-600 hover:text-blue-700 hover:border-blue-300'
              }`}
            >
              Learning Hub
            </button>
            
            <button
              onClick={() => setCurrentView('journal')}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap min-w-0 transition-colors ${
                currentView === 'journal'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-blue-600 hover:text-blue-700 hover:border-blue-300'
              }`}
            >
              Journal
            </button>
          </div>
        </div>
      </nav>

      {renderView()}

      {features.debugPanel && <DebugPanel />}
    </div>
  );
}

export default App
// Learning system test - Thu Jul 10 05:35:53 EDT 2025 adding

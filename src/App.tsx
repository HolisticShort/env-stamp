import { useState, useEffect } from 'react';
import { EnvironmentBanner } from './components/EnvironmentBanner';
import { Journal } from './components/Journal';
import { Dashboard } from './components/Dashboard';
import { DebugPanel } from './components/DebugPanel';
import { getFeatureFlags } from './config/environment';
import { MetricsService } from './services/metrics';

type View = 'journal' | 'dashboard';

function App() {
  const [currentView, setCurrentView] = useState<View>('journal');
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
        return <Dashboard />;
      case 'journal':
      default:
        return (
          <main className="py-8">
            <div className="max-w-4xl mx-auto px-4">
              <header className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Env Stamp Journal
                </h1>
                <p className="text-gray-600">
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
    <div className="min-h-screen bg-gray-50">
      <EnvironmentBanner />
      
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setCurrentView('journal')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentView === 'journal'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Journal
            </button>
            
            {features.dashboard && (
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  currentView === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Dashboard
              </button>
            )}
          </div>
        </div>
      </nav>

      {renderView()}

      {features.debugPanel && <DebugPanel />}
    </div>
  );
}

export default App

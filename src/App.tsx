import { useState, useEffect } from 'react';
import { EnvironmentBanner } from './components/EnvironmentBanner';
import { Journal } from './components/Journal';
import { Dashboard } from './components/Dashboard';
import { DebugPanel } from './components/DebugPanel';
import { LearningHub } from './components/LearningHub';
import { Sidebar } from './components/navigation/Sidebar';
import { QuickAccessToolbar } from './components/navigation/QuickAccessToolbar';
import { Breadcrumbs } from './components/navigation/Breadcrumbs';
import { OnboardingTour } from './components/navigation/OnboardingTour';
import { NavigationService } from './services/navigation';
import { ServicesView } from './components/views/ServicesView';
import { MetricsView } from './components/views/MetricsView';
import { DebugView } from './components/views/DebugView';
import { TutorialListView } from './components/views/TutorialListView';
import { EnvironmentComparisonView } from './components/views/EnvironmentComparisonView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { DatabaseView } from './components/views/DatabaseView';
import { getFeatureFlags } from './config/environment';
import { MetricsService } from './services/metrics';

type View = 'journal' | 'dashboard' | 'learning-hub' | 'services' | 'metrics' | 'debug-panel' | 'tutorials' | 'environment-comparison' | 'analytics' | 'database';

function App() {
  const [currentView, setCurrentView] = useState<View>('journal');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const features = getFeatureFlags();

  useEffect(() => {
    const preferences = NavigationService.getUserPreferences();
    if (!preferences.completedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

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

  const handleNavigate = (_path: string, viewName: string) => {
    setCurrentView(viewName as View);
    setSidebarOpen(false);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'learning-hub':
        return <LearningHub />;
      case 'services':
        return <ServicesView />;
      case 'metrics':
        return <MetricsView />;
      case 'debug-panel':
        return <DebugView />;
      case 'tutorials':
        return <TutorialListView />;
      case 'environment-comparison':
        return <EnvironmentComparisonView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'database':
        return <DatabaseView />;
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
      
      <div className="flex">
        {/* Sidebar Navigation */}
        <Sidebar 
          currentView={currentView}
          onNavigate={handleNavigate}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        
        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Mobile menu button */}
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                aria-label="Open navigation"
              >
                ☰
              </button>
              
              {/* Mobile breadcrumbs */}
              <div className="flex-1 mx-4">
                <Breadcrumbs 
                  currentView={currentView}
                  onNavigate={handleNavigate}
                />
              </div>
            </div>
          </div>
          
          {/* Desktop breadcrumbs */}
          <div className="hidden lg:block bg-white border-b border-gray-200 px-6 py-3">
            <Breadcrumbs 
              currentView={currentView}
              onNavigate={handleNavigate}
            />
          </div>
          
          {/* Page content */}
          <div className="relative">
            {renderView()}
          </div>
        </div>
      </div>

      {/* Quick Access Toolbar */}
      <QuickAccessToolbar 
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      {/* Legacy Debug Panel (only show as floating panel if not in debug view) */}
      {features.debugPanel && currentView !== 'debug-panel' && <DebugPanel />}
      
      {/* Onboarding Tour */}
      {showOnboarding && (
        <OnboardingTour onComplete={() => setShowOnboarding(false)} />
      )}
    </div>
  );
}

export default App
// Learning system test - Thu Jul 10 05:35:53 EDT 2025

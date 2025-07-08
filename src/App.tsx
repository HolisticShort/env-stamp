import { EnvironmentBanner } from './components/EnvironmentBanner';
import { Journal } from './components/Journal';
import { DebugPanel } from './components/DebugPanel';
import { getFeatureFlags } from './config/environment';

function App() {
  const features = getFeatureFlags();

  return (
    <div className="min-h-screen bg-gray-50">
      <EnvironmentBanner />
      
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

      {features.debugPanel && <DebugPanel />}
    </div>
  );
}

export default App

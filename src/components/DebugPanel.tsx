import { useState } from 'react';
import { StorageService } from '../services/storage';
import { MetricsService } from '../services/metrics';
import { getCurrentEnvironment, getEnvironmentConfig, getFeatureFlags } from '../config/environment';

export function DebugPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [storageInfo, setStorageInfo] = useState(StorageService.getStorageInfo());
  const [metricsInfo, setMetricsInfo] = useState(MetricsService.getMetricsSummary());

  const environment = getCurrentEnvironment();
  const config = getEnvironmentConfig();
  const features = getFeatureFlags();

  const refreshStorageInfo = () => {
    setStorageInfo(StorageService.getStorageInfo());
    setMetricsInfo(MetricsService.getMetricsSummary());
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all journal entries and metrics? This cannot be undone.')) {
      StorageService.clearAllEntries();
      MetricsService.clearMetrics();
      refreshStorageInfo();
    }
  };

  const downloadData = () => {
    const entries = StorageService.getAllEntries();
    const dataStr = JSON.stringify(entries, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `env-stamp-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-gray-900 text-white rounded-lg shadow-lg">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-2 text-left font-medium text-sm bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-expanded={isExpanded}
          aria-controls="debug-panel-content"
        >
          🛠️ Debug Panel {isExpanded ? '▼' : '▲'}
        </button>
        
        {isExpanded && (
          <div id="debug-panel-content" className="p-4 space-y-4 max-w-sm">
            <div>
              <h4 className="font-semibold text-sm mb-2">Environment Info</h4>
              <div className="text-xs space-y-1">
                <div>Current: <span className="font-mono text-green-400">{environment}</span></div>
                <div>Display: <span className="font-mono text-blue-400">{config.displayName}</span></div>
                <div>App Name: <span className="font-mono text-yellow-400">{import.meta.env.VITE_APP_NAME}</span></div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">Feature Flags</h4>
              <div className="text-xs space-y-1">
                <div>Debug Panel: <span className={features.debugPanel ? 'text-green-400' : 'text-red-400'}>{features.debugPanel ? '✓' : '✗'}</span></div>
                <div>Dashboard: <span className={features.dashboard ? 'text-green-400' : 'text-red-400'}>{features.dashboard ? '✓' : '✗'}</span></div>
                <div>Performance Metrics: <span className={features.performanceMetrics ? 'text-green-400' : 'text-red-400'}>{features.performanceMetrics ? '✓' : '✗'}</span></div>
                <div>Analytics: <span className={features.analytics ? 'text-green-400' : 'text-red-400'}>{features.analytics ? '✓' : '✗'}</span></div>
                <div>Supabase: <span className={features.supabase ? 'text-green-400' : 'text-red-400'}>{features.supabase ? '✓' : '✗'}</span></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm">Storage Info</h4>
                <button
                  onClick={refreshStorageInfo}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Refresh
                </button>
              </div>
              <div className="text-xs space-y-1">
                <div>Entries: <span className="font-mono text-yellow-400">{storageInfo.entryCount}</span></div>
                <div>Size: <span className="font-mono text-yellow-400">{(storageInfo.totalSize / 1024).toFixed(1)} KB</span></div>
                <div>Available: <span className={storageInfo.isAvailable ? 'text-green-400' : 'text-red-400'}>{storageInfo.isAvailable ? '✓' : '✗'}</span></div>
              </div>
            </div>

            {features.performanceMetrics && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Performance Metrics</h4>
                <div className="text-xs space-y-1">
                  <div>Total Entries: <span className="font-mono text-yellow-400">{metricsInfo.totalEntries}</span></div>
                  <div>Avg Load Time: <span className="font-mono text-yellow-400">{metricsInfo.avgPageLoadTime.toFixed(0)}ms</span></div>
                  <div>Avg Memory: <span className="font-mono text-yellow-400">{(metricsInfo.avgMemoryUsage / 1024 / 1024).toFixed(1)}MB</span></div>
                  <div>Total Errors: <span className="font-mono text-yellow-400">{metricsInfo.totalErrors}</span></div>
                </div>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-sm mb-2">Actions</h4>
              <div className="space-y-2">
                <button
                  onClick={downloadData}
                  className="w-full px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  Download Data
                </button>
                <button
                  onClick={clearAllData}
                  className="w-full px-3 py-1 text-xs bg-red-600 hover:bg-red-700 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  Clear All Data
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">Environment Variables</h4>
              <div className="text-xs space-y-1 font-mono bg-gray-800 p-2 rounded max-h-32 overflow-y-auto">
                {Object.entries(import.meta.env)
                  .filter(([key]) => key.startsWith('VITE_'))
                  .map(([key, value]) => (
                    <div key={key}>
                      <span className="text-gray-400">{key}:</span>{' '}
                      <span className="text-green-400">{String(value)}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
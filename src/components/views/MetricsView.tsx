import { useState, useEffect, useCallback } from 'react';
import { MetricsService } from '../../services/metrics';
import type { MetricsSummary, PerformanceMetrics } from '../../services/metrics';
import { getCurrentEnvironment, getFeatureFlags } from '../../config/environment';
import type { Environment } from '../../types/environment';

export function MetricsView() {
  const [selectedEnvironment, setSelectedEnvironment] = useState<Environment | 'all'>('all');
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [summary, setSummary] = useState<MetricsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const currentEnvironment = getCurrentEnvironment();
  const features = getFeatureFlags();
  
  const environments: (Environment | 'all')[] = ['all', 'local', 'dev', 'test', 'prod'];

  const loadMetrics = useCallback(() => {
    setIsLoading(true);
    try {
      const allMetrics = MetricsService.getAllMetrics();
      const filteredMetrics = selectedEnvironment === 'all' 
        ? allMetrics 
        : allMetrics.filter(m => m.environment === selectedEnvironment);
      
      setMetrics(filteredMetrics);
      setSummary(MetricsService.getMetricsSummary(selectedEnvironment === 'all' ? undefined : selectedEnvironment));
    } catch (error) {
      console.error('Failed to load metrics:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedEnvironment]);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  const clearMetrics = () => {
    if (window.confirm('Are you sure you want to clear all metrics data? This cannot be undone.')) {
      MetricsService.clearMetrics();
      loadMetrics();
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'local': return 'bg-blue-100 text-blue-800';
      case 'dev': return 'bg-green-100 text-green-800';
      case 'test': return 'bg-yellow-100 text-yellow-800';
      case 'prod': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!features.performanceMetrics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Performance Metrics Not Available</h2>
          <p className="text-gray-600">Performance metrics are not enabled in this environment.</p>
          <p className="text-sm text-gray-500 mt-2">
            This feature is available in: development, test, and production environments.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Performance Metrics</h1>
          <p className="text-gray-600">
            Detailed performance analytics and monitoring across environments
          </p>
        </div>

        {/* Environment Selector */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {environments.map((env) => (
              <button
                key={env}
                onClick={() => setSelectedEnvironment(env)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedEnvironment === env
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {env.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Current Environment Indicator */}
        <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Current Environment</h3>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getEnvironmentColor(currentEnvironment)}`}>
                {currentEnvironment.toUpperCase()}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Data Collection Status</p>
              <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading metrics...</p>
          </div>
        ) : (
          <>
            {/* Metrics Summary */}
            {summary && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Total Entries</h3>
                  <p className="text-2xl font-bold text-gray-900">{summary.totalEntries}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Avg Load Time</h3>
                  <p className="text-2xl font-bold text-gray-900">{formatTime(summary.avgPageLoadTime)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Avg Memory Usage</h3>
                  <p className="text-2xl font-bold text-gray-900">{formatBytes(summary.avgMemoryUsage)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Total Errors</h3>
                  <p className="text-2xl font-bold text-gray-900">{summary.totalErrors}</p>
                </div>
              </div>
            )}

            {/* Detailed Metrics */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Detailed Metrics</h3>
                  <button
                    onClick={clearMetrics}
                    className="px-4 py-2 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded hover:bg-red-50"
                  >
                    Clear All Data
                  </button>
                </div>
              </div>

              {metrics.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No metrics data available for the selected environment.</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Metrics will be collected automatically as you use the application.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Timestamp
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Environment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Load Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Memory Usage
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Network Requests
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Interactions
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Errors
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {metrics.slice(0, 50).map((metric) => (
                        <tr key={metric.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(metric.timestamp).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getEnvironmentColor(metric.environment)}`}>
                              {metric.environment.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatTime(metric.pageLoadTime)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatBytes(metric.memoryUsage)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {metric.networkRequests}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {metric.userInteractions}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {metric.errors}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
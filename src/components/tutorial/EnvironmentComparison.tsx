import { getCurrentEnvironment } from '../../config/environment';
import type { Environment } from '../../types/environment';

const environments: Environment[] = ['local', 'dev', 'test', 'prod'];

export function EnvironmentComparison() {
  const currentEnv = getCurrentEnvironment();
  
  const getEnvironmentData = (env: Environment) => {
    // Mock environment config for comparison
    const configs = {
      local: {
        name: 'local',
        displayName: 'LOCAL',
        banner: { color: 'text-blue-800', background: 'bg-blue-100', borderColor: 'border-blue-300' },
        features: {
          debugPanel: true,
          analytics: false,
          supabase: false,
          dashboard: true,
          performanceMetrics: true,
          advancedMetrics: false,
        },
      },
      dev: {
        name: 'dev',
        displayName: 'DEVELOPMENT',
        banner: { color: 'text-green-800', background: 'bg-green-100', borderColor: 'border-green-300' },
        features: {
          debugPanel: true,
          analytics: false,
          supabase: false,
          dashboard: true,
          performanceMetrics: true,
          advancedMetrics: true,
        },
      },
      test: {
        name: 'test',
        displayName: 'TEST',
        banner: { color: 'text-yellow-800', background: 'bg-yellow-100', borderColor: 'border-yellow-300' },
        features: {
          debugPanel: true,
          analytics: false,
          supabase: false,
          dashboard: true,
          performanceMetrics: true,
          advancedMetrics: true,
        },
      },
      prod: {
        name: 'prod',
        displayName: 'PRODUCTION',
        banner: { color: 'text-red-800', background: 'bg-red-100', borderColor: 'border-red-300' },
        features: {
          debugPanel: false,
          analytics: true,
          supabase: true,
          dashboard: true,
          performanceMetrics: true,
          advancedMetrics: false,
        },
      },
    };
    
    return configs[env];
  };

  const getBannerColor = (env: Environment) => {
    const colors = {
      local: 'bg-blue-100 text-blue-800',
      dev: 'bg-green-100 text-green-800',
      test: 'bg-yellow-100 text-yellow-800',
      prod: 'bg-red-100 text-red-800',
    };
    return colors[env];
  };

  const featureNames = [
    'debugPanel',
    'analytics',
    'supabase',
    'dashboard',
    'performanceMetrics',
    'advancedMetrics',
  ];

  const getFeatureLabel = (feature: string) => {
    const labels: Record<string, string> = {
      debugPanel: 'Debug Panel',
      analytics: 'Analytics',
      supabase: 'Database',
      dashboard: 'Dashboard',
      performanceMetrics: 'Performance Metrics',
      advancedMetrics: 'Advanced Metrics',
    };
    return labels[feature] || feature;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6">Environment Comparison</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 font-medium text-gray-700">Feature</th>
              {environments.map((env) => (
                <th key={env} className="text-center p-3">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getBannerColor(env)} ${
                    env === currentEnv ? 'ring-2 ring-blue-500' : ''
                  }`}>
                    {getEnvironmentData(env).displayName}
                    {env === currentEnv && <span className="ml-2">←</span>}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {featureNames.map((feature) => (
              <tr key={feature} className="border-b border-gray-100">
                <td className="p-3 font-medium text-gray-700">
                  {getFeatureLabel(feature)}
                </td>
                {environments.map((env) => {
                  const envData = getEnvironmentData(env);
                  const isEnabled = envData.features[feature as keyof typeof envData.features];
                  
                  return (
                    <td key={env} className="p-3 text-center">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium ${
                        isEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {isEnabled ? '✓' : '✗'}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Key Differences</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Local/Dev/Test:</strong> Debug panel enabled for development</li>
          <li>• <strong>Production:</strong> Analytics and database features enabled</li>
          <li>• <strong>Dev/Test:</strong> Advanced metrics available for detailed monitoring</li>
          <li>• <strong>All environments:</strong> Core dashboard and performance metrics</li>
        </ul>
      </div>
      
      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="font-semibold text-gray-700 mb-2">Environment Commands</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div>
            <code className="bg-gray-800 text-white px-2 py-1 rounded">npm run dev</code>
            <span className="ml-2 text-gray-600">→ Local</span>
          </div>
          <div>
            <code className="bg-gray-800 text-white px-2 py-1 rounded">npm run dev:development</code>
            <span className="ml-2 text-gray-600">→ Dev</span>
          </div>
          <div>
            <code className="bg-gray-800 text-white px-2 py-1 rounded">npm run dev:test</code>
            <span className="ml-2 text-gray-600">→ Test</span>
          </div>
          <div>
            <code className="bg-gray-800 text-white px-2 py-1 rounded">npm run build:production</code>
            <span className="ml-2 text-gray-600">→ Production</span>
          </div>
        </div>
      </div>
    </div>
  );
}
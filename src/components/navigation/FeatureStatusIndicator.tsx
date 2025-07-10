import type { Environment, FeatureFlags } from '../../types/environment';

interface FeatureStatusIndicatorProps {
  environment: Environment;
  features: FeatureFlags;
}

export function FeatureStatusIndicator({ environment, features }: FeatureStatusIndicatorProps) {
  const getEnvironmentColor = (env: Environment) => {
    switch (env) {
      case 'local': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'dev': return 'bg-green-100 text-green-800 border-green-200';
      case 'test': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'prod': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEnvironmentIcon = (env: Environment) => {
    switch (env) {
      case 'local': return '💻';
      case 'dev': return '🚧';
      case 'test': return '🧪';
      case 'prod': return '🚀';
      default: return '❓';
    }
  };

  const enabledFeatures = Object.entries(features).filter(([, enabled]) => enabled);
  const totalFeatures = Object.keys(features).length;

  return (
    <div className="space-y-3">
      {/* Environment Status */}
      <div className="text-center">
        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border font-medium text-sm ${getEnvironmentColor(environment)}`}>
          <span aria-hidden="true">{getEnvironmentIcon(environment)}</span>
          {environment.toUpperCase()} Environment
        </div>
      </div>

      {/* Feature Summary */}
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Features Active</span>
          <span className="text-sm text-gray-600">
            {enabledFeatures.length}/{totalFeatures}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(enabledFeatures.length / totalFeatures) * 100}%` }}
          />
        </div>

        {/* Feature List */}
        <div className="space-y-1">
          {Object.entries(features).map(([feature, enabled]) => (
            <div key={feature} className="flex items-center justify-between text-xs">
              <span className="text-gray-600 capitalize">
                {feature.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Environment Info */}
      <div className="text-xs text-gray-500 text-center">
        <div>Some features may be limited</div>
        <div>based on your current environment</div>
      </div>
    </div>
  );
}
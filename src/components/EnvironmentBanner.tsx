import { getEnvironmentConfig } from '../config/environment';

export function EnvironmentBanner() {
  const config = getEnvironmentConfig();
  
  return (
    <div 
      className={`w-full py-3 px-4 border-b-2 ${config.banner.background} ${config.banner.borderColor}`}
      role="banner"
      aria-label={`Environment: ${config.displayName}`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div 
              className={`px-3 py-1 rounded-full font-bold text-sm ${config.banner.color} bg-white border ${config.banner.borderColor}`}
            >
              {config.displayName}
            </div>
            <span className={`text-sm font-medium ${config.banner.color}`}>
              Environment
            </span>
          </div>
          <div className={`text-xs ${config.banner.color} opacity-75`}>
            {import.meta.env.VITE_APP_NAME || 'Env Stamp'}
          </div>
        </div>
      </div>
    </div>
  );
}
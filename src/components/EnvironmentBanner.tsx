import { getEnvironmentConfig } from '../config/environment';

export function EnvironmentBanner() {
  const config = getEnvironmentConfig();
  
  return (
    <div 
      className={`w-full py-2 px-4 border-b ${config.banner.background} ${config.banner.borderColor} shadow-sm`}
      role="banner"
      aria-label={`Environment: ${config.displayName}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className={`px-3 py-1 rounded-lg font-semibold text-sm ${config.banner.color} bg-white/90 backdrop-blur-sm shadow-sm ring-1 ring-black/5`}
            >
              {config.displayName}
            </div>
            <span className={`text-sm font-medium ${config.banner.color} hidden sm:inline`}>
              Environment
            </span>
          </div>
          <div className={`text-xs ${config.banner.color} opacity-75 hidden md:block`}>
            {import.meta.env.VITE_APP_NAME || 'Env Stamp'}
          </div>
        </div>
      </div>
    </div>
  );
}
import type { NavigationItem as NavigationItemType } from '../../types/navigation';

interface NavigationItemProps {
  item: NavigationItemType;
  isActive: boolean;
  isEnabled: boolean;
  onClick: () => void;
  showTooltips: boolean;
}

export function NavigationItem({ 
  item, 
  isActive, 
  isEnabled, 
  onClick, 
  showTooltips 
}: NavigationItemProps) {
  const handleClick = () => {
    if (isEnabled) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && isEnabled) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
          isActive
            ? 'bg-blue-100 text-blue-800 border border-blue-200'
            : isEnabled
              ? 'text-gray-700 hover:bg-gray-100 focus:bg-gray-100'
              : 'text-gray-400 cursor-not-allowed'
        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        disabled={!isEnabled}
        aria-label={`${item.label}${!isEnabled ? ' (disabled)' : ''}`}
        title={showTooltips ? item.description : undefined}
      >
        <span className="text-lg flex-shrink-0" aria-hidden="true">
          {item.icon}
        </span>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-medium truncate">
              {item.label}
            </span>
            {item.shortcut && (
              <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                {item.shortcut}
              </span>
            )}
          </div>
          
          {!isEnabled && (
            <span className="text-xs text-gray-400 block">
              Not available in current environment
            </span>
          )}
        </div>

        {!isEnabled && (
          <span className="text-gray-300 flex-shrink-0" aria-hidden="true">
            🔒
          </span>
        )}
      </button>

      {/* Tooltip for detailed information */}
      {showTooltips && (
        <div className="absolute left-full top-0 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 w-64">
          <div className="font-medium mb-1">{item.label}</div>
          <div className="text-gray-300 text-xs">{item.description}</div>
          {item.shortcut && (
            <div className="text-gray-400 text-xs mt-1">
              Shortcut: {item.shortcut}
            </div>
          )}
          {!isEnabled && (
            <div className="text-red-300 text-xs mt-1">
              ⚠️ Feature not available in current environment
            </div>
          )}
          
          {/* Arrow */}
          <div className="absolute top-2 -left-1 w-2 h-2 bg-gray-900 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
}
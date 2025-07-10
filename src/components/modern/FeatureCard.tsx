import { useState } from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  status: 'active' | 'inactive' | 'warning';
  value?: string | number;
  gradient?: string;
  onClick?: () => void;
  disabled?: boolean;
  badge?: string;
  children?: React.ReactNode;
}

export function FeatureCard({
  title,
  description,
  icon,
  status,
  value,
  gradient = 'from-blue-500 to-purple-600',
  onClick,
  disabled = false,
  badge,
  children
}: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          dot: 'bg-green-400',
          text: 'text-green-400',
          border: 'border-green-400/20'
        };
      case 'warning':
        return {
          dot: 'bg-yellow-400',
          text: 'text-yellow-400',
          border: 'border-yellow-400/20'
        };
      case 'inactive':
      default:
        return {
          dot: 'bg-red-400',
          text: 'text-red-400',
          border: 'border-red-400/20'
        };
    }
  };

  const statusConfig = getStatusConfig();

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={`modern-card group cursor-pointer relative overflow-hidden ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-label={`${title}: ${description}`}
    >
      {/* Background Animation */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
      
      {/* Status Indicator */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${statusConfig.dot} ${status === 'active' ? 'animate-pulse' : ''}`} />
          <span className={`text-sm font-medium ${statusConfig.text}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        
        {badge && (
          <div className="px-2 py-1 rounded-full bg-white/10 text-white text-xs font-medium">
            {badge}
          </div>
        )}
      </div>

      {/* Icon and Value */}
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center transform transition-transform duration-300 ${
          isHovered && !disabled ? 'scale-110 rotate-3' : ''
        }`}>
          <span className="text-2xl">{icon}</span>
        </div>
        
        {value !== undefined && (
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{value}</div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mb-4">
        <h3 className="text-white font-bold text-lg mb-2 group-hover:text-white transition-colors">
          {title}
        </h3>
        <p className="text-white/70 text-sm leading-relaxed">
          {description}
        </p>
      </div>

      {/* Additional Content */}
      {children && (
        <div className="mb-4">
          {children}
        </div>
      )}

      {/* Action Indicator */}
      {onClick && !disabled && (
        <div className="flex items-center justify-between text-white/60 group-hover:text-white transition-colors">
          <span className="text-sm font-medium">
            {isHovered ? 'Click to open' : 'View details'}
          </span>
          <svg 
            className={`w-5 h-5 transform transition-transform duration-300 ${
              isHovered ? 'translate-x-1' : ''
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}

      {/* Hover Effects */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradient} transform origin-left transition-transform duration-300 ${
        isHovered && !disabled ? 'scale-x-100' : 'scale-x-0'
      }`} />
      
      <div className={`absolute bottom-0 right-0 w-1 h-full bg-gradient-to-t ${gradient} transform origin-bottom transition-transform duration-300 ${
        isHovered && !disabled ? 'scale-y-100' : 'scale-y-0'
      }`} />
    </div>
  );
}
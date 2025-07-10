interface ModernLoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ModernLoading({ message = 'Loading...', size = 'md' }: ModernLoadingProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-24 h-24'
  };

  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full border-4 border-white/20 border-t-white animate-spin mb-4`}></div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 animate-pulse"></div>
      </div>
      <p className="text-white/70 text-center">{message}</p>
    </div>
  );
}
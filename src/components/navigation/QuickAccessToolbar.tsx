import { useState, useEffect } from 'react';
import { NavigationService } from '../../services/navigation';
import { getFeatureFlags, getCurrentEnvironment } from '../../config/environment';
import type { NavigationItem } from '../../types/navigation';

interface QuickAccessToolbarProps {
  currentView: string;
  onNavigate: (path: string, viewName: string) => void;
}

export function QuickAccessToolbar({ currentView, onNavigate }: QuickAccessToolbarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const features = getFeatureFlags();
  const environment = getCurrentEnvironment();

  // Get quick access items (items with shortcuts + most used features)
  const quickAccessItems = NavigationService.getVisibleNavigationItems(features)
    .filter(item => item.shortcut || ['journal', 'dashboard', 'debug-panel', 'learning-hub'].includes(item.id))
    .slice(0, 6);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle quick access with Ctrl/Cmd + /
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setIsVisible(!isVisible);
      }

      // Handle shortcut keys when quick access is visible
      if (isVisible) {
        const item = quickAccessItems.find(item => {
          if (!item.shortcut) return false;
          
          // Simple shortcut (single key)
          if (item.shortcut.length === 1) {
            return e.key.toLowerCase() === item.shortcut.toLowerCase() && !e.ctrlKey && !e.metaKey && !e.altKey;
          }
          
          // Complex shortcut (e.g., "Shift+D")
          const parts = item.shortcut.split('+');
          if (parts.length === 2) {
            const [modifier, key] = parts;
            return (
              e.key.toLowerCase() === key.toLowerCase() &&
              ((modifier === 'Shift' && e.shiftKey) ||
               (modifier === 'Ctrl' && e.ctrlKey) ||
               (modifier === 'Alt' && e.altKey) ||
               (modifier === 'Meta' && e.metaKey))
            );
          }
          
          return false;
        });

        if (item && item.isEnabled(features)) {
          e.preventDefault();
          onNavigate(item.path, item.id);
          setIsVisible(false);
        }
      }

      // Close on Escape
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, quickAccessItems, features, onNavigate]);

  const handleItemClick = (item: NavigationItem) => {
    if (item.isEnabled(features)) {
      onNavigate(item.path, item.id);
      setIsVisible(false);
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          aria-label="Open quick access toolbar"
          title="Quick Access (⌘/)"
        >
          <span className="text-lg">⚡</span>
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-20 z-40"
        onClick={() => setIsVisible(false)}
      />
      
      {/* Quick Access Panel */}
      <div className="fixed bottom-4 right-4 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 w-80">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Quick Access</h3>
              <p className="text-sm text-gray-500">
                {environment.toUpperCase()} Environment
              </p>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
              aria-label="Close quick access"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {quickAccessItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`p-3 rounded-lg text-left transition-colors ${
                  currentView === item.id
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : item.isEnabled(features)
                      ? 'hover:bg-gray-100 focus:bg-gray-100'
                      : 'opacity-50 cursor-not-allowed'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                disabled={!item.isEnabled(features)}
                title={item.description}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium text-sm truncate">{item.label}</span>
                </div>
                {item.shortcut && (
                  <div className="text-xs text-gray-500">
                    {item.shortcut}
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              <div>• Press ⌘/ to toggle this panel</div>
              <div>• Use keyboard shortcuts to navigate</div>
              <div>• Press Escape to close</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
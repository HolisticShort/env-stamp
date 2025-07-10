import { useState } from 'react';
import { NavigationService } from '../../services/navigation';
import { getFeatureFlags, getCurrentEnvironment } from '../../config/environment';
import type { NavigationCategory } from '../../types/navigation';

interface ModernSidebarProps {
  currentView: string;
  onNavigate: (path: string, viewName: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ModernSidebar({ currentView, onNavigate, isOpen, onClose }: ModernSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NavigationCategory | 'all'>('all');
  
  const features = getFeatureFlags();
  const environment = getCurrentEnvironment();
  const categories = NavigationService.getCategories();

  const visibleItems = searchQuery 
    ? NavigationService.searchNavigationItems(searchQuery, features)
    : selectedCategory === 'all' 
      ? NavigationService.getVisibleNavigationItems(features)
      : NavigationService.getNavigationItemsByCategory(selectedCategory, features);

  const handleNavigate = (item: any) => {
    if (item.isEnabled(features)) {
      onNavigate(item.path, item.id);
      onClose();
    }
  };

  const getFeatureStatusIcon = (item: any) => {
    if (!item.isEnabled(features)) return '🔒';
    if (currentView === item.id) return '🔥';
    return '✨';
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-50 h-full w-80 glass border-r border-white/20 transform transition-transform duration-300 ease-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">Navigation</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors lg:hidden"
                aria-label="Close sidebar"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Environment Status */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white font-medium">{environment.toUpperCase()}</span>
              </div>
              <div className="text-white/70 text-sm">
                {Object.values(features).filter(Boolean).length} of {Object.keys(features).length} features active
              </div>
              <div className="mt-2 w-full bg-white/10 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${(Object.values(features).filter(Boolean).length / Object.keys(features).length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="p-6 border-b border-white/10">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search features..."
                className="modern-input pl-12"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="p-6 border-b border-white/10">
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-lg">🌟</span>
                <span className="font-medium">All Features</span>
                <span className="ml-auto text-sm opacity-70">{visibleItems.length}</span>
              </button>
              
              {categories.map(category => {
                const categoryItems = NavigationService.getNavigationItemsByCategory(category.id, features);
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      selectedCategory === category.id
                        ? 'bg-white/20 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span className="font-medium">{category.label}</span>
                    <span className="ml-auto text-sm opacity-70">{categoryItems.length}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-2">
              {visibleItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item)}
                  disabled={!item.isEnabled(features)}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all group ${
                    currentView === item.id
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-white/20'
                      : item.isEnabled(features)
                        ? 'text-white/70 hover:text-white hover:bg-white/10'
                        : 'text-white/30 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                    <span className="text-lg">{item.icon}</span>
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-sm opacity-70 line-clamp-1">{item.description}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.shortcut && (
                      <span className="px-2 py-1 rounded-md bg-white/10 text-xs font-mono">
                        {item.shortcut}
                      </span>
                    )}
                    <span className="text-lg">{getFeatureStatusIcon(item)}</span>
                  </div>
                </button>
              ))}
              
              {visibleItems.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-white/50 mb-2">🔍</div>
                  <p className="text-white/70 text-sm">
                    {searchQuery ? `No features found for "${searchQuery}"` : 'No features in this category'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10">
            <div className="text-center text-white/50 text-xs">
              <div>Env Stamp v1.0</div>
              <div>Environment-Driven Development</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
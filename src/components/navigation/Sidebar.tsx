import { useState, useEffect } from 'react';
import { NavigationService } from '../../services/navigation';
import { getFeatureFlags, getCurrentEnvironment } from '../../config/environment';
import { NavigationItem } from './NavigationItem';
import { CategorySection } from './CategorySection';
import { SearchBar } from './SearchBar';
import { FeatureStatusIndicator } from './FeatureStatusIndicator';
import type { NavigationCategory } from '../../types/navigation';

interface SidebarProps {
  currentView: string;
  onNavigate: (path: string, viewName: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ currentView, onNavigate, isOpen, onToggle }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NavigationCategory | 'all'>('all');
  const [preferences, setPreferences] = useState(NavigationService.getUserPreferences());
  
  const features = getFeatureFlags();
  const environment = getCurrentEnvironment();
  const categories = NavigationService.getCategories();

  useEffect(() => {
    const prefs = NavigationService.getUserPreferences();
    setPreferences(prefs);
  }, []);

  const visibleItems = searchQuery 
    ? NavigationService.searchNavigationItems(searchQuery, features)
    : selectedCategory === 'all' 
      ? NavigationService.getVisibleNavigationItems(features)
      : NavigationService.getNavigationItemsByCategory(selectedCategory, features);

  const handleNavigate = (item: any) => {
    if (item.isEnabled(features)) {
      onNavigate(item.path, item.id);
    }
  };

  const handleCategorySelect = (category: NavigationCategory | 'all') => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const togglePreference = (key: keyof typeof preferences) => {
    const newPrefs = { ...preferences, [key]: !preferences[key] };
    setPreferences(newPrefs);
    NavigationService.saveUserPreferences(newPrefs);
  };

  const categorizedItems = categories.map(category => ({
    category,
    items: NavigationService.getNavigationItemsByCategory(category.id, features)
  })).filter(group => group.items.length > 0);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${preferences.sidebarCollapsed ? 'w-16' : 'w-80'}`}
        aria-label="Main navigation"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {!preferences.sidebarCollapsed && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
                <p className="text-sm text-gray-500">
                  Environment: <span className="font-medium">{environment.toUpperCase()}</span>
                </p>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => togglePreference('sidebarCollapsed')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                aria-label={preferences.sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                title={preferences.sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {preferences.sidebarCollapsed ? '→' : '←'}
              </button>
              
              <button
                onClick={onToggle}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
                aria-label="Close sidebar"
              >
                ✕
              </button>
            </div>
          </div>

          {!preferences.sidebarCollapsed && (
            <>
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <SearchBar 
                  query={searchQuery}
                  onQueryChange={setSearchQuery}
                  placeholder="Search features..."
                />
              </div>

              {/* Category Filter */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleCategorySelect('all')}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={category.description}
                    >
                      {category.icon} {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Environment Status */}
              <div className="p-4 border-b border-gray-200">
                <FeatureStatusIndicator 
                  environment={environment}
                  features={features}
                />
              </div>
            </>
          )}

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto">
            {preferences.sidebarCollapsed ? (
              <div className="p-2 space-y-2">
                {visibleItems.slice(0, 8).map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item)}
                    className={`w-full p-3 rounded-lg transition-colors ${
                      currentView === item.id
                        ? 'bg-blue-100 text-blue-800'
                        : item.isEnabled(features)
                          ? 'text-gray-700 hover:bg-gray-100'
                          : 'text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!item.isEnabled(features)}
                    title={`${item.label}: ${item.description}`}
                    aria-label={item.label}
                  >
                    <span className="text-lg">{item.icon}</span>
                  </button>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  Search Results ({visibleItems.length})
                </h3>
                <div className="space-y-1">
                  {visibleItems.map(item => (
                    <NavigationItem
                      key={item.id}
                      item={item}
                      isActive={currentView === item.id}
                      isEnabled={item.isEnabled(features)}
                      onClick={() => handleNavigate(item)}
                      showTooltips={preferences.showTooltips}
                    />
                  ))}
                </div>
                {visibleItems.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No features found matching "{searchQuery}"
                  </p>
                )}
              </div>
            ) : selectedCategory === 'all' ? (
              <div className="p-4 space-y-6">
                {categorizedItems.map(({ category, items }) => (
                  <CategorySection
                    key={category.id}
                    category={category}
                    items={items}
                    currentView={currentView}
                    features={features}
                    onItemClick={handleNavigate}
                    showTooltips={preferences.showTooltips}
                  />
                ))}
              </div>
            ) : (
              <div className="p-4">
                <div className="space-y-1">
                  {visibleItems.map(item => (
                    <NavigationItem
                      key={item.id}
                      item={item}
                      isActive={currentView === item.id}
                      isEnabled={item.isEnabled(features)}
                      onClick={() => handleNavigate(item)}
                      showTooltips={preferences.showTooltips}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {!preferences.sidebarCollapsed && (
            <div className="p-4 border-t border-gray-200">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={preferences.showTooltips}
                    onChange={() => togglePreference('showTooltips')}
                    className="rounded border-gray-300"
                  />
                  Show tooltips
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={preferences.showDisabledFeatures}
                    onChange={() => togglePreference('showDisabledFeatures')}
                    className="rounded border-gray-300"
                  />
                  Show disabled features
                </label>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
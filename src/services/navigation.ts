import type { 
  NavigationItem, 
  NavigationCategory, 
  NavigationCategoryConfig, 
  FeatureStatus,
  UserNavigationPreferences 
} from '../types/navigation';
import type { Environment, FeatureFlags } from '../types/environment';

export class NavigationService {
  private static readonly PREFERENCES_KEY = 'env-stamp-navigation-preferences';
  
  private static readonly categories: NavigationCategoryConfig[] = [
    {
      id: 'core',
      label: 'Core Features',
      icon: '🏠',
      description: 'Essential application features',
      order: 1
    },
    {
      id: 'development',
      label: 'Development',
      icon: '🔧',
      description: 'Development tools and utilities',
      order: 2
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📊',
      description: 'Performance and usage analytics',
      order: 3
    },
    {
      id: 'learning',
      label: 'Learning',
      icon: '📚',
      description: 'Tutorials and educational content',
      order: 4
    },
    {
      id: 'debug',
      label: 'Debug Tools',
      icon: '🛠️',
      description: 'Debugging and diagnostic tools',
      order: 5
    }
  ];

  private static readonly navigationItems: NavigationItem[] = [
    {
      id: 'journal',
      label: 'Journal',
      icon: '📝',
      path: '/journal',
      category: 'core',
      requiredFeatures: [],
      description: 'Write and manage journal entries across environments',
      shortcut: 'J',
      isVisible: () => true,
      isEnabled: () => true
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📈',
      path: '/dashboard',
      category: 'analytics',
      requiredFeatures: ['dashboard'],
      description: 'Performance metrics and system overview',
      shortcut: 'D',
      isVisible: (features) => features.dashboard,
      isEnabled: (features) => features.dashboard
    },
    {
      id: 'learning-hub',
      label: 'Learning Hub',
      icon: '🎓',
      path: '/learning',
      category: 'learning',
      requiredFeatures: [],
      description: 'Interactive tutorials and environment guides',
      shortcut: 'L',
      isVisible: () => true,
      isEnabled: () => true
    },
    {
      id: 'tutorials',
      label: 'Tutorials',
      icon: '📖',
      path: '/learning/tutorials',
      category: 'learning',
      requiredFeatures: [],
      description: 'Step-by-step learning guides',
      isVisible: () => true,
      isEnabled: () => true
    },
    {
      id: 'environment-comparison',
      label: 'Environment Comparison',
      icon: '🔍',
      path: '/learning/comparison',
      category: 'learning',
      requiredFeatures: [],
      description: 'Compare features across different environments',
      isVisible: () => true,
      isEnabled: () => true
    },
    {
      id: 'running-services',
      label: 'Running Services',
      icon: '⚡',
      path: '/services',
      category: 'development',
      requiredFeatures: [],
      description: 'Monitor and manage running services',
      isVisible: () => true,
      isEnabled: () => true
    },
    {
      id: 'performance-metrics',
      label: 'Performance Metrics',
      icon: '📊',
      path: '/metrics',
      category: 'analytics',
      requiredFeatures: ['performanceMetrics'],
      description: 'Detailed performance analytics and monitoring',
      isVisible: (features) => features.performanceMetrics,
      isEnabled: (features) => features.performanceMetrics
    },
    {
      id: 'debug-panel',
      label: 'Debug Panel',
      icon: '🐛',
      path: '/debug',
      category: 'debug',
      requiredFeatures: ['debugPanel'],
      description: 'Development debugging tools and system information',
      shortcut: 'Shift+D',
      isVisible: (features) => features.debugPanel,
      isEnabled: (features) => features.debugPanel
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📈',
      path: '/analytics',
      category: 'analytics',
      requiredFeatures: ['analytics'],
      description: 'User analytics and tracking dashboard',
      isVisible: (features) => features.analytics,
      isEnabled: (features) => features.analytics
    },
    {
      id: 'database',
      label: 'Database',
      icon: '🗄️',
      path: '/database',
      category: 'development',
      requiredFeatures: ['supabase'],
      description: 'Database management and monitoring',
      isVisible: (features) => features.supabase,
      isEnabled: (features) => features.supabase
    }
  ];

  static getCategories(): NavigationCategoryConfig[] {
    return [...this.categories].sort((a, b) => a.order - b.order);
  }

  static getAllNavigationItems(): NavigationItem[] {
    return [...this.navigationItems];
  }

  static getVisibleNavigationItems(features: FeatureFlags): NavigationItem[] {
    return this.navigationItems.filter(item => item.isVisible(features));
  }

  static getNavigationItemsByCategory(category: NavigationCategory, features: FeatureFlags): NavigationItem[] {
    return this.getVisibleNavigationItems(features)
      .filter(item => item.category === category);
  }

  static getFeatureStatus(itemId: string, features: FeatureFlags, environment: Environment): FeatureStatus {
    const item = this.navigationItems.find(i => i.id === itemId);
    if (!item) {
      return {
        id: itemId,
        enabled: false,
        available: false,
        reason: 'Feature not found',
        environment
      };
    }

    const isVisible = item.isVisible(features);
    const isEnabled = item.isEnabled(features);
    
    let reason: string | undefined;
    if (!isVisible) {
      reason = `Feature not available in ${environment} environment`;
    } else if (!isEnabled) {
      reason = `Feature disabled in ${environment} environment`;
    }

    return {
      id: itemId,
      enabled: isEnabled,
      available: isVisible,
      reason,
      environment
    };
  }

  static searchNavigationItems(query: string, features: FeatureFlags): NavigationItem[] {
    if (!query.trim()) {
      return this.getVisibleNavigationItems(features);
    }

    const searchTerm = query.toLowerCase();
    return this.getVisibleNavigationItems(features).filter(item => 
      item.label.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm)
    );
  }

  static getDefaultPreferences(): UserNavigationPreferences {
    return {
      sidebarCollapsed: false,
      showTooltips: true,
      showDisabledFeatures: true,
      preferredView: 'list',
      completedOnboarding: false
    };
  }

  static getUserPreferences(): UserNavigationPreferences {
    try {
      const stored = localStorage.getItem(this.PREFERENCES_KEY);
      if (stored) {
        return { ...this.getDefaultPreferences(), ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load navigation preferences:', error);
    }
    return this.getDefaultPreferences();
  }

  static saveUserPreferences(preferences: Partial<UserNavigationPreferences>): void {
    try {
      const current = this.getUserPreferences();
      const updated = { ...current, ...preferences };
      localStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save navigation preferences:', error);
    }
  }

  static getCategoryIcon(category: NavigationCategory): string {
    const categoryConfig = this.categories.find(c => c.id === category);
    return categoryConfig?.icon || '📂';
  }

  static getCategoryLabel(category: NavigationCategory): string {
    const categoryConfig = this.categories.find(c => c.id === category);
    return categoryConfig?.label || category;
  }

  static getCategoryDescription(category: NavigationCategory): string {
    const categoryConfig = this.categories.find(c => c.id === category);
    return categoryConfig?.description || '';
  }
}
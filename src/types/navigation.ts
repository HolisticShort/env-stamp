import type { Environment, FeatureFlags } from './environment';

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  category: NavigationCategory;
  requiredFeatures: (keyof FeatureFlags)[];
  description: string;
  shortcut?: string;
  isVisible: (features: FeatureFlags) => boolean;
  isEnabled: (features: FeatureFlags) => boolean;
}

export type NavigationCategory = 'core' | 'development' | 'analytics' | 'learning' | 'debug';

export interface NavigationCategoryConfig {
  id: NavigationCategory;
  label: string;
  icon: string;
  description: string;
  order: number;
}

export interface NavigationState {
  sidebarOpen: boolean;
  currentPath: string;
  searchQuery: string;
  selectedCategory: NavigationCategory | 'all';
  preferences: UserNavigationPreferences;
}

export interface UserNavigationPreferences {
  sidebarCollapsed: boolean;
  showTooltips: boolean;
  showDisabledFeatures: boolean;
  preferredView: 'grid' | 'list';
  completedOnboarding: boolean;
}

export interface FeatureStatus {
  id: string;
  enabled: boolean;
  available: boolean;
  reason?: string;
  environment: Environment;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  shortcut?: string;
  category: NavigationCategory;
}
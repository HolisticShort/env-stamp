export type Environment = 'local' | 'dev' | 'test' | 'prod';

export interface EnvironmentConfig {
  name: Environment;
  displayName: string;
  banner: {
    color: string;
    background: string;
    borderColor: string;
  };
  features: {
    debugPanel: boolean;
    analytics: boolean;
    supabase: boolean;
    dashboard: boolean;
    performanceMetrics: boolean;
    advancedMetrics: boolean;
  };
}

export interface JournalEntry {
  id: string;
  content: string;
  timestamp: string;
  environment: Environment;
}

export interface FeatureFlags {
  debugPanel: boolean;
  analytics: boolean;
  supabase: boolean;
  dashboard: boolean;
  performanceMetrics: boolean;
  advancedMetrics: boolean;
}
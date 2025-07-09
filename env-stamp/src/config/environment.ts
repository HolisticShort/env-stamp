import type { Environment, EnvironmentConfig } from '../types/environment';

const environmentConfigs: Record<Environment, EnvironmentConfig> = {
  local: {
    name: 'local',
    displayName: 'LOCAL',
    banner: {
      color: 'text-blue-800',
      background: 'bg-blue-100',
      borderColor: 'border-blue-300',
    },
    features: {
      debugPanel: true,
      analytics: false,
      supabase: false,
    },
  },
  dev: {
    name: 'dev',
    displayName: 'DEVELOPMENT',
    banner: {
      color: 'text-green-800',
      background: 'bg-green-100',
      borderColor: 'border-green-300',
    },
    features: {
      debugPanel: true,
      analytics: false,
      supabase: false,
    },
  },
  test: {
    name: 'test',
    displayName: 'TEST',
    banner: {
      color: 'text-yellow-800',
      background: 'bg-yellow-100',
      borderColor: 'border-yellow-300',
    },
    features: {
      debugPanel: true,
      analytics: false,
      supabase: false,
    },
  },
  prod: {
    name: 'prod',
    displayName: 'PRODUCTION',
    banner: {
      color: 'text-red-800',
      background: 'bg-red-100',
      borderColor: 'border-red-300',
    },
    features: {
      debugPanel: false,
      analytics: true,
      supabase: true,
    },
  },
};

export function getCurrentEnvironment(): Environment {
  const envVar = import.meta.env.VITE_APP_ENV as Environment;
  return envVar && envVar in environmentConfigs ? envVar : 'local';
}

export function getEnvironmentConfig(): EnvironmentConfig {
  const currentEnv = getCurrentEnvironment();
  return environmentConfigs[currentEnv];
}

export function getFeatureFlags() {
  return getEnvironmentConfig().features;
}
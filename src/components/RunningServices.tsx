import { useState, useEffect, useCallback } from 'react';
import { getCurrentEnvironment, getFeatureFlags } from '../config/environment';
import type { Environment } from '../types/environment';

interface ServiceStatus {
  id: string;
  name: string;
  type: 'development' | 'build' | 'external' | 'feature';
  status: 'running' | 'stopped' | 'error' | 'unknown';
  port?: number;
  url?: string;
  description?: string;
  environment: Environment;
  lastChecked: string;
}

export function RunningServices() {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentEnvironment = getCurrentEnvironment();
  const features = getFeatureFlags();

  const detectServices = useCallback(async (): Promise<ServiceStatus[]> => {
    const detectedServices: ServiceStatus[] = [];
    const now = new Date().toISOString();

    // Check Vite dev server
    try {
      await fetch('http://localhost:5173/', { 
        method: 'HEAD',
        mode: 'no-cors'
      });
      detectedServices.push({
        id: 'vite-dev',
        name: 'Vite Development Server',
        type: 'development',
        status: 'running',
        port: 5173,
        url: 'http://localhost:5173/',
        description: 'Main development server for the application',
        environment: currentEnvironment,
        lastChecked: now
      });
    } catch {
      if (currentEnvironment === 'local') {
        detectedServices.push({
          id: 'vite-dev',
          name: 'Vite Development Server',
          type: 'development',
          status: 'stopped',
          port: 5173,
          description: 'Main development server for the application',
          environment: currentEnvironment,
          lastChecked: now
        });
      }
    }

    // Check common development ports
    const commonPorts = [3000, 3001, 4000, 4173, 8000, 8080, 8081];
    
    for (const port of commonPorts) {
      if (port === 5173) continue; // Already checked
      
      try {
        await fetch(`http://localhost:${port}/`, { 
          method: 'HEAD',
          mode: 'no-cors'
        });
        detectedServices.push({
          id: `service-${port}`,
          name: `Service on port ${port}`,
          type: 'external',
          status: 'running',
          port,
          url: `http://localhost:${port}/`,
          description: `External service running on port ${port}`,
          environment: currentEnvironment,
          lastChecked: now
        });
      } catch {
        // Service not running, skip
      }
    }

    // Add environment-specific feature services
    if (features.analytics) {
      detectedServices.push({
        id: 'analytics',
        name: 'Analytics Service',
        type: 'feature',
        status: 'running',
        description: 'User analytics and tracking service',
        environment: currentEnvironment,
        lastChecked: now
      });
    }

    if (features.supabase) {
      detectedServices.push({
        id: 'supabase',
        name: 'Supabase Database',
        type: 'external',
        status: 'running',
        description: 'Database and authentication service',
        environment: currentEnvironment,
        lastChecked: now
      });
    }

    if (features.performanceMetrics) {
      detectedServices.push({
        id: 'metrics',
        name: 'Performance Metrics',
        type: 'feature',
        status: 'running',
        description: 'Application performance monitoring',
        environment: currentEnvironment,
        lastChecked: now
      });
    }

    if (features.debugPanel) {
      detectedServices.push({
        id: 'debug',
        name: 'Debug Panel',
        type: 'feature',
        status: 'running',
        description: 'Development debugging tools',
        environment: currentEnvironment,
        lastChecked: now
      });
    }

    // Add build-related services for non-local environments
    if (currentEnvironment !== 'local') {
      detectedServices.push({
        id: 'build-process',
        name: 'Build Process',
        type: 'build',
        status: 'running',
        description: 'Application build and deployment pipeline',
        environment: currentEnvironment,
        lastChecked: now
      });
    }

    return detectedServices;
  }, [currentEnvironment, features]);

  useEffect(() => {
    const loadServices = async () => {
      setIsLoading(true);
      try {
        const detectedServices = await detectServices();
        setServices(detectedServices);
      } catch (error) {
        console.error('Failed to detect services:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadServices, 30000);
    return () => clearInterval(interval);
  }, [detectServices]);

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800';
      case 'stopped': return 'bg-red-100 text-red-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: ServiceStatus['type']) => {
    switch (type) {
      case 'development': return '🔧';
      case 'build': return '🏗️';
      case 'external': return '🌐';
      case 'feature': return '⚡';
      default: return '❓';
    }
  };

  const getTypeColor = (type: ServiceStatus['type']) => {
    switch (type) {
      case 'development': return 'bg-blue-100 text-blue-800';
      case 'build': return 'bg-purple-100 text-purple-800';
      case 'external': return 'bg-orange-100 text-orange-800';
      case 'feature': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Running Services</h3>
          <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        </div>
        <p className="text-gray-600">Detecting services...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Running Services</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {services.length} service{services.length !== 1 ? 's' : ''} detected
            </span>
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
              currentEnvironment === 'local' ? 'bg-blue-100 text-blue-800' :
              currentEnvironment === 'dev' ? 'bg-green-100 text-green-800' :
              currentEnvironment === 'test' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {currentEnvironment.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {services.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No running services detected</p>
            <p className="text-sm text-gray-400 mt-2">
              Services will appear here when they are running in the {currentEnvironment} environment
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getTypeIcon(service.type)}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{service.name}</h4>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(service.status)}`}>
                          {service.status.toUpperCase()}
                        </span>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getTypeColor(service.type)}`}>
                          {service.type.toUpperCase()}
                        </span>
                      </div>
                      {service.description && (
                        <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {service.port && (
                          <span>Port: {service.port}</span>
                        )}
                        {service.url && (
                          <a
                            href={service.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            Open →
                          </a>
                        )}
                        <span>Last checked: {new Date(service.lastChecked).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
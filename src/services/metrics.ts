import { getCurrentEnvironment } from '../config/environment';

export interface PerformanceMetrics {
  id: string;
  timestamp: string;
  environment: string;
  pageLoadTime: number;
  renderTime: number;
  memoryUsage: number;
  networkRequests: number;
  userInteractions: number;
  errors: number;
}

export interface MetricsSummary {
  totalEntries: number;
  avgPageLoadTime: number;
  avgRenderTime: number;
  avgMemoryUsage: number;
  totalNetworkRequests: number;
  totalUserInteractions: number;
  totalErrors: number;
  environment: string;
}

const METRICS_KEY = 'env-stamp-metrics';

export class MetricsService {
  private static performanceObserver: PerformanceObserver | null = null;
  private static currentMetrics: Partial<PerformanceMetrics> = {};

  static initialize(): void {
    this.currentMetrics = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      environment: getCurrentEnvironment(),
      pageLoadTime: 0,
      renderTime: 0,
      memoryUsage: 0,
      networkRequests: 0,
      userInteractions: 0,
      errors: 0,
    };

    this.startPerformanceMonitoring();
    this.startMemoryMonitoring();
    this.startNetworkMonitoring();
    this.startUserInteractionMonitoring();
    this.startErrorMonitoring();
  }

  private static startPerformanceMonitoring(): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Page load time
      const loadTime = performance.timing?.loadEventEnd - performance.timing?.navigationStart;
      if (loadTime > 0) {
        this.currentMetrics.pageLoadTime = loadTime;
      }

      // Render time using performance observer
      if ('PerformanceObserver' in window) {
        try {
          this.performanceObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
                this.currentMetrics.renderTime = entry.startTime;
              }
            });
          });
          this.performanceObserver.observe({ entryTypes: ['paint'] });
        } catch (error) {
          console.warn('Performance Observer not supported:', error);
        }
      }
    }
  }

  private static startMemoryMonitoring(): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const memory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory;
      if (memory) {
        this.currentMetrics.memoryUsage = memory.usedJSHeapSize;
      }
    }
  }

  private static startNetworkMonitoring(): void {
    if (typeof window !== 'undefined') {
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        this.currentMetrics.networkRequests = (this.currentMetrics.networkRequests || 0) + 1;
        return originalFetch(...args);
      };
    }
  }

  private static startUserInteractionMonitoring(): void {
    if (typeof window !== 'undefined') {
      const events = ['click', 'keydown', 'touchstart', 'submit'];
      events.forEach(event => {
        document.addEventListener(event, () => {
          this.currentMetrics.userInteractions = (this.currentMetrics.userInteractions || 0) + 1;
        });
      });
    }
  }

  private static startErrorMonitoring(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('error', () => {
        this.currentMetrics.errors = (this.currentMetrics.errors || 0) + 1;
      });

      window.addEventListener('unhandledrejection', () => {
        this.currentMetrics.errors = (this.currentMetrics.errors || 0) + 1;
      });
    }
  }

  static recordMetrics(): void {
    if (this.currentMetrics.id) {
      const metrics: PerformanceMetrics = {
        id: this.currentMetrics.id,
        timestamp: this.currentMetrics.timestamp || new Date().toISOString(),
        environment: this.currentMetrics.environment || getCurrentEnvironment(),
        pageLoadTime: this.currentMetrics.pageLoadTime || 0,
        renderTime: this.currentMetrics.renderTime || 0,
        memoryUsage: this.currentMetrics.memoryUsage || 0,
        networkRequests: this.currentMetrics.networkRequests || 0,
        userInteractions: this.currentMetrics.userInteractions || 0,
        errors: this.currentMetrics.errors || 0,
      };

      this.saveMetrics(metrics);
    }
  }

  private static saveMetrics(metrics: PerformanceMetrics): void {
    try {
      const existingMetrics = this.getAllMetrics();
      const updatedMetrics = [metrics, ...existingMetrics.slice(0, 99)]; // Keep last 100 entries
      localStorage.setItem(METRICS_KEY, JSON.stringify(updatedMetrics));
    } catch (error) {
      console.error('Failed to save metrics:', error);
    }
  }

  static getAllMetrics(): PerformanceMetrics[] {
    try {
      const stored = localStorage.getItem(METRICS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load metrics:', error);
      return [];
    }
  }

  static getMetricsByEnvironment(environment: string): PerformanceMetrics[] {
    return this.getAllMetrics().filter(metric => metric.environment === environment);
  }

  static getMetricsSummary(environment?: string): MetricsSummary {
    const metrics = environment ? this.getMetricsByEnvironment(environment) : this.getAllMetrics();
    
    if (metrics.length === 0) {
      return {
        totalEntries: 0,
        avgPageLoadTime: 0,
        avgRenderTime: 0,
        avgMemoryUsage: 0,
        totalNetworkRequests: 0,
        totalUserInteractions: 0,
        totalErrors: 0,
        environment: environment || 'all',
      };
    }

    return {
      totalEntries: metrics.length,
      avgPageLoadTime: metrics.reduce((sum, m) => sum + m.pageLoadTime, 0) / metrics.length,
      avgRenderTime: metrics.reduce((sum, m) => sum + m.renderTime, 0) / metrics.length,
      avgMemoryUsage: metrics.reduce((sum, m) => sum + m.memoryUsage, 0) / metrics.length,
      totalNetworkRequests: metrics.reduce((sum, m) => sum + m.networkRequests, 0),
      totalUserInteractions: metrics.reduce((sum, m) => sum + m.userInteractions, 0),
      totalErrors: metrics.reduce((sum, m) => sum + m.errors, 0),
      environment: environment || 'all',
    };
  }

  static clearMetrics(): void {
    try {
      localStorage.removeItem(METRICS_KEY);
    } catch (error) {
      console.error('Failed to clear metrics:', error);
    }
  }

  static cleanup(): void {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
      this.performanceObserver = null;
    }
  }

  private static generateId(): string {
    return `metrics-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
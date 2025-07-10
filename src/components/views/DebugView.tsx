import { DebugPanel } from '../DebugPanel';
import { getFeatureFlags } from '../../config/environment';

export function DebugView() {
  const features = getFeatureFlags();

  if (!features.debugPanel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Debug Panel Not Available</h2>
          <p className="text-gray-600">The debug panel is not enabled in this environment.</p>
          <p className="text-sm text-gray-500 mt-2">
            This feature is available in: local, development, and test environments.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Debug Panel</h1>
          <p className="text-gray-600">
            Development debugging tools and system information
          </p>
        </div>

        {/* Full-featured debug panel */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="relative">
            {/* Remove the fixed positioning and overlay styles for the full view */}
            <div className="debug-panel-content">
              <DebugPanel />
            </div>
          </div>
        </div>

        {/* Additional debug information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">User Agent:</span>
                <span className="text-gray-900 text-right max-w-64 truncate">
                  {navigator.userAgent}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Platform:</span>
                <span className="text-gray-900">{navigator.platform}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Language:</span>
                <span className="text-gray-900">{navigator.language}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Online:</span>
                <span className="text-gray-900">{navigator.onLine ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cookies Enabled:</span>
                <span className="text-gray-900">{navigator.cookieEnabled ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Info</h3>
            <div className="space-y-2 text-sm">
              {(performance as any).memory && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Used JS Heap:</span>
                    <span className="text-gray-900">
                      {((performance as any).memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total JS Heap:</span>
                    <span className="text-gray-900">
                      {((performance as any).memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">JS Heap Limit:</span>
                    <span className="text-gray-900">
                      {((performance as any).memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Page Load Time:</span>
                <span className="text-gray-900">
                  {performance.timing ? 
                    `${performance.timing.loadEventEnd - performance.timing.navigationStart}ms` : 
                    'N/A'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
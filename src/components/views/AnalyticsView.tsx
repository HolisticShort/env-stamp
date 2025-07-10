import { getFeatureFlags } from '../../config/environment';

export function AnalyticsView() {
  const features = getFeatureFlags();

  if (!features.analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics Not Available</h2>
          <p className="text-gray-600">Analytics features are not enabled in this environment.</p>
          <p className="text-sm text-gray-500 mt-2">
            This feature is available in: production environment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">
            User analytics and tracking insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Page Views</h3>
            <p className="text-2xl font-bold text-gray-900">1,234</p>
            <p className="text-sm text-green-600 mt-1">+12% from last week</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Unique Users</h3>
            <p className="text-2xl font-bold text-gray-900">567</p>
            <p className="text-sm text-green-600 mt-1">+8% from last week</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Session Duration</h3>
            <p className="text-2xl font-bold text-gray-900">4m 32s</p>
            <p className="text-sm text-red-600 mt-1">-3% from last week</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Features</h3>
          
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">📊 User Behavior Tracking</h4>
              <p className="text-sm text-gray-600">
                Track user interactions, page views, and navigation patterns across the application.
              </p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">🎯 Feature Usage Analytics</h4>
              <p className="text-sm text-gray-600">
                Monitor which features are being used most frequently and identify areas for improvement.
              </p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">📈 Performance Insights</h4>
              <p className="text-sm text-gray-600">
                Analyze application performance metrics and user experience indicators.
              </p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">🔍 Custom Events</h4>
              <p className="text-sm text-gray-600">
                Track custom events and conversions specific to your application's goals.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">🚀 Coming Soon</h4>
            <p className="text-sm text-blue-700">
              Real-time analytics dashboards, advanced segmentation, and custom report generation 
              are currently in development and will be available in future releases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
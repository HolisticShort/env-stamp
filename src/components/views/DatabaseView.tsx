import { getFeatureFlags } from '../../config/environment';

export function DatabaseView() {
  const features = getFeatureFlags();

  if (!features.supabase) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Database Not Available</h2>
          <p className="text-gray-600">Database features are not enabled in this environment.</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Database Management</h1>
          <p className="text-gray-600">
            Supabase database management and monitoring
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Connection Status</h3>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-lg font-semibold text-gray-900">Connected</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Tables</h3>
            <p className="text-2xl font-bold text-gray-900">5</p>
            <p className="text-sm text-gray-600 mt-1">Active tables</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Storage Used</h3>
            <p className="text-2xl font-bold text-gray-900">12.4 MB</p>
            <p className="text-sm text-gray-600 mt-1">of 500 MB limit</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Features</h3>
          
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">🗄️ Real-time Database</h4>
              <p className="text-sm text-gray-600">
                PostgreSQL database with real-time subscriptions and instant updates.
              </p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">🔐 Authentication</h4>
              <p className="text-sm text-gray-600">
                Built-in user authentication with social providers and email/password.
              </p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">📁 File Storage</h4>
              <p className="text-sm text-gray-600">
                Secure file storage with automatic image optimization and CDN delivery.
              </p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">🔒 Row Level Security</h4>
              <p className="text-sm text-gray-600">
                Fine-grained access control with PostgreSQL's row-level security policies.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-left">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📊</span>
                <span className="font-medium">View Tables</span>
              </div>
              <p className="text-sm text-gray-600">
                Browse and manage database tables and their data.
              </p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-left">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🔧</span>
                <span className="font-medium">SQL Editor</span>
              </div>
              <p className="text-sm text-gray-600">
                Execute custom SQL queries and manage database schema.
              </p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-left">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">👥</span>
                <span className="font-medium">User Management</span>
              </div>
              <p className="text-sm text-gray-600">
                Manage user accounts, roles, and permissions.
              </p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-left">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📈</span>
                <span className="font-medium">Analytics</span>
              </div>
              <p className="text-sm text-gray-600">
                View database usage statistics and performance metrics.
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
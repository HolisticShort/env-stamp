import { RunningServices } from '../RunningServices';

export function ServicesView() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Running Services</h1>
          <p className="text-gray-600">
            Monitor and manage services running in your current environment
          </p>
        </div>

        <RunningServices />
      </div>
    </div>
  );
}
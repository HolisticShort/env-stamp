import { EnvironmentComparison } from '../tutorial/EnvironmentComparison';

export function EnvironmentComparisonView() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Environment Comparison</h1>
          <p className="text-gray-600">
            Compare features and configurations across different environments
          </p>
        </div>

        <EnvironmentComparison />
      </div>
    </div>
  );
}
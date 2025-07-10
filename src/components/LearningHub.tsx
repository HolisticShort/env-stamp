import { useState } from 'react';
import { tutorials } from '../data/tutorials';
import { TutorialService } from '../services/tutorial';
import { TutorialCard } from './tutorial/TutorialCard';
import { TutorialViewer } from './tutorial/TutorialViewer';
import { EnvironmentComparison } from './tutorial/EnvironmentComparison';
import type { Tutorial } from '../types/tutorial';

type ViewMode = 'overview' | 'tutorial' | 'comparison';

export function LearningHub() {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const overallProgress = TutorialService.getOverallProgress();
  const categories = ['all', 'environment', 'git', 'deployment'];

  const filteredTutorials = selectedCategory === 'all' 
    ? tutorials 
    : tutorials.filter(t => t.category === selectedCategory);

  const handleTutorialSelect = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
    setViewMode('tutorial');
  };

  const handleBack = () => {
    setViewMode('overview');
    setSelectedTutorial(null);
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      all: '📚',
      environment: '🌍',
      git: '🔧',
      deployment: '🚀',
    };
    return icons[category as keyof typeof icons] || '📚';
  };

  const getCategoryCount = (category: string) => {
    if (category === 'all') return tutorials.length;
    return tutorials.filter(t => t.category === category).length;
  };

  const getCompletedCount = (category: string) => {
    const tutorialsInCategory = category === 'all' 
      ? tutorials 
      : tutorials.filter(t => t.category === category);
    
    return tutorialsInCategory.filter(t => 
      overallProgress.completedTutorials.includes(t.id)
    ).length;
  };

  if (viewMode === 'tutorial' && selectedTutorial) {
    return <TutorialViewer tutorial={selectedTutorial} onBack={handleBack} />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Hub</h1>
        <p className="text-gray-600 mb-6">
          Master environment-driven development with interactive tutorials and hands-on exercises.
        </p>
        
        {/* Progress Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Your Progress</h3>
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-blue-700">Completed: </span>
              <span className="font-semibold">{overallProgress.completedTutorials.length}</span>
            </div>
            <div>
              <span className="text-blue-700">In Progress: </span>
              <span className="font-semibold">{Object.keys(overallProgress.inProgressTutorials).length}</span>
            </div>
            <div>
              <span className="text-blue-700">Total Available: </span>
              <span className="font-semibold">{tutorials.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setViewMode('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'overview' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📚 Tutorials
          </button>
          <button
            onClick={() => setViewMode('comparison')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'comparison' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🔍 Environment Comparison
          </button>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'overview' && (
        <>
          {/* Category Filter */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    selectedCategory === category
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{getCategoryIcon(category)}</span>
                    <span className="font-medium text-gray-800 capitalize">
                      {category}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {getCompletedCount(category)} / {getCategoryCount(category)} completed
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${getCategoryCount(category) > 0 ? (getCompletedCount(category) / getCategoryCount(category)) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tutorial Grid */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">
              {selectedCategory === 'all' ? 'All Tutorials' : `${selectedCategory} Tutorials`}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTutorials.map((tutorial) => (
                <TutorialCard
                  key={tutorial.id}
                  tutorial={tutorial}
                  onClick={handleTutorialSelect}
                />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  const envTutorial = tutorials.find(t => t.id === 'environment-basics');
                  if (envTutorial) handleTutorialSelect(envTutorial);
                }}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🌍</span>
                  <span className="font-medium">Start with Environment Basics</span>
                </div>
                <p className="text-sm text-gray-600">
                  Perfect for beginners - learn the fundamentals of environment-driven development.
                </p>
              </button>
              
              <button
                onClick={() => setViewMode('comparison')}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🔍</span>
                  <span className="font-medium">Compare Environments</span>
                </div>
                <p className="text-sm text-gray-600">
                  See how different environments affect features and configuration.
                </p>
              </button>
            </div>
          </div>
        </>
      )}

      {viewMode === 'comparison' && (
        <EnvironmentComparison />
      )}
    </div>
  );
}
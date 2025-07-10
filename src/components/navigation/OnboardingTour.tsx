import { useState } from 'react';
import { NavigationService } from '../../services/navigation';
import { getFeatureFlags, getCurrentEnvironment } from '../../config/environment';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface OnboardingTourProps {
  onComplete: () => void;
}

export function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  const features = getFeatureFlags();
  const environment = getCurrentEnvironment();

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Env Stamp!',
      description: `You're currently in the ${environment.toUpperCase()} environment. This tour will help you discover all the available features.`,
      position: 'bottom'
    },
    {
      id: 'sidebar',
      title: 'Enhanced Navigation',
      description: 'The new sidebar shows all available features organized by category. Features are automatically enabled/disabled based on your current environment.',
      target: 'sidebar',
      position: 'right'
    },
    {
      id: 'search',
      title: 'Quick Search',
      description: 'Use the search bar to quickly find features. Try pressing ⌘K for keyboard shortcut access!',
      target: 'search',
      position: 'bottom'
    },
    {
      id: 'status',
      title: 'Feature Status',
      description: 'See which features are active in your current environment and get explanations for disabled features.',
      target: 'status',
      position: 'left'
    },
    {
      id: 'quick-access',
      title: 'Quick Access',
      description: 'Click the lightning bolt in the bottom-right corner (or press ⌘/) for quick access to frequently used features.',
      target: 'quick-access',
      position: 'top'
    }
  ];

  // Filter steps based on available features
  const availableSteps = steps.filter(step => {
    if (step.id === 'status' && !features.debugPanel) return false;
    return true;
  });

  const currentStepData = availableSteps[currentStep];

  const handleNext = () => {
    if (currentStep < availableSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    NavigationService.saveUserPreferences({ completedOnboarding: true });
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isVisible || !currentStepData) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50" />
      
      {/* Tour Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="p-6">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span>Step {currentStep + 1} of {availableSteps.length}</span>
              <button
                onClick={handleSkip}
                className="text-gray-400 hover:text-gray-600"
              >
                Skip tour
              </button>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / availableSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {currentStepData.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {currentStepData.description}
            </p>
          </div>

          {/* Feature Preview */}
          {currentStepData.id === 'sidebar' && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Available Categories:</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span>🏠</span>
                  <span>Core Features (Journal)</span>
                </div>
                {features.dashboard && (
                  <div className="flex items-center gap-2">
                    <span>📊</span>
                    <span>Analytics (Dashboard, Metrics)</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span>📚</span>
                  <span>Learning (Tutorials, Environment Comparison)</span>
                </div>
                {features.debugPanel && (
                  <div className="flex items-center gap-2">
                    <span>🛠️</span>
                    <span>Debug Tools (Debug Panel, Running Services)</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Environment Info */}
          {currentStepData.id === 'welcome' && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Current Environment: {environment.toUpperCase()}</h4>
              <div className="text-sm text-blue-700">
                <div>✅ Features enabled: {Object.values(features).filter(Boolean).length}</div>
                <div>📊 Total features: {Object.keys(features).length}</div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-2">
              {availableSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              {currentStep === availableSteps.length - 1 ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
import { useState, useEffect } from 'react';
import type { Tutorial } from '../../types/tutorial';
import { TutorialService } from '../../services/tutorial';
import { StepCard } from './StepCard';
import { ProgressBar } from './ProgressBar';
import { getCurrentEnvironment } from '../../config/environment';

interface TutorialViewerProps {
  tutorial: Tutorial;
  onBack: () => void;
}

export function TutorialViewer({ tutorial, onBack }: TutorialViewerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const currentEnvironment = getCurrentEnvironment();

  useEffect(() => {
    // Load tutorial progress
    const progress = TutorialService.getTutorialProgress(tutorial.id);
    if (progress) {
      setCurrentStepIndex(progress.currentStepIndex);
      setCompletedSteps(progress.completedSteps);
      setIsCompleted(progress.completed);
    }
    
    // Start tutorial if not already started
    TutorialService.startTutorial(tutorial.id);
  }, [tutorial.id]);

  useEffect(() => {
    // Update current step in service
    TutorialService.setCurrentStep(tutorial.id, currentStepIndex);
  }, [tutorial.id, currentStepIndex]);

  const handleStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      const newCompletedSteps = [...completedSteps, stepId];
      setCompletedSteps(newCompletedSteps);
      TutorialService.completeStep(tutorial.id, stepId);
      
      // Check if all steps are completed
      if (newCompletedSteps.length === tutorial.steps.length) {
        setIsCompleted(true);
        TutorialService.completeTutorial(tutorial.id);
      }
    }
  };

  const handleNext = () => {
    if (currentStepIndex < tutorial.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleStepClick = (index: number) => {
    setCurrentStepIndex(index);
  };

  const currentStep = tutorial.steps[currentStepIndex];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Tutorials
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Environment: {currentEnvironment}</span>
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{tutorial.title}</h1>
        <p className="text-gray-600 mb-4">{tutorial.description}</p>
        
        <div className="flex items-center gap-4 mb-6">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {tutorial.category}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
            {tutorial.difficulty}
          </span>
          <span className="text-sm text-gray-500">
            {tutorial.estimatedTime} minutes
          </span>
        </div>
        
        <ProgressBar 
          current={completedSteps.length} 
          total={tutorial.steps.length} 
          className="mb-6"
        />
        
        {isCompleted && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-green-600">🎉</span>
              <span className="font-semibold text-green-800">Tutorial Completed!</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              Great work! You've completed all steps in this tutorial.
            </p>
          </div>
        )}
      </div>

      {/* Step Navigation */}
      <div className="mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {tutorial.steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(index)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                index === currentStepIndex
                  ? 'bg-blue-600 text-white'
                  : completedSteps.includes(step.id)
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {index + 1}. {step.title}
            </button>
          ))}
        </div>
      </div>

      {/* Current Step */}
      <div className="mb-8">
        <StepCard
          step={currentStep}
          isActive={true}
          isCompleted={completedSteps.includes(currentStep.id)}
          onComplete={() => handleStepComplete(currentStep.id)}
          onNext={handleNext}
        />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStepIndex === 0}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentStepIndex === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Previous
        </button>
        
        <div className="text-sm text-gray-500">
          Step {currentStepIndex + 1} of {tutorial.steps.length}
        </div>
        
        <button
          onClick={handleNext}
          disabled={currentStepIndex === tutorial.steps.length - 1}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentStepIndex === tutorial.steps.length - 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
import { useState } from 'react';
import type { TutorialStep } from '../../types/tutorial';
import { CommandSnippet } from './CommandSnippet';

interface StepCardProps {
  step: TutorialStep;
  isActive: boolean;
  isCompleted: boolean;
  onComplete: () => void;
  onNext: () => void;
}

export function StepCard({ step, isActive, isCompleted, onComplete, onNext }: StepCardProps) {
  const [showTips, setShowTips] = useState(false);
  
  if (!isActive) {
    return (
      <div className={`border rounded-lg p-4 mb-4 ${
        isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
            isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            {isCompleted ? '✓' : step.id.charAt(0).toUpperCase()}
          </div>
          <h3 className={`font-semibold ${
            isCompleted ? 'text-green-800' : 'text-gray-600'
          }`}>
            {step.title}
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="border-2 border-blue-500 rounded-lg p-6 mb-4 bg-white">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
          {step.id.charAt(0).toUpperCase()}
        </div>
        <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
      </div>
      
      <div className="prose prose-sm max-w-none mb-6">
        <div dangerouslySetInnerHTML={{ __html: step.content.replace(/\n/g, '<br/>') }} />
      </div>
      
      {step.commands && step.commands.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-3">Commands to run:</h4>
          {step.commands.map((command, index) => (
            <CommandSnippet key={index} command={command} />
          ))}
        </div>
      )}
      
      {step.tips && step.tips.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => setShowTips(!showTips)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            💡 {showTips ? 'Hide' : 'Show'} Tips
            <span className={`transition-transform ${showTips ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          
          {showTips && (
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <ul className="space-y-2">
                {step.tips.map((tip, index) => (
                  <li key={index} className="text-sm text-blue-800">
                    • {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {step.validation && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-600">⚠️</span>
            <span className="font-medium text-yellow-800">Validation Required</span>
          </div>
          <p className="text-sm text-yellow-700">{step.validation.message}</p>
        </div>
      )}
      
      <div className="flex gap-3">
        {!isCompleted && (
          <button
            onClick={onComplete}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Mark as Complete
          </button>
        )}
        
        <button
          onClick={onNext}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isCompleted ? 'Next Step' : 'Skip for Now'}
        </button>
      </div>
    </div>
  );
}
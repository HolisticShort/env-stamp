import type { Tutorial } from '../../types/tutorial';
import { TutorialService } from '../../services/tutorial';

interface TutorialCardProps {
  tutorial: Tutorial;
  onClick: (tutorial: Tutorial) => void;
}

export function TutorialCard({ tutorial, onClick }: TutorialCardProps) {
  const progress = TutorialService.getTutorialProgress(tutorial.id);
  const completionPercentage = TutorialService.getCompletionPercentage(tutorial);
  const isCompleted = progress?.completed || false;
  const isInProgress = progress && !progress.completed;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'environment': return '🌍';
      case 'git': return '🔧';
      case 'deployment': return '🚀';
      default: return '📚';
    }
  };

  return (
    <div
      onClick={() => onClick(tutorial)}
      className={`border rounded-lg p-6 cursor-pointer transition-all hover:shadow-md ${
        isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-blue-300'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getCategoryIcon(tutorial.category)}</span>
          <div>
            <h3 className={`text-lg font-semibold ${
              isCompleted ? 'text-green-800' : 'text-gray-800'
            }`}>
              {tutorial.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(tutorial.difficulty)}`}>
                {tutorial.difficulty}
              </span>
              <span className="text-sm text-gray-500">
                {tutorial.estimatedTime} min
              </span>
            </div>
          </div>
        </div>
        
        {isCompleted && (
          <div className="text-green-600 bg-green-100 rounded-full p-2">
            ✓
          </div>
        )}
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">
        {tutorial.description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {tutorial.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              {tag}
            </span>
          ))}
          {tutorial.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              +{tutorial.tags.length - 3}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {isInProgress && (
            <>
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-500">{completionPercentage}%</span>
            </>
          )}
          
          <button className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            isCompleted
              ? 'bg-green-600 text-white hover:bg-green-700'
              : isInProgress
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}>
            {isCompleted ? 'Review' : isInProgress ? 'Continue' : 'Start'}
          </button>
        </div>
      </div>
    </div>
  );
}
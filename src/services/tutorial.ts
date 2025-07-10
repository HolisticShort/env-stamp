import type { Tutorial, TutorialProgress, LearningProgress } from '../types/tutorial';

const TUTORIAL_STORAGE_KEY = 'env-stamp-learning-progress';

export class TutorialService {
  private static getLearningProgress(): LearningProgress {
    try {
      const stored = localStorage.getItem(TUTORIAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          lastActivityAt: new Date(parsed.lastActivityAt),
          inProgressTutorials: Object.fromEntries(
            Object.entries(parsed.inProgressTutorials || {}).map(([id, progress]: [string, unknown]) => [
              id,
              {
                ...(progress as Record<string, unknown>),
                startedAt: new Date((progress as Record<string, unknown>).startedAt as string),
                lastAccessedAt: new Date((progress as Record<string, unknown>).lastAccessedAt as string),
                completedAt: (progress as Record<string, unknown>).completedAt ? new Date((progress as Record<string, unknown>).completedAt as string) : undefined,
              },
            ])
          ),
        };
      }
    } catch (error) {
      console.warn('Failed to load learning progress:', error);
    }

    return {
      completedTutorials: [],
      inProgressTutorials: {},
      totalTimeSpent: 0,
      achievedBadges: [],
      lastActivityAt: new Date(),
    };
  }

  private static saveLearningProgress(progress: LearningProgress): void {
    try {
      localStorage.setItem(TUTORIAL_STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.warn('Failed to save learning progress:', error);
    }
  }

  static startTutorial(tutorialId: string): void {
    const progress = this.getLearningProgress();
    
    if (!progress.inProgressTutorials[tutorialId]) {
      progress.inProgressTutorials[tutorialId] = {
        tutorialId,
        currentStepIndex: 0,
        completedSteps: [],
        startedAt: new Date(),
        lastAccessedAt: new Date(),
        completed: false,
      };
    } else {
      progress.inProgressTutorials[tutorialId].lastAccessedAt = new Date();
    }

    progress.lastActivityAt = new Date();
    this.saveLearningProgress(progress);
  }

  static completeStep(tutorialId: string, stepId: string): void {
    const progress = this.getLearningProgress();
    const tutorialProgress = progress.inProgressTutorials[tutorialId];
    
    if (tutorialProgress && !tutorialProgress.completedSteps.includes(stepId)) {
      tutorialProgress.completedSteps.push(stepId);
      tutorialProgress.lastAccessedAt = new Date();
      progress.lastActivityAt = new Date();
      this.saveLearningProgress(progress);
    }
  }

  static setCurrentStep(tutorialId: string, stepIndex: number): void {
    const progress = this.getLearningProgress();
    const tutorialProgress = progress.inProgressTutorials[tutorialId];
    
    if (tutorialProgress) {
      tutorialProgress.currentStepIndex = stepIndex;
      tutorialProgress.lastAccessedAt = new Date();
      progress.lastActivityAt = new Date();
      this.saveLearningProgress(progress);
    }
  }

  static completeTutorial(tutorialId: string): void {
    const progress = this.getLearningProgress();
    const tutorialProgress = progress.inProgressTutorials[tutorialId];
    
    if (tutorialProgress) {
      tutorialProgress.completed = true;
      tutorialProgress.completedAt = new Date();
      tutorialProgress.lastAccessedAt = new Date();
      
      if (!progress.completedTutorials.includes(tutorialId)) {
        progress.completedTutorials.push(tutorialId);
      }
      
      progress.lastActivityAt = new Date();
      this.saveLearningProgress(progress);
    }
  }

  static getTutorialProgress(tutorialId: string): TutorialProgress | null {
    const progress = this.getLearningProgress();
    return progress.inProgressTutorials[tutorialId] || null;
  }

  static getOverallProgress(): LearningProgress {
    return this.getLearningProgress();
  }

  static getCompletionPercentage(tutorial: Tutorial): number {
    const progress = this.getTutorialProgress(tutorial.id);
    if (!progress) return 0;
    
    if (progress.completed) return 100;
    
    return Math.round((progress.completedSteps.length / tutorial.steps.length) * 100);
  }

  static clearProgress(): void {
    localStorage.removeItem(TUTORIAL_STORAGE_KEY);
  }

  static exportProgress(): string {
    const progress = this.getLearningProgress();
    return JSON.stringify(progress, null, 2);
  }

  static importProgress(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      this.saveLearningProgress(parsed);
      return true;
    } catch (error) {
      console.warn('Failed to import progress:', error);
      return false;
    }
  }
}
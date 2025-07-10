import type { Environment } from './environment';

export type TutorialCategory = 'environment' | 'git' | 'deployment';
export type TutorialDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type TutorialStepType = 'instruction' | 'command' | 'exercise' | 'validation';

export interface Command {
  command: string;
  description: string;
  environment?: Environment;
  expectedOutput?: string;
  workingDirectory?: string;
}

export interface ValidationRule {
  type: 'file-exists' | 'command-output' | 'environment-check' | 'manual-confirm';
  target: string;
  expectedValue?: string;
  message: string;
}

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  type: TutorialStepType;
  commands?: Command[];
  validation?: ValidationRule;
  tips?: string[];
  nextStepCondition?: string;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: TutorialCategory;
  difficulty: TutorialDifficulty;
  steps: TutorialStep[];
  prerequisites?: string[];
  estimatedTime: number;
  tags: string[];
}

export interface TutorialProgress {
  tutorialId: string;
  currentStepIndex: number;
  completedSteps: string[];
  startedAt: Date;
  lastAccessedAt: Date;
  completed: boolean;
  completedAt?: Date;
}

export interface LearningProgress {
  completedTutorials: string[];
  inProgressTutorials: Record<string, TutorialProgress>;
  totalTimeSpent: number;
  achievedBadges: string[];
  lastActivityAt: Date;
}
import type { Tutorial } from '../types/tutorial';

export const tutorials: Tutorial[] = [
  {
    id: 'environment-basics',
    title: 'Environment Basics',
    description: 'Learn how to work with different environments in this application and understand environment-driven development.',
    category: 'environment',
    difficulty: 'beginner',
    estimatedTime: 15,
    tags: ['environment', 'config', 'basics'],
    steps: [
      {
        id: 'intro',
        title: 'Understanding Environments',
        content: `Welcome to the Environment Basics tutorial! This application is built around an **environment-driven architecture** where behavior, appearance, and features change based on the current environment.

The four environments are:
- **local** - Your development machine
- **dev** - Development/staging environment  
- **test** - Testing environment
- **prod** - Production environment

Each environment has different feature flags, styling, and behavior to demonstrate how real applications adapt to different deployment contexts.`,
        type: 'instruction',
        tips: [
          'Look at the colored banner at the top - it shows your current environment',
          'The debug panel (bottom right) shows environment-specific information',
          'Different features are enabled/disabled based on environment'
        ]
      },
      {
        id: 'check-current-env',
        title: 'Check Your Current Environment',
        content: `Let's see what environment you're currently running in. Look at the banner at the top of the page and the debug panel in the bottom right corner.

The environment banner shows:
- **LOCAL** (blue) - Running in local development
- **DEVELOPMENT** (green) - Running in dev mode
- **TEST** (yellow) - Running in test mode  
- **PRODUCTION** (red) - Running in production mode`,
        type: 'instruction',
        tips: [
          'The debug panel shows detailed environment information',
          'Feature flags change based on environment',
          'Notice how the banner color matches the environment'
        ]
      },
      {
        id: 'switch-environment',
        title: 'Switch Between Environments',
        content: `Now let's practice switching between environments. Try running these commands in your terminal:`,
        type: 'command',
        commands: [
          {
            command: 'npm run dev',
            description: 'Start in local environment (default)',
            environment: 'local'
          },
          {
            command: 'npm run dev:development',
            description: 'Start in development environment',
            environment: 'dev'
          },
          {
            command: 'npm run dev:test',
            description: 'Start in test environment',
            environment: 'test'
          }
        ],
        tips: [
          'Stop the current server (Ctrl+C) before running a new command',
          'Watch how the banner color and text change',
          'Check the debug panel to see feature flag differences'
        ]
      },
      {
        id: 'observe-differences',
        title: 'Observe Environment Differences',
        content: `After switching environments, observe these key differences:

**Visual Changes:**
- Banner color and text
- Different environment information in debug panel

**Feature Differences:**
- Debug panel visibility (hidden in production)
- Analytics features (only in production)
- Advanced metrics (varies by environment)

**Configuration:**
- Different environment variables
- Feature flag states
- Performance monitoring settings`,
        type: 'instruction',
        tips: [
          'Try switching to production mode and notice the debug panel disappears',
          'Each environment has its own .env file with specific settings',
          'Production environment enables different features like analytics'
        ]
      },
      {
        id: 'understand-config',
        title: 'Understanding Configuration',
        content: `The environment system is powered by configuration files. Let's examine the key files:

**Environment Configuration:**
- \`src/config/environment.ts\` - Main environment configuration
- \`.env.local\`, \`.env.development\`, \`.env.test\`, \`.env.production\` - Environment variables

**Key Functions:**
- \`getCurrentEnvironment()\` - Gets current environment
- \`getEnvironmentConfig()\` - Gets environment-specific config
- \`getFeatureFlags()\` - Gets feature flags for current environment`,
        type: 'instruction',
        commands: [
          {
            command: 'cat .env.development',
            description: 'View development environment variables'
          },
          {
            command: 'cat .env.production',
            description: 'View production environment variables'
          }
        ],
        tips: [
          'Environment variables starting with VITE_ are available in the browser',
          'Each environment can have different database connections, API endpoints, etc.',
          'Feature flags allow you to enable/disable features per environment'
        ]
      },
      {
        id: 'practice-exercise',
        title: 'Practice Exercise',
        content: `Complete this exercise to demonstrate your understanding:

1. Start the application in **development** mode
2. Create a journal entry with the text "Development environment test"
3. Switch to **test** mode and create another entry with "Test environment test"
4. Switch to **local** mode and observe both entries are still there
5. Check the debug panel to see storage information

This demonstrates how data persists across environment switches during development.`,
        type: 'exercise',
        validation: {
          type: 'manual-confirm',
          target: 'exercise-completion',
          message: 'Have you completed the exercise by creating entries in different environments?'
        },
        tips: [
          'All data is stored in localStorage and persists across environment switches',
          'Each journal entry includes metadata about which environment it was created in',
          'The debug panel shows storage statistics'
        ]
      }
    ]
  },
  {
    id: 'git-workflow',
    title: 'Git Workflow & Branch Management',
    description: 'Master Git workflows for multi-environment development, from local development to production deployment.',
    category: 'git',
    difficulty: 'intermediate',
    estimatedTime: 25,
    tags: ['git', 'workflow', 'branches', 'deployment'],
    steps: [
      {
        id: 'git-setup',
        title: 'Git Workflow Overview',
        content: `This tutorial covers the Git workflow used for multi-environment development. Our workflow follows this pattern:

**Branch Strategy:**
- \`main\` → Production environment
- \`develop\` → Test environment
- Feature branches → Development environment (via PR previews)

**Typical Workflow:**
1. Create feature branch from \`develop\`
2. Develop locally and test
3. Push to GitHub (triggers dev environment preview)
4. Create PR to \`develop\` (deploys to test environment)
5. Merge to \`develop\` (updates test environment)
6. Create PR from \`develop\` to \`main\` (deploys to production)`,
        type: 'instruction',
        tips: [
          'This workflow ensures all changes are tested before reaching production',
          'Each environment corresponds to a specific Git branch',
          'Automated deployments happen on branch pushes'
        ]
      },
      {
        id: 'check-git-status',
        title: 'Check Current Git Status',
        content: `Let's start by checking your current Git status and understanding the repository structure.`,
        type: 'command',
        commands: [
          {
            command: 'git status',
            description: 'Check current branch and working tree status'
          },
          {
            command: 'git branch -a',
            description: 'List all branches (local and remote)'
          },
          {
            command: 'git log --oneline -5',
            description: 'Show recent commits'
          }
        ],
        tips: [
          'Make sure you\'re on the main branch to start',
          'Check if there are any uncommitted changes',
          'Note the remote branches available'
        ]
      },
      {
        id: 'create-feature-branch',
        title: 'Create a Feature Branch',
        content: `Let's create a new feature branch for our changes. This simulates starting work on a new feature.`,
        type: 'command',
        commands: [
          {
            command: 'git checkout develop',
            description: 'Switch to develop branch (base for new features)'
          },
          {
            command: 'git pull origin develop',
            description: 'Get latest changes from develop'
          },
          {
            command: 'git checkout -b feature/learning-system-test',
            description: 'Create and switch to new feature branch'
          }
        ],
        tips: [
          'Always base feature branches on develop, not main',
          'Use descriptive branch names like feature/add-user-auth',
          'Pull latest changes before creating new branches'
        ]
      },
      {
        id: 'make-changes',
        title: 'Make and Test Changes',
        content: `Now let's make some changes to demonstrate the workflow. We'll add a simple comment to show this branch's work.`,
        type: 'command',
        commands: [
          {
            command: 'echo "// Learning system test - $(date)" >> src/App.tsx',
            description: 'Add a comment with timestamp to App.tsx'
          },
          {
            command: 'git add src/App.tsx',
            description: 'Stage the changes'
          },
          {
            command: 'git commit -m "Add learning system test comment"',
            description: 'Commit the changes'
          }
        ],
        tips: [
          'Make meaningful commits with descriptive messages',
          'Test your changes locally before pushing',
          'Use git add . to stage all changes or specify individual files'
        ]
      },
      {
        id: 'push-and-pr',
        title: 'Push Branch and Create PR',
        content: `Push your feature branch and create a Pull Request. This triggers the development environment preview.`,
        type: 'command',
        commands: [
          {
            command: 'git push -u origin feature/learning-system-test',
            description: 'Push feature branch to remote'
          },
          {
            command: 'gh pr create --title "Add learning system test" --body "Testing the Git workflow tutorial" --base develop',
            description: 'Create PR to develop branch using GitHub CLI'
          }
        ],
        tips: [
          'The -u flag sets up tracking between local and remote branch',
          'PRs to develop branch will deploy to test environment',
          'You can also create PRs through GitHub web interface'
        ]
      },
      {
        id: 'merge-workflow',
        title: 'Merge and Deployment Workflow',
        content: `In a real workflow, here's what happens next:

**After PR Review:**
1. PR gets reviewed by team members
2. Automated tests run (CI/CD pipeline)
3. PR is merged to \`develop\` branch
4. \`develop\` branch automatically deploys to test environment
5. After testing, create PR from \`develop\` to \`main\`
6. \`main\` branch automatically deploys to production

**Cleanup:**
After successful merge, delete the feature branch to keep repository clean.`,
        type: 'instruction',
        commands: [
          {
            command: 'git checkout develop',
            description: 'Switch back to develop branch'
          },
          {
            command: 'git branch -d feature/learning-system-test',
            description: 'Delete the feature branch locally'
          },
          {
            command: 'git push origin --delete feature/learning-system-test',
            description: 'Delete the feature branch from remote'
          }
        ],
        tips: [
          'Only delete branches after they\'re successfully merged',
          'This keeps your repository clean and organized',
          'Use git branch -D to force delete unmerged branches (be careful!)'
        ]
      },
      {
        id: 'hotfix-workflow',
        title: 'Hotfix Workflow',
        content: `For urgent production fixes, we use a hotfix workflow:

**Hotfix Process:**
1. Create hotfix branch from \`main\`
2. Make minimal fix
3. Test thoroughly
4. Create PR directly to \`main\`
5. Also merge back to \`develop\` to keep branches in sync

This bypasses the normal testing cycle for critical fixes.`,
        type: 'instruction',
        commands: [
          {
            command: 'git checkout main',
            description: 'Switch to main branch'
          },
          {
            command: 'git checkout -b hotfix/critical-fix',
            description: 'Create hotfix branch from main'
          },
          {
            command: 'git checkout main',
            description: 'Switch back to main (cleanup)'
          },
          {
            command: 'git branch -d hotfix/critical-fix',
            description: 'Delete the example hotfix branch'
          }
        ],
        tips: [
          'Use hotfix workflow only for critical production issues',
          'Keep hotfix changes minimal and focused',
          'Always merge hotfixes back to develop to prevent conflicts'
        ]
      }
    ]
  },
  {
    id: 'deployment-pipeline',
    title: 'Deployment Pipeline & CI/CD',
    description: 'Understand how code moves from development to production through automated deployment pipelines.',
    category: 'deployment',
    difficulty: 'advanced',
    estimatedTime: 30,
    tags: ['deployment', 'cicd', 'pipeline', 'automation'],
    steps: [
      {
        id: 'pipeline-overview',
        title: 'Understanding the Deployment Pipeline',
        content: `This application uses a sophisticated CI/CD pipeline that automatically deploys code based on Git branch activity:

**Pipeline Stages:**
1. **Development** - Feature branches → Preview deployments
2. **Testing** - \`develop\` branch → Test environment
3. **Production** - \`main\` branch → Production environment

**Automation Tools:**
- **GitHub Actions** - CI/CD workflows
- **Vercel** - Hosting and deployment platform
- **Environment-specific builds** - Different configs per environment

Each deployment stage includes:
- Automated testing
- Environment-specific configuration
- Health checks
- Rollback capabilities`,
        type: 'instruction',
        tips: [
          'Pipelines ensure consistent deployments across environments',
          'Each environment has its own configuration and feature flags',
          'Failed deployments are automatically rolled back'
        ]
      },
      {
        id: 'examine-workflows',
        title: 'Examine GitHub Actions Workflows',
        content: `Let's look at the GitHub Actions workflows that power our deployment pipeline:`,
        type: 'command',
        commands: [
          {
            command: 'ls -la .github/workflows/',
            description: 'List all GitHub Actions workflow files'
          },
          {
            command: 'cat .github/workflows/deploy-production.yml',
            description: 'View production deployment workflow'
          },
          {
            command: 'cat .github/workflows/deploy-test.yml',
            description: 'View test environment deployment workflow'
          }
        ],
        tips: [
          'Workflows are triggered by specific Git events (push, PR, etc.)',
          'Each workflow can have different steps and environments',
          'Secrets and environment variables are configured in GitHub'
        ]
      },
      {
        id: 'build-commands',
        title: 'Environment-Specific Build Commands',
        content: `Different environments require different build configurations. Let's explore the build commands:`,
        type: 'command',
        commands: [
          {
            command: 'npm run build:development',
            description: 'Build for development environment'
          },
          {
            command: 'npm run build:test',
            description: 'Build for test environment'
          },
          {
            command: 'npm run build:production',
            description: 'Build for production environment'
          }
        ],
        tips: [
          'Each build uses different environment variables',
          'Production builds are optimized and minified',
          'Source maps are included in dev/test but not production'
        ]
      },
      {
        id: 'environment-variables',
        title: 'Managing Environment Variables',
        content: `Environment variables control application behavior in different environments. Let's examine how they're structured:

**Local Development:**
- \`.env.local\` - Your personal development settings (not committed)
- \`.env.development\` - Development environment defaults

**Deployed Environments:**
- Environment variables are set in the hosting platform
- Different values for database URLs, API keys, feature flags
- Secrets are managed securely (never in code)`,
        type: 'instruction',
        commands: [
          {
            command: 'cat .env.example',
            description: 'View example environment variables'
          },
          {
            command: 'cat .env.development',
            description: 'View development environment variables'
          },
          {
            command: 'cat .env.production',
            description: 'View production environment variables'
          }
        ],
        tips: [
          'Never commit .env.local to version control',
          'Use .env.example to document required variables',
          'Production secrets should be managed by the hosting platform'
        ]
      },
      {
        id: 'deployment-process',
        title: 'Deployment Process Walkthrough',
        content: `Here's what happens when you deploy to each environment:

**Development Deployment (Feature Branch):**
1. Push feature branch to GitHub
2. GitHub Actions builds with development config
3. Vercel creates preview deployment
4. Preview URL is available for testing

**Test Deployment (develop branch):**
1. Merge PR to develop branch
2. GitHub Actions builds with test config
3. Deploys to test environment
4. Runs integration tests
5. Notifies team of deployment status

**Production Deployment (main branch):**
1. Merge PR to main branch
2. GitHub Actions builds with production config
3. Runs full test suite
4. Deploys to production environment
5. Runs health checks
6. Sends deployment notifications`,
        type: 'instruction',
        tips: [
          'Each deployment is atomic - either fully succeeds or fails',
          'Failed deployments are automatically rolled back',
          'Deployment status is visible in GitHub and Slack/Discord'
        ]
      },
      {
        id: 'monitoring-deployments',
        title: 'Monitoring and Rollback',
        content: `After deployment, monitoring ensures everything is working correctly:

**Monitoring Includes:**
- Application health checks
- Performance metrics
- Error tracking
- User experience monitoring

**Rollback Process:**
If issues are detected, deployments can be rolled back quickly:
1. Automatic rollback on health check failures
2. Manual rollback through deployment dashboard
3. Git-based rollback by reverting commits`,
        type: 'instruction',
        commands: [
          {
            command: 'git log --oneline -10',
            description: 'View recent commits for rollback reference'
          },
          {
            command: 'git revert HEAD --no-edit',
            description: 'Example: revert the last commit'
          },
          {
            command: 'git reset --hard HEAD~1',
            description: 'Example: reset to previous commit (dangerous!)'
          }
        ],
        tips: [
          'git revert is safer than git reset for shared branches',
          'Always prefer revert over reset on main/develop branches',
          'Document the reason for rollbacks in commit messages'
        ]
      },
      {
        id: 'deployment-best-practices',
        title: 'Deployment Best Practices',
        content: `Follow these best practices for reliable deployments:

**Pre-Deployment:**
- Test thoroughly in development environment
- Run all tests locally before pushing
- Review changes carefully in PR
- Ensure database migrations are ready

**During Deployment:**
- Monitor deployment progress
- Check health checks pass
- Verify key functionality works
- Monitor error rates and performance

**Post-Deployment:**
- Announce successful deployment to team
- Monitor for any issues
- Document any changes or known issues
- Plan rollback strategy if needed`,
        type: 'instruction',
        tips: [
          'Deployments should be frequent and small',
          'Use feature flags to control feature rollout',
          'Always have a rollback plan ready',
          'Communicate deployment status to your team'
        ]
      }
    ]
  }
];

export const getTutorialById = (id: string): Tutorial | undefined => {
  return tutorials.find(tutorial => tutorial.id === id);
};

export const getTutorialsByCategory = (category: string): Tutorial[] => {
  return tutorials.filter(tutorial => tutorial.category === category);
};

export const getTutorialsByDifficulty = (difficulty: string): Tutorial[] => {
  return tutorials.filter(tutorial => tutorial.difficulty === difficulty);
};
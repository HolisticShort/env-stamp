# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
```bash
# Start development server (uses .env.local)
npm run dev

# Environment-specific development
npm run dev:development    # Dev environment behavior
npm run dev:test          # Test environment behavior
npm run dev:local         # Local environment behavior

# Build commands
npm run build             # Standard build
npm run build:development # Build for dev environment
npm run build:test        # Build for test environment  
npm run build:production  # Build for production

# Quality checks
npm run lint              # Run ESLint
npm run type-check        # TypeScript type checking
npm run preview           # Preview production build
```

### Environment Setup
```bash
# Create local environment file
cp .env.example .env.local

# Test different environments locally
cp .env.development .env.local  # Test dev behavior
cp .env.test .env.local         # Test test behavior
cp .env.production .env.local   # Test prod behavior
```

## Architecture Overview

### Environment-Driven Design
This application is built around a **multi-environment architecture** where behavior, appearance, and features dynamically adapt based on the current environment (`local`, `dev`, `test`, `prod`). The environment system is the core architectural pattern.

### Key Architectural Components

**Environment Configuration System** (`src/config/environment.ts`):
- Central configuration hub that maps environment names to specific behaviors
- Manages feature flags, UI themes, and deployment settings
- Exports `getCurrentEnvironment()`, `getEnvironmentConfig()`, and `getFeatureFlags()`

**Environment Detection Flow**:
1. Vite loads environment variables based on `--mode` flag
2. `getCurrentEnvironment()` reads `VITE_APP_ENV` to determine current environment
3. `getEnvironmentConfig()` returns environment-specific configuration
4. Components consume configuration to adapt behavior

**Feature Flag System**:
- Environment-driven feature toggling (debug panel, analytics, external services)
- Features are enabled/disabled based on environment, not user preferences
- Example: Debug panel only appears in non-production environments

**Storage Abstraction** (`src/services/storage.ts`):
- `StorageService` class provides abstraction over localStorage
- Designed to be easily replaced with database storage in future
- Handles error cases and provides metadata about storage usage

### Component Architecture

**Environment-Aware Components**:
- `EnvironmentBanner`: Visual indicator of current environment with color-coded themes
- `DebugPanel`: Conditional rendering based on environment feature flags
- `Journal`: Main functionality that adapts storage behavior per environment

**Data Flow**:
1. Environment configuration determines available features
2. Components query feature flags to enable/disable functionality
3. Storage service handles persistence with environment metadata
4. All journal entries are tagged with their creation environment

### Multi-Environment Deployment Strategy

**Branch-Environment Mapping**:
- `main` branch → Production environment
- `develop` branch → Test environment  
- PR branches → Development environment (preview deployments)

**Build Configuration**:
- `vite.config.ts` uses `loadEnv()` to load environment-specific variables
- Build process generates different bundles based on environment mode
- Sourcemaps enabled for development/test, disabled for production

**CI/CD Pipeline**:
- GitHub Actions workflows in `.github/workflows/` handle automated deployments
- Each environment has dedicated workflow with environment-specific build commands
- Vercel integration for hosting with environment-specific configurations

### Key Environment Variables

| Variable | Purpose | Environments |
|----------|---------|-------------|
| `VITE_APP_ENV` | Primary environment identifier | all |
| `VITE_DEBUG_MODE` | Controls debug panel visibility | local, dev, test |
| `VITE_ANALYTICS_ENABLED` | Enables analytics features | prod only |
| `VITE_SUPABASE_ENABLED` | Enables database features | prod only |

### TypeScript Architecture

**Environment Types** (`src/types/environment.ts`):
- `Environment`: Union type for all valid environment names
- `EnvironmentConfig`: Interface defining environment-specific settings
- `JournalEntry`: Data structure that includes environment metadata
- `FeatureFlags`: Interface for environment-driven feature control

### Development Workflow

**Testing Environment Behavior**:
1. Use environment-specific dev commands to test different behaviors locally
2. Create PRs to `develop` branch to test deployment pipeline
3. Environment configuration changes should be tested across all environments

**Environment-Specific Development**:
- Local development uses `.env.local` (not committed)
- Each environment has committed `.env.{environment}` files
- Components should be tested in multiple environments during development

### Storage and State Management

**Local Storage Strategy**:
- All data persists in localStorage with environment metadata
- `StorageService` provides consistent interface that can be extended
- Journal entries include environment information for debugging deployments

**Environment Persistence**:
- Data persists across environment switches during development
- Production data is isolated from development data
- Storage service provides metadata about storage usage for debugging

### Key Files for Environment System

- `src/config/environment.ts` - Core environment configuration
- `src/types/environment.ts` - TypeScript definitions
- `vite.config.ts` - Build-time environment handling
- `.env.{environment}` files - Environment-specific variables
- `.github/workflows/deploy-*.yml` - Deployment automation
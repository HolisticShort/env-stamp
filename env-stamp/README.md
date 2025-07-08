# Env Stamp - Environment-Aware Journal Application

A React-based journal application that dynamically adapts its appearance, features, and data storage based on the current deployment environment. Perfect for testing development workflows across multiple environments (local, dev, test, prod).

## Features

- 🌍 **Environment Detection**: Automatically detects and displays the current environment
- 🎨 **Dynamic Theming**: Color-coded environment banners (blue=local, green=dev, yellow=test, red=prod)
- 📝 **Journal Functionality**: Create, view, and delete journal entries with timestamps
- 🔧 **Debug Panel**: Environment-specific debug tools (available in dev/test environments)
- 💾 **Local Storage**: Persistent data storage with metadata
- 🚀 **Feature Flags**: Environment-based feature control
- ♿ **Accessibility**: WCAG 2.1 AA compliant interface
- 📱 **Responsive Design**: Works on mobile and desktop

## Quick Start

```bash
# Clone and install
cd env-stamp
npm install
cp .env.example .env.local  # Set up local environment

# Run in different environments
npm run dev               # Uses .env.local (local environment)
npm run dev:development   # Development mode
npm run dev:test         # Test mode
npm run build:production # Production build
```

## 🚀 Git Workflow & Deployments

This project uses **GitFlow with automated CI/CD** for multi-environment deployments:

### Branch Strategy
```
main (prod)           ←── Production deployments (manual approval)
├── develop (test)    ←── Test environment (auto-deploy)
├── feature/xyz (dev) ←── Dev environment (PR previews)
└── hotfix/abc        ←── Emergency production fixes
```

### Deployment Environments
- **Development**: PR previews to `develop` branch → `dev` environment
- **Test**: Merges to `develop` branch → `test` environment  
- **Production**: Merges to `main` branch → `prod` environment

### Environment Configuration

Environment variables are managed through deployment platform (Vercel/Netlify), not committed files:

### Environment Variables

| Variable | Local | Dev | Test | Prod |
|----------|-------|-----|------|------|
| `VITE_APP_ENV` | `local` | `dev` | `test` | `prod` |
| `VITE_APP_NAME` | `Env Stamp` | `Env Stamp` | `Env Stamp` | `Env Stamp` |
| `VITE_DEBUG_MODE` | `true` | `true` | `true` | `false` |
| `VITE_ANALYTICS_ENABLED` | `false` | `false` | `false` | `true` |
| `VITE_SUPABASE_ENABLED` | `false` | `false` | `false` | `true` |

## 🔧 Development Workflow

### Working with Features
```bash
# 1. Create feature branch from develop
git checkout develop
git checkout -b feature/your-feature-name

# 2. Develop and test locally
npm run dev  # Runs in local mode
npm run dev:development  # Test dev environment behavior

# 3. Create PR to develop branch
# → Triggers dev environment preview deployment

# 4. After review, merge to develop
# → Automatically deploys to test environment

# 5. For production release, merge develop to main
# → Deploys to production environment
```

## Project Structure

```
env-stamp/
├── src/
│   ├── components/
│   │   ├── EnvironmentBanner.tsx    # Environment indicator
│   │   ├── Journal.tsx              # Main journal interface
│   │   └── DebugPanel.tsx           # Debug tools
│   ├── config/
│   │   └── environment.ts           # Environment configuration
│   ├── services/
│   │   └── storage.ts               # Local storage service
│   ├── types/
│   │   └── environment.ts           # TypeScript definitions
│   └── App.tsx                      # Main application
├── .env.local                       # Local environment config
├── .env.development                 # Dev environment config
├── .env.test                        # Test environment config
└── .env.production                  # Production environment config
```

## Environment Behaviors

### Local Environment
- Blue banner with "LOCAL" indicator
- Debug panel enabled
- No analytics or external services

### Development Environment
- Green banner with "DEVELOPMENT" indicator
- Debug panel enabled
- Development-specific features

### Test Environment
- Yellow banner with "TEST" indicator
- Debug panel enabled
- Testing-specific configurations

### Production Environment
- Red banner with "PRODUCTION" indicator
- Debug panel disabled
- Analytics and external services enabled

## Usage Examples

### Creating Journal Entries
1. Type your entry in the text area (max 2000 characters)
2. Click "Save Entry" to store with environment metadata
3. View entries in chronological order below

### Using Debug Panel (Dev/Test Only)
- Click the debug panel button in bottom-right corner
- View environment info, feature flags, and storage statistics
- Download or clear all data
- Inspect environment variables

### Switching Environments
```bash
# Copy different env files to test environments
cp .env.development .env.local
npm run dev  # Now runs in dev mode

cp .env.test .env.local
npm run dev  # Now runs in test mode
```

## Testing CI/CD Workflows

This app is designed to test full-stack development workflows:

1. **Branch Strategy**: Create branches for each environment
2. **Environment Configs**: Maintain separate configs per branch
3. **Deployment Testing**: Deploy to different environments
4. **Feature Flags**: Test environment-specific features
5. **Data Persistence**: Validate storage across deployments

## Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
npm install
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint (if configured)
```

### Technology Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Storage**: localStorage (with abstraction for future database)
- **Environment**: Vite environment variables

## 🚀 Deployment Setup

### GitHub Repository Setup
1. **Create GitHub repository** and push this code
2. **Set up branch protection** for `main` and `develop`:
   ```bash
   # Protect main branch (production)
   - Require pull request reviews
   - Require status checks to pass
   - Restrict pushes to main branch
   
   # Protect develop branch (test environment) 
   - Require pull request reviews
   - Require CI checks to pass
   ```

### Vercel Deployment Setup
1. **Connect repository** to Vercel
2. **Configure environments** in Vercel dashboard:
   - **Production**: Connected to `main` branch
   - **Preview**: Connected to `develop` branch and PRs
3. **Set environment variables** per environment in Vercel:
   ```bash
   Production Environment:
   VITE_APP_ENV=prod
   VITE_DEBUG_MODE=false
   VITE_ANALYTICS_ENABLED=true
   VITE_SUPABASE_ENABLED=true
   
   Preview Environment:
   VITE_APP_ENV=test  # or dev for PR previews
   VITE_DEBUG_MODE=true
   VITE_ANALYTICS_ENABLED=false
   VITE_SUPABASE_ENABLED=false
   ```
4. **Add Vercel secrets** to GitHub repository:
   - `VERCEL_TOKEN` - Vercel deployment token
   - `VERCEL_ORG_ID` - Organization ID  
   - `VERCEL_PROJECT_ID` - Project ID

### GitHub Actions Secrets Required
```bash
VERCEL_TOKEN          # Vercel CLI token
VERCEL_ORG_ID         # Vercel organization ID
VERCEL_PROJECT_ID     # Vercel project ID
```

### Manual Deployment (if needed)
```bash
# Build for specific environment
npm run build:production
npm run build:test
npm run build:development

# Deploy dist/ folder to your hosting provider
```

## Contributing

1. Fork the repository
2. Create environment-specific branches
3. Test across all environments
4. Ensure accessibility compliance
5. Submit pull request

## License

MIT License - see LICENSE file for details

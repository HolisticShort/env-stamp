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

# Run in different environments
npm run dev          # Uses .env.local (local environment)
npm run dev:dev      # Uses .env.development (dev environment)
npm run dev:test     # Uses .env.test (test environment)
npm run build        # Uses .env.production (prod environment)
```

## Environment Configuration

Each environment has its own configuration file:

- `.env.local` - Local development
- `.env.development` - Development environment
- `.env.test` - Test environment
- `.env.production` - Production environment

### Environment Variables

```bash
VITE_APP_ENV=local|dev|test|prod
VITE_APP_NAME=Env Stamp
VITE_DEBUG_MODE=true|false
VITE_ANALYTICS_ENABLED=true|false
VITE_SUPABASE_ENABLED=true|false
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

## Deployment

### Vercel/Netlify
1. Connect repository to your platform
2. Set environment variables in platform settings
3. Deploy different branches to different environments

### Manual Deployment
```bash
# Build for production
npm run build

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

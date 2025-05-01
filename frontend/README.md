# Community Learning Hub - Frontend

This is the frontend application for the Community Learning Hub platform, built with React 19, Tailwind CSS, and Vite.

## Features

- Modern React architecture with hooks and context
- Responsive design with Tailwind CSS
- API integration with backend services
- Interactive learning experience with achievements and credits

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:

   - Create `.env.development` for local development
   - Create `.env.production` for production deployment

   Example of `.env.development`:

   ```
   VITE_API_URL=http://localhost:5000/api
   ```

### Development

Start the development server:

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

Generated files will be in the `dist` directory.

## Deployment Options

### Deploy to Netlify

1. **From Netlify UI**:

   - Sign up for a Netlify account
   - Go to Netlify dashboard → "New site from Git"
   - Connect to your GitHub repository
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
   - Add environment variables:
     - `VITE_API_URL`: Your backend API URL (e.g., https://community-learning-hub-api.onrender.com/api)

2. **Using Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   netlify init
   netlify deploy --prod
   ```

### Deploy to Vercel

1. **From Vercel UI**:

   - Sign up for a Vercel account
   - Import your repository from GitHub
   - Configure project settings:
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - Add environment variables:
     - `VITE_API_URL`: Your backend API URL

2. **Using Vercel CLI**:
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

## Project Structure

```
frontend/
├── public/           # Static assets
├── src/
│   ├── assets/       # Images, fonts, etc.
│   ├── components/   # Reusable UI components
│   ├── contexts/     # React context providers
│   ├── pages/        # Application pages
│   ├── services/     # API service integration
│   ├── App.jsx       # Main application component
│   ├── main.jsx      # Application entry point
│   └── router.jsx    # Application routing
├── .env.development  # Development environment variables
├── .env.production   # Production environment variables
├── netlify.toml      # Netlify configuration
├── vercel.json       # Vercel configuration
└── vite.config.js    # Vite configuration
```

## Environment Variables

| Variable     | Description            | Example                                             |
| ------------ | ---------------------- | --------------------------------------------------- |
| VITE_API_URL | URL of the backend API | https://community-learning-hub-api.onrender.com/api |

## Deployment Files

- `netlify.toml`: Configuration for Netlify deployment
- `vercel.json`: Configuration for Vercel deployment

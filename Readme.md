# Community Learning Hub

An interactive learning platform where users can discover educational content, engage with a community of learners, and earn rewards for participation.

## Features

### Core Features

- **Learning Paths**: Structured educational content with progress tracking
- **Discussion Forums**: Community-driven question and answer platform
- **Content Feed**: Curated educational content from multiple sources (Twitter, Reddit, LinkedIn)
- **Achievement System**: Gamified learning experience with badges and rewards
- **Credit Points Economy**: Earn credits through engagement and spend on marketplace rewards

### Technical Features

- **Modern React Frontend**: Built with React 19, Tailwind CSS, and Vite
- **Responsive Design**: Mobile-friendly interface for learning on any device
- **RESTful API Backend**: Express.js with MongoDB for data persistence
- **JWT Authentication**: Secure user authentication and authorization
- **Role-based Access Control**: Different permissions for members, moderators, and admins

## Prerequisites

- Node.js 18.x or higher
- MongoDB 6.x or higher
- npm or yarn package manager

## Instructions to Run Locally

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/community_learning_hub.git
   ```

2. Navigate to the project directory:

   ```bash
   cd community_learning_hub
   ```

3. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

4. Create a `.env` file in the backend directory with the following variables:

   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=<enter your mongodb connection url>
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:

   ```bash
   cd ../frontend
   ```

2. Install frontend dependencies:

   ```bash
   npm install
   ```

3. Start the frontend development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

## Deployment Instructions

### Backend Deployment to Render

1. **Create a MongoDB Atlas Cluster**:

   - Sign up for a MongoDB Atlas account
   - Create a new cluster (free tier is sufficient)
   - Create a database user
   - Get your MongoDB connection string

2. **Deploy to Render**:
   - Sign up for a Render account
   - From the Render dashboard, click "New" and select "Web Service"
   - Connect your GitHub repository
   - Select the repository and the backend directory
   - Configure your service:
     - **Name**: `community-learning-hub-api` (or your preferred name)
     - **Runtime**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Advanced** → **Add Environment Variables**:
       - `NODE_ENV`: `production`
       - `PORT`: `10000` (Render uses this internally)
       - `MONGODB_URI`: Your MongoDB Atlas connection string
       - `JWT_SECRET`: A secure random string for JWT token generation
       - `JWT_EXPIRE`: `30d` (or your preferred expiration)
       - `FRONTEND_URL`: Your frontend URL after deployment (e.g., https://community-learning-hub.netlify.app)
   - Click "Create Web Service"

### Frontend Deployment

#### Option 1: Netlify

1. **Deploy to Netlify**:

   - Sign up for a Netlify account
   - From the Netlify dashboard, click "New site from Git"
   - Connect your GitHub repository
   - Configure your build settings:
     - **Base directory**: `frontend` (if your repo has both frontend and backend)
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
   - **Advanced** → **New variable**:
     - `VITE_API_URL`: Your Render backend URL (e.g., https://community-learning-hub-api.onrender.com/api)
   - Click "Deploy site"

2. **Set up Custom Domain** (optional):
   - In Netlify dashboard → select your site → "Domain settings"
   - Follow the instructions to set up your custom domain

#### Option 2: Vercel

1. **Deploy to Vercel**:

   - Sign up for a Vercel account
   - From the Vercel dashboard, click "Import Project"
   - Import your GitHub repository
   - Configure your project:
     - **Framework Preset**: Vite
     - **Root Directory**: `frontend` (if your repo has both frontend and backend)
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - **Environment Variables**:
     - `VITE_API_URL`: Your Render backend URL (e.g., https://community-learning-hub-api.onrender.com/api)
   - Click "Deploy"

2. **Set up Custom Domain** (optional):
   - In Vercel dashboard → select your project → "Settings" → "Domains"
   - Follow the instructions to set up your custom domain

## Project Structure

```
community_learning_hub/
├── backend/               # Express.js server
│   ├── config/            # Database configuration
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Custom middleware (auth, etc.)
│   ├── models/            # Mongoose data models
│   ├── routes/            # API routes
│   ├── services/          # Business logic services
│   └── server.js          # Server entry point
│
└── frontend/              # React application
    ├── public/            # Static assets
    └── src/
        ├── assets/        # Images, fonts, etc.
        ├── components/    # Reusable UI components
        ├── contexts/      # React context providers
        ├── pages/         # Application pages
        ├── services/      # API service integration
        └── main.jsx       # Entry point
```

## Technology Stack

- **Frontend**: React 19, React Router, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Render (backend), Netlify/Vercel (frontend)

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
   MONGO_URI=<enter your mongodb connection url>
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

## Deployment Steps

### Backend Deployment

1. Set up a MongoDB instance (MongoDB Atlas recommended for cloud deployment).
2. Deploy the Express.js backend to Google Cloud Platform:
   ```bash
   cd backend
   npm install
   npm run build
   ```
3. Configure environment variables in your GCP environment.
4. Deploy using Google Cloud Run or App Engine.

### Frontend Deployment

1. Build the frontend for production:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. Configure your domain and hosting settings as needed.
3. Verify the deployment by visiting your live site.

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
        ├── hooks/         # Custom React hooks
        ├── pages/         # Application pages
        ├── services/      # API service integration
        ├── utils/         # Utility functions
        ├── App.jsx        # Main component
        └── main.jsx       # Entry point
```

## Technology Stack

- **Frontend**: React, React Router, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Google Cloud Platform, Firebase

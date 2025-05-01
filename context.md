# Community Learning Hub - AI Context File

## Application Overview
The Community Learning Hub is a platform where users can discover educational content, interact with a curated feed, and earn credit points for engagement.

## Core Components

### 1. User Authentication
- Register/Login using JWT

### 2. Credit Points System
- Earn points for watching content, engaging with the feed, or sharing
- Spend credits to unlock premium resources or events
- Track transactions with timestamps and purpose

### 3. Feed Aggregator
- Aggregate feeds from APIs (Twitter, Reddit, LinkedIn only)
- Display content cards with preview, title, source
- Users can:
  • Save for later
  • Share
  • Report (flag for review)

### 4. Admin/Moderator Panel
- Review reports
- Manage content or users
- View stats (e.g., top saved content, most active users)

### 5. Deployment
- Backend: Express.js API with MongoDB (deployed on GCP)
- Frontend: React.js + Tailwind CSS (deployed on Firebase or GCP)
- Store content metadata and user preferences in MongoDB
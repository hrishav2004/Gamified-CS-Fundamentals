# CS Fundamentals Gamified - Backend

Backend API for the gamified CS fundamentals learning platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/cs-fundamentals-gamified
JWT_SECRET=your-super-secret-jwt-key-here
ADMIN_SECRET_KEY=admin-secret-key-2024
PORT=5000
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Users
- `GET /api/users` - Get all users (with search)
- `PUT /api/users/profile` - Update user profile

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/:id` - Get quiz by ID
- `POST /api/quizzes` - Create new quiz
- `POST /api/quizzes/submit` - Submit quiz answers

### Performance
- `GET /api/performance` - Get user performance history
- `GET /api/performance/stats` - Get performance statistics
- `GET /api/leaderboard` - Get leaderboard

### Friends
- `POST /api/friends/request` - Send friend request
- `GET /api/friends/requests` - Get pending friend requests
- `POST /api/friends/respond` - Accept/reject friend request
- `GET /api/friends` - Get friends list

### Challenges
- `POST /api/challenges/invite` - Send challenge invitation
- `POST /api/challenges/accept/:challengeId` - Accept challenge
- `GET /api/challenges/active` - Get active challenges

### Admin (requires X-Admin-Key header)
- `GET /api/admin/questions` - Get all questions
- `POST /api/admin/questions` - Create new question
- `PUT /api/admin/questions/:id/approve` - Approve question

## Database Models

- **User**: User accounts with profiles, stats, and achievements
- **Question**: Quiz questions with topics, difficulty, and options
- **Quiz**: Collections of questions with metadata
- **Performance**: User quiz attempt records
- **FriendRequest**: Friend relationship management

## Technologies Used

- Node.js + Express
- MongoDB + Mongoose
- JWT for authentication
- bcryptjs for password hashing
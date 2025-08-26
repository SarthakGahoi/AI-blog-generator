# AI Blog Generator

A full-stack web application that generates high-quality blog posts using AI. Built with React.js frontend and Node.js/Express backend.

![AI Blog Generator Demo](https://via.placeholder.com/800x400?text=AI+Blog+Generator+Demo)

## 🚀 Features

- **AI-Powered Content Generation**: Generate comprehensive blog posts from simple topics
- **User Authentication**: Secure registration and login system
- **Blog Management**: Save, view, copy, and download generated blogs
- **Admin Dashboard**: Monitor usage statistics and manage users
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Real-time Generation**: See your blog posts being created in real-time

## 🛠️ Tech Stack

### Frontend

- React.js 18
- Material-UI (MUI)
- React Router
- Axios
- React Hot Toast

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- OpenAI API Integration
- bcryptjs for password hashing

## 📦 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- OpenAI API Key (optional - mock data available)

### 1. Clone Repository

git clone https://github.com/Cyber-warrior-2026/ai-blog-generator.git
cd ai-blog-generator

### 2. Backend Setup

cd backend
npm install

Create .env file
cp .env.example .env

Edit .env with your configuration

### 3. Frontend Setup

### 3. Frontend Setup

cd frontend
npm install

Create .env file
cp .env.example .env

Edit .env with your configuration

### 4. Environment Variables

#### Backend `.env`:

NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
FRONTEND_URL=http://localhost:3000

#### Frontend `.env`:

REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=AI Blog Generator

### 5. Run Application

#### Development Mode:

Terminal 1: Backend
cd backend
npm run dev

Terminal 2: Frontend
cd frontend
npm start

#### Production Mode:

Build frontend
cd frontend
npm run build

Run backend in production
cd backend
npm start

## 🌐 Deployment

### Deploy to Vercel (Recommended)

#### Backend Deployment:

1. Push code to GitHub
2. Connect Vercel to your repository
3. Set environment variables in Vercel dashboard
4. Deploy backend first

#### Frontend Deployment:

1. Update `REACT_APP_API_URL` to your backend URL
2. Deploy frontend to Vercel
3. Update `FRONTEND_URL` in backend environment

### Deploy to Heroku

Backend
cd backend
heroku create your-app-name-backend
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri

... set other env variables
git push heroku main

Frontend
cd frontend

Update API URL in .env
npm run build

Deploy build folder to Heroku or Netlify

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Blog Endpoints

- `POST /api/blog/generate` - Generate new blog post
- `GET /api/blog/my-blogs` - Get user's blogs
- `GET /api/blog/:id` - Get specific blog
- `DELETE /api/blog/:id` - Delete blog

### Admin Endpoints (Admin only)

- `GET /api/admin/stats` - Get usage statistics
- `GET /api/admin/recent-generations` - Get recent generations
- `GET /api/admin/users` - Get all users

## 🧪 Testing

### Backend Tests:

cd backend
npm test
cd frontend
npm test

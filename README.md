# Multi-Stall Food Ordering Platform (Backend)

Backend service for Multi-Stall Food Ordering Platform built with Node.js, Express, and MongoDB.

## Tech Stack
- **Node.js** & **Express**
- **MongoDB** & **Mongoose**
- **CORS**, **Dotenv**
- **Nodemon** (Dev)

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root or `backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/foodstall-dev
NODE_ENV=development
JWT_SECRET=your-secret-key-here
```

### 3. Run the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### 4. API Endpoints
- `GET /api/health` - Check backend service health status

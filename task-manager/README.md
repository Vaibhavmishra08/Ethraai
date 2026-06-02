# Task Manager

A full-stack task management application built with React, Vite, Express, and SQLite.

## Features

- User authentication with JWT
- Project management
- Task management with status tracking (todo, in-progress, done)
- Role-based access (Admin, Member)
- Responsive UI with Tailwind CSS

## Project Structure

```
task-manager/
├── src/               # React frontend source
├── server.js          # Express backend
├── package.json       # Dependencies
└── vite.config.js     # Vite configuration
```

## Development

### Prerequisites
- Node.js 18+ and npm

### Setup

1. Install dependencies:
```bash
npm install
```

2. Run development server (both React and Express):
```bash
npm run dev:full
```

The app will be available at:
- React dev server: http://localhost:5173
- Express server: http://localhost:3001

### Available Scripts

- `npm run dev` - Start React dev server with Vite
- `npm run build` - Build React app for production
- `npm run server` - Start Express server in development
- `npm run dev:full` - Run both React and Express concurrently
- `npm run lint` - Run ESLint

## Deployment on Railway

### Prerequisites
- Railway.app account (https://railway.app)
- Git repository pushed to GitHub

### Deployment Steps

1. **Create a Railway Project**
   - Go to https://railway.app/dashboard
   - Click "Create a new project"
   - Select "Deploy from GitHub repo"

2. **Connect GitHub Repository**
   - Authorize Railway to access your GitHub
   - Select this repository

3. **Configure Environment Variables** (in Railway Dashboard)
   ```
   NODE_ENV=production
   JWT_SECRET=your-secure-jwt-secret-key
   PORT=3000 (or let Railway assign it)
   ```

4. **Deploy**
   - Railway will automatically detect the Node.js project
   - It will run `npm install` and `npm run build`
   - Then execute `npm start` to launch the server

5. **Done!**
   - Your app will be live on Railway's provided URL

### How It Works on Railway

- The `npm start` script now builds the React app first, then starts the Express server
- The Express server serves the built React app from the `dist` directory
- The database (SQLite) is created automatically on first run
- Default credentials for testing:
  - Admin: admin@task.local / admin123
  - Member: member@task.local / member123

### Important Notes

- Database file (database.db) is stored on the Railway filesystem
- For production, consider migrating to PostgreSQL or MySQL
- Keep `JWT_SECRET` secure and unique for each deployment
- The app uses PORT environment variable (Railway sets this automatically)

### Troubleshooting

If the build fails:
1. Check that all dependencies are listed in package.json
2. Ensure Node version compatibility
3. Check Railway build logs for specific errors

If the app won't start:
1. Verify `NODE_ENV` is set to "production"
2. Check that `npm start` runs without errors locally
3. Review Railway logs for runtime errors

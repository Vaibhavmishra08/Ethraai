This is a polished React + Vite task manager that runs entirely in the browser with local storage instead of Firebase. It has a full auth flow: sign in, register, and reset password, plus built-in demo accounts for fast access.

The app is split into reusable UI components:

SetupProfile.jsx handles login, register, reset-password, and onboarding visuals
ProjectsList.jsx manages project creation and selection
ProjectDetails.jsx handles task boards and task status updates
Dashboard.jsx summarizes work across projects and tasks
The data model is simple and local:

users
projects
tasks
session state
That means the app is self-contained, easy to demo, and avoids any backend setup. It’s a great example of client-side state management, user flows, and clean UI in a browser-first task app.

Render deployment
-----------------

This repository contains the `task-manager` Node + React app in the `task-manager` subfolder. To deploy on Render using their GitHub integration, follow these steps:

1. Go to https://render.com and create or log into your account.
2. Click "New" → "Web Service" → "Connect a repository" and choose this repository.
3. Configure the service:
	- Branch: `main`
	- Root directory: leave blank (we use the `render.yaml` to run the build in the subfolder)
	- Environment: `Node`
	- Build Command: `cd task-manager && npm ci && npm run build`
	- Start Command: `cd task-manager && npm start`
4. Add environment variables in the Render dashboard (Settings → Environment):
	- `JWT_SECRET` — set to a secure random string
	- (optional) `PORT` — Render sets this automatically; Express reads `process.env.PORT` already
5. Save and deploy. Render will run the commands above and start the Express server which serves the built React app.

Notes
- The repository includes a `render.yaml` so Render can auto-detect the service settings.
- We set Node version to 18 via `.nvmrc` and `engines` in `package.json`.
- SQLite (`database.db`) will be created on the instance filesystem — for production consider a managed DB.

If you want, I can also add a dedicated `render` service configuration for separate static frontend and backend services, or switch the DB to PostgreSQL for persistence across deployments.

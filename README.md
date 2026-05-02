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

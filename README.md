# Team Task Manager

Full-stack task management app with role-based access control.

## Features

- Signup / Login with JWT authentication
- Admin and Member roles
- Project creation and team member assignment
- Task creation, assignment, status tracking, and overdue detection
- Dashboard summary for tasks, status, and overdue items

## Getting Started

### Server

```bash
cd server
npm install
npm run dev
```

### Client

```bash
cd client
npm install
npm run dev
```

### Deployment

Deploy the `server` folder as a Node app on Railway. Configure `PORT` and `JWT_SECRET`.

## Notes

- The server uses SQLite for local development.
- The first signed-up user becomes an Admin automatically.
- Use the app in the browser at `http://localhost:5173` while the server runs on `http://localhost:4000`.

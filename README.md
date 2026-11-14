# ChatUI

A real-time messaging application with a React/Vite frontend and an Express, MongoDB, and Socket.IO backend.

**Last updated:** 5 November 2026

## Features

- Email/password sign-up, login, and password reset
- JWT authentication with HTTP-only cookies
- Direct and group messaging with Socket.IO
- Online presence, typing indicators, delivery status, message editing, and deletion
- User search, profile editing, and image uploads
- Cloudinary-backed image storage
- Responsive, light messaging UI
- Health endpoint with an optional 10-minute self-check

## Tech stack

- Frontend: React, Vite, Tailwind CSS, Axios, Socket.IO Client
- Backend: Node.js, Express, MongoDB/Mongoose, Socket.IO
- Media: Cloudinary
- Deployment: Vercel (frontend) and Render (backend)

## Project structure

```text
├── backend/     # Express API, Socket.IO server, MongoDB models
├── frontend/    # React/Vite application
└── README.md
```

## Run locally

Install dependencies:

```bash
cd backend && npm ci
cd ../frontend && npm ci
```

Create `backend/.env`:

```env
PORT=4000
NODE_ENV=development
MONGO_URL=mongodb://127.0.0.1:27017/chat-app
JWT_SECRETKEY=replace-with-a-long-random-secret

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Create `frontend/.env.local`:

```env
VITE_BACKEND_URL=http://localhost:4000
```

Start both apps:

```bash
cd backend && npm start
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Deployment

### Render backend

Set the Render service root directory to `backend`.

```text
Build Command: npm ci
Start Command: npm start
```

Set these environment variables:

```env
NODE_ENV=production
MONGO_URL=your-mongodb-atlas-connection-string
JWT_SECRETKEY=your-long-random-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=https://your-frontend-domain.vercel.app
HEALTHCHECK_URL=https://chat-8t8f.onrender.com/health
```

`PORT` is supplied by Render and should not be set manually.

### Vercel frontend

Set the Vercel project root directory to `frontend`.

```text
Build Command: npm run build
Output Directory: dist
```

Add:

```env
VITE_BACKEND_URL=https://chat-8t8f.onrender.com
```

After setting `VITE_BACKEND_URL`, update the backend's `FRONTEND_URL` with the exact Vercel deployment URL, then redeploy both services.

## Health check

`GET /health` returns a JSON response containing the service status, uptime, and timestamp.

When `HEALTHCHECK_URL` is set, the backend calls that URL at startup and every 10 minutes.

For the deployed backend:

[https://chat-8t8f.onrender.com/health](https://chat-8t8f.onrender.com/health)

## Scripts

| Directory | Command | Description |
| --- | --- | --- |
| `backend` | `npm start` | Start the Express and Socket.IO server |
| `frontend` | `npm run dev` | Run Vite locally |
| `frontend` | `npm run build` | Create a production build |
| `frontend` | `npm run lint` | Run ESLint |

## Security

- Never commit `.env` or `.env.local`.
- Keep MongoDB, Cloudinary, and JWT credentials private.
- Use HTTPS in production so secure authentication cookies work correctly.

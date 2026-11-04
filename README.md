# ChatUI

ChatUI is a real-time messaging application with a React/Vite frontend and an Express, MongoDB, and Socket.IO backend. Users can create accounts, sign in, search for other users, exchange direct messages, create group conversations, upload images, and manage their profiles.

## Features

- Email and password sign-up and login
- JWT authentication stored in an HTTP-only cookie
- Password reset using a user security code
- Search for registered users
- Direct one-to-one messaging
- Real-time message delivery with Socket.IO
- Online user presence
- Message status indicators
- Message editing and deletion
- Group creation, updates, and deletion
- Group messaging
- Profile name and image updates
- Image uploads through Cloudinary
- Responsive React interface

## Project structure

```text
chat-main/
├── backend/
│   ├── controllers/       # User, message, and group routes
│   ├── db/                # MongoDB connection
│   ├── lib/               # Cloudinary and Socket.IO setup
│   ├── middleware/        # Authentication middleware
│   ├── model/             # Mongoose schemas
│   └── server.js          # Express and Socket.IO server
├── frontend/
│   ├── src/components/    # Chat UI components
│   ├── src/context/       # Shared chat state
│   ├── src/pages/         # Authentication pages
│   └── src/lib/axios.js   # API client
└── vercel.json            # Frontend/API deployment rewrites
```

## Requirements

- Node.js 18 or newer
- npm
- MongoDB local instance or MongoDB Atlas database
- Cloudinary account for image uploads

## Local development

### 1. Install dependencies

```bash
cd backend
npm ci

cd ../frontend
npm ci
```

### 2. Configure the backend

Create `backend/.env`:

```env
PORT=4000
MONGO_URL=mongodb://127.0.0.1:27017/chat-app
JWT_SECRETKEY=replace-with-a-long-random-secret

CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

For MongoDB Atlas, replace `MONGO_URL` with the connection string provided by Atlas. URL-encode special characters in the database username or password when required.

### 3. Configure the frontend

Create `frontend/.env.local`:

```env
VITE_BACKEND_URL=http://localhost:4000
```

When `VITE_BACKEND_URL` is not set, the frontend uses `/api`, which is proxied to the local backend by Vite during development.

### 4. Start the application

In one terminal:

```bash
cd backend
npm start
```

In another terminal:

```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

The backend health endpoint is available at [http://localhost:4000/](http://localhost:4000/).

## Available scripts

### Backend

| Command | Description |
| --- | --- |
| `npm start` | Starts the Express and Socket.IO server |

### Frontend

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Creates a production build |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs ESLint |

## API overview

All protected routes require the authentication cookie created during login.

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/user/signup` | Create an account |
| `POST` | `/user/login` | Sign in |
| `POST` | `/user/forgot-password` | Reset a password |
| `GET` | `/user/check-auth` | Check authentication |
| `GET` | `/user/search` | Search for users |
| `PUT` | `/user/update-profile` | Update profile details |
| `DELETE` | `/user/logout` | Sign out |
| `GET` | `/messages` | Get the current user's conversations |
| `GET` | `/messages/:id` | Get direct messages |
| `POST` | `/messages/:id` | Send a direct message |
| `GET` | `/groups/mygroups` | Get the current user's groups |
| `POST` | `/groups/create` | Create a group |

## Deployment

The frontend can be deployed to Vercel and the backend to a Node-compatible service such as Render.

### Backend environment variables

Configure these variables in the backend hosting service:

```env
MONGO_URL=your-mongodb-atlas-connection-string
JWT_SECRETKEY=your-production-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
FRONTEND_URL=https://your-frontend-domain.example
```

`FRONTEND_URL` may contain multiple comma-separated frontend origins when needed.

### Frontend environment variables

Configure:

```env
VITE_BACKEND_URL=https://your-backend-domain.example
```

Make sure the frontend origin is included in the backend's `FRONTEND_URL` value and that cookies are enabled for cross-origin requests.

## Security notes

- Never commit `.env` or `.env.local` files.
- Use a long, unique `JWT_SECRETKEY` in production.
- Do not use the development MongoDB connection string in production.
- Restrict the MongoDB Atlas network access list to the required deployment and development IPs.
- Keep Cloudinary and database credentials private.
- Use HTTPS in production so authentication cookies can be transmitted securely.

## Current limitations

- There are no automated backend tests configured yet.
- Image upload and profile image updates require valid Cloudinary credentials.
- The application expects the backend and frontend origins to be configured correctly for credentialed requests.

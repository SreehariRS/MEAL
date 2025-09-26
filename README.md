# Meal UMS (React + Vite + Express + MongoDB)

This project includes a full-stack User Management System (UMS).

## Backend
- Location: `server/`
- Tech: Express, Mongoose, JWT
- Run: `cd server && npm install && npm run dev`
- Env (`server/.env`):
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ums
JWT_SECRET=change_me
CORS_ORIGIN=http://localhost:5173
```

## Frontend
- Location: root `meal/`
- Run: `npm install && npm run dev`
- Proxy: Vite proxies `/api` to `http://localhost:5000`

## API Endpoints
- Auth:
  - `POST /api/auth/login`
  - `POST /api/auth/register`
  - `GET /api/auth/me`
- Users (auth required; admin to create/update/delete):
  - `GET /api/users?q=<search>`
  - `POST /api/users`
  - `GET /api/users/:id`
  - `PUT /api/users/:id`
  - `DELETE /api/users/:id`

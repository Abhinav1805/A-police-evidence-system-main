
# ForenChain: Police Evidence Management System

> Full-stack application for secure police evidence management, built with Node.js, Express, MongoDB, React, and Vite.


## Project Structure

- `client/` — Frontend (React + Vite)
- `server/` — Backend API (Node.js + Express)

---

## Prerequisites
- Node.js (v18+ recommended)
- npm
- MongoDB Atlas or local MongoDB instance

---

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repo-url>
cd A-police-evidence-system-main
```

### 2. Install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Configure Environment Variables (Server)
Create a `.env` file in the `server/` folder (see `server/README.md` for details).

### 4. Seed Admin User (Server)
```bash
cd ../server
npm run seed
```

### 5. Run the Applications
#### Start Backend (from `server/`):
```bash
npm run dev   # for development
npm start     # for production
```

#### Start Frontend (from `client/`):
```bash
npm run dev
```

---

## Scripts

### Server
- `npm run dev` — Start server with nodemon
- `npm start` — Start server in production
- `npm run seed` — Seed default admin user

### Client
- `npm run dev` — Start React app with Vite
- `npm run build` — Build for production
- `npm run preview` — Preview production build

---

## API & Features
See `server/README.md` for full API documentation, endpoints, and user roles.

---

## License
MIT

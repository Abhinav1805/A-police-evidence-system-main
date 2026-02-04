# ForenChain Server

Backend API for the Police Evidence Management System.

## Setup

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the server folder:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/forenchain?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Get MongoDB Atlas Connection String
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string and replace `<username>`, `<password>`, and `<cluster>`

### 4. Seed Admin User
```bash
npm run seed
```
This creates a default admin:
- **Email:** admin@forenchain.com
- **Password:** admin123

### 5. Run the Server
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| GET | /api/auth/me | Get current user |

### Evidence
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/evidence | Get all evidence |
| POST | /api/evidence | Upload new evidence |
| GET | /api/evidence/:id | Get evidence by ID |
| PUT | /api/evidence/:id | Update evidence |
| DELETE | /api/evidence/:id | Delete evidence |
| PUT | /api/evidence/:id/verify | Verify evidence |
| PUT | /api/evidence/:id/reject | Reject evidence |
| GET | /api/evidence/:id/download | Download evidence file |

### Users (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | Get all users |
| POST | /api/users | Create user |
| GET | /api/users/:id | Get user by ID |
| PUT | /api/users/:id | Update user |
| DELETE | /api/users/:id | Delete user |
| PATCH | /api/users/:id/toggle-status | Toggle user active status |

## User Roles
- **Admin** - Full access
- **Investigator** - Can verify/reject evidence
- **Officer** - Can upload and view evidence
- **Viewer** - Read-only access

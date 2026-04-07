# Super Admin Dashboard - Backend

Multi-Branch School Management System - Backend API

## Features

- **Branch Management**: Add, update, delete, and monitor multiple school branches
- **Data Aggregation**: Fetch and combine data from all branches
- **Health Monitoring**: Automatic health checks for all branches
- **Academic Data**: Access marks, evaluations, subjects, and terms from all branches
- **Finance Tracking**: Combined financial data across all branches
- **Attendance Monitoring**: Real-time attendance from all branches
- **Staff & Student Management**: Unified view of all staff and students
- **Authentication**: JWT-based authentication for super admin users

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Create database:
```bash
createdb super_admin_dashboard
```

4. Run database schema:
```bash
psql -d super_admin_dashboard -f database/schema.sql
```

5. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user

### Branch Management
- `GET /api/branches` - Get all branches
- `POST /api/branches` - Add new branch
- `GET /api/branches/:id` - Get branch details
- `PUT /api/branches/:id` - Update branch
- `DELETE /api/branches/:id` - Delete branch
- `POST /api/branches/:id/test` - Test branch connection
- `GET /api/branches/:id/health` - Get branch health status

### Data Aggregation
- `GET /api/aggregate/overview` - Dashboard overview
- `GET /api/aggregate/students` - All students
- `GET /api/aggregate/staff` - All staff
- `GET /api/aggregate/attendance` - Attendance data
- `GET /api/aggregate/finance` - Finance summary
- `GET /api/aggregate/academics` - Academic data (marks, evaluations, subjects)
- `GET /api/aggregate/classes` - All classes
- `GET /api/aggregate/schedule` - Schedule data
- `GET /api/aggregate/faults` - Discipline/faults data
- `GET /api/aggregate/communications` - Communications/posts
- `GET /api/aggregate/comparison` - Branch comparison

## Default Credentials

- Username: `superadmin`
- Password: `admin123`

**⚠️ Change these credentials immediately after first login!**

## Environment Variables

```env
PORT=6000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=super_admin_dashboard
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:5173
HEALTH_CHECK_INTERVAL=5
CACHE_TTL=300
```

## Health Monitoring

The system automatically checks the health of all branches every 5 minutes (configurable via `HEALTH_CHECK_INTERVAL`).

## Adding a New Branch

1. Use the POST `/api/branches` endpoint
2. Provide:
   - `name`: Branch name
   - `code`: Unique branch code (e.g., IQRAB1)
   - `base_url`: Branch URL (e.g., https://iqrab3.skoolific.com)
   - `api_key`: (Optional) API key for authentication
   - `location`: Branch location
   - `contact_email`: Contact email
   - `contact_phone`: Contact phone
   - `principal_name`: Principal name

The system will automatically test the connection before adding the branch.

## Branch API Requirements

Each branch must have the following endpoints:

- `/api/health` - Health check
- `/api/students/count` - Student count
- `/api/students/all` - All students
- `/api/staff/count` - Staff count
- `/api/staff/all` - All staff
- `/api/classes/count` - Class count
- `/api/classes/all` - All classes
- `/api/finance/summary` - Finance summary
- `/api/attendance/today` - Today's attendance
- `/api/mark-list/summary` - Marks summary
- `/api/mark-list/subjects` - All subjects
- `/api/evaluations/summary` - Evaluations summary
- `/api/academic/terms` - Academic terms
- `/api/schedule/all` - Schedule data
- `/api/faults/summary` - Faults summary
- `/api/posts/summary` - Posts/communications summary

## License

MIT

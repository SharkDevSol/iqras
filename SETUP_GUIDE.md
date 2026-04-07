# Super Admin Dashboard - Complete Setup Guide

## Overview

This is a Multi-Branch School Management System that allows you to monitor and manage multiple school branches from a single dashboard.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  Super Admin Dashboard                       │
│                    (Central System)                          │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   IQRAB1     │    │   IQRAB2     │    │   IQRAB3     │
│   Branch     │    │   Branch     │    │   Branch     │
└──────────────┘    └──────────────┘    └──────────────┘
```

## Features

### ✅ Implemented (Backend)

1. **Branch Management**
   - Add/Remove branches dynamically
   - Test branch connectivity
   - Monitor branch health (automatic checks every 5 minutes)
   - Store branch metadata (location, principal, contact info)

2. **Data Aggregation**
   - Dashboard overview (total students, staff, classes, finance)
   - All students from all branches
   - All staff from all branches
   - Attendance data (real-time)
   - Finance summary (revenue, expenses, profit)
   - Academic data (marks, evaluations, subjects, terms)
   - Classes from all branches
   - Schedule data
   - Faults/discipline records
   - Communications/posts

3. **Analytics**
   - Branch comparison
   - Performance metrics
   - Health monitoring logs

4. **Security**
   - JWT authentication
   - Role-based access (super_admin, viewer)
   - API rate limiting
   - Helmet security headers

5. **Monitoring**
   - Automatic health checks
   - Response time tracking
   - Error logging
   - Sync logs

## Installation Steps

### Step 1: Backend Setup

1. Navigate to backend directory:
```bash
cd super-admin-dashboard/backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Create PostgreSQL database:
```bash
createdb super_admin_dashboard
```

5. Run database schema:
```bash
psql -d super_admin_dashboard -f database/schema.sql
```

6. Start backend server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:6000`

### Step 2: Frontend Setup (Coming Next)

The frontend will be a React + Vite application with:
- Dashboard with overview cards
- Branch management page
- Students page (all branches)
- Staff page (all branches)
- Attendance monitoring
- Finance dashboard
- Academic data viewer
- Analytics & comparison charts
- Settings page

## Default Login Credentials

- **Username**: `superadmin`
- **Password**: `admin123`

⚠️ **IMPORTANT**: Change these credentials immediately after first login!

## Adding Your First Branch

### Method 1: Using API (Postman/cURL)

```bash
curl -X POST http://localhost:6000/api/branches \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Iqrab Branch 3",
    "code": "IQRAB3",
    "base_url": "https://iqrab3.skoolific.com",
    "location": "Addis Ababa",
    "principal_name": "Principal Name",
    "contact_email": "iqrab3@skoolific.com",
    "contact_phone": "+251-XXX-XXXX"
  }'
```

### Method 2: Using Frontend (After Setup)

1. Login to Super Admin Dashboard
2. Go to "Branch Management"
3. Click "Add New Branch"
4. Fill in the form:
   - Branch Name
   - Branch Code (unique identifier)
   - Base URL (e.g., https://iqrab3.skoolific.com)
   - Location
   - Principal Name
   - Contact Info
5. Click "Test Connection" to verify
6. Click "Save"

The system will automatically:
- Test the connection
- Fetch initial data
- Start health monitoring

## Branch Requirements

Each branch system must have these API endpoints:

### Required Endpoints

```
GET  /api/health                    - Health check
GET  /api/students/count            - Total students
GET  /api/students/all              - All students list
GET  /api/staff/count               - Total staff
GET  /api/staff/all                 - All staff list
GET  /api/classes/count             - Total classes
GET  /api/classes/all               - All classes list
GET  /api/finance/summary           - Finance summary
GET  /api/attendance/today          - Today's attendance
GET  /api/attendance/date/:date     - Attendance by date
GET  /api/mark-list/summary         - Marks summary
GET  /api/mark-list/subjects        - All subjects
GET  /api/evaluations/summary       - Evaluations summary
GET  /api/academic/terms            - Academic terms
GET  /api/schedule/all              - Schedule data
GET  /api/faults/summary            - Faults summary
GET  /api/posts/summary             - Posts/communications
```

### Response Format Examples

**Health Check**:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

**Student Count**:
```json
{
  "total": 450
}
```

**Finance Summary**:
```json
{
  "totalRevenue": 1500000,
  "totalExpenses": 800000,
  "totalPending": 200000,
  "netProfit": 700000
}
```

## Database Schema

### Tables

1. **branches** - Store branch information
2. **super_admin_users** - Super admin users
3. **sync_logs** - Data synchronization logs
4. **cached_branch_data** - Cached data for performance
5. **branch_health_logs** - Health check history

## API Documentation

### Authentication

**Login**:
```
POST /api/auth/login
Body: { "username": "superadmin", "password": "admin123" }
Response: { "token": "jwt_token", "user": {...} }
```

**Get Current User**:
```
GET /api/auth/me
Headers: { "Authorization": "Bearer jwt_token" }
```

### Branch Management

**Get All Branches**:
```
GET /api/branches
```

**Add Branch**:
```
POST /api/branches
Body: {
  "name": "Branch Name",
  "code": "CODE",
  "base_url": "https://branch.com",
  "location": "Location",
  "principal_name": "Name"
}
```

**Test Connection**:
```
POST /api/branches/:id/test
```

**Get Health Status**:
```
GET /api/branches/:id/health
```

### Data Aggregation

**Dashboard Overview**:
```
GET /api/aggregate/overview
Response: {
  "totals": {
    "totalStudents": 1200,
    "totalStaff": 150,
    "totalClasses": 45,
    "totalRevenue": 5000000,
    "branches": 3
  },
  "branches": [...]
}
```

**All Students**:
```
GET /api/aggregate/students
```

**Finance Summary**:
```
GET /api/aggregate/finance
```

**Academic Data**:
```
GET /api/aggregate/academics
```

**Branch Comparison**:
```
GET /api/aggregate/comparison
```

## Monitoring & Maintenance

### Health Checks

The system automatically checks branch health every 5 minutes. You can configure this in `.env`:

```env
HEALTH_CHECK_INTERVAL=5  # minutes
```

### Logs

Check logs for:
- Health check results
- Data synchronization
- API errors
- Branch connectivity issues

### Performance

- Data is cached for 5 minutes (configurable via `CACHE_TTL`)
- Health checks run in background
- Parallel data fetching from branches

## Troubleshooting

### Branch Not Connecting

1. Check branch URL is correct
2. Verify branch server is running
3. Check firewall/network settings
4. Test manually: `curl https://branch.com/api/health`

### Slow Performance

1. Increase `CACHE_TTL` in .env
2. Reduce `HEALTH_CHECK_INTERVAL`
3. Check branch response times
4. Consider adding Redis for caching

### Authentication Issues

1. Verify JWT_SECRET is set
2. Check token expiration
3. Ensure user is active in database

## Next Steps

1. ✅ Backend is complete
2. ⏳ Create frontend (React + Vite)
3. ⏳ Add charts and visualizations
4. ⏳ Implement export features (PDF/Excel)
5. ⏳ Add real-time notifications
6. ⏳ Create mobile app

## Support

For issues or questions, contact the development team.

## License

MIT License - ALKHWARIZMI School Management System

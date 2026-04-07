# Super Admin Dashboard - Quick Reference

## 🚀 Quick Start Commands

```bash
# 1. Install dependencies
cd super-admin-dashboard/backend
npm install

# 2. Create database
createdb super_admin_dashboard

# 3. Run schema
psql -d super_admin_dashboard -f database/schema.sql

# 4. Create admin user (optional - already in schema)
node create-admin.js

# 5. Start server
npm run dev
```

## 🔑 Default Login

- URL: `http://localhost:6000`
- Username: `superadmin`
- Password: `admin123`

## 📡 Essential API Calls

### Login
```bash
curl -X POST http://localhost:6000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"superadmin","password":"admin123"}'
```

### Add Branch
```bash
curl -X POST http://localhost:6000/api/branches \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Iqrab Branch 3",
    "code": "IQRAB3",
    "base_url": "https://iqrab3.skoolific.com",
    "location": "Addis Ababa",
    "principal_name": "Principal Name"
  }'
```

### Get Dashboard Overview
```bash
curl http://localhost:6000/api/aggregate/overview
```

### Get All Students
```bash
curl http://localhost:6000/api/aggregate/students
```

### Test Branch Connection
```bash
curl -X POST http://localhost:6000/api/branches/1/test
```

## 📊 Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/auth/login` | POST | Login |
| `/api/branches` | GET | List branches |
| `/api/branches` | POST | Add branch |
| `/api/branches/:id` | PUT | Update branch |
| `/api/branches/:id` | DELETE | Delete branch |
| `/api/branches/:id/test` | POST | Test connection |
| `/api/aggregate/overview` | GET | Dashboard data |
| `/api/aggregate/students` | GET | All students |
| `/api/aggregate/staff` | GET | All staff |
| `/api/aggregate/finance` | GET | Finance summary |
| `/api/aggregate/academics` | GET | Academic data |
| `/api/aggregate/comparison` | GET | Branch comparison |

## 🗄️ Database Tables

- `branches` - Branch information
- `super_admin_users` - Admin users
- `sync_logs` - Sync history
- `cached_branch_data` - Cached data
- `branch_health_logs` - Health logs

## 🔧 Environment Variables

```env
PORT=6000
DB_NAME=super_admin_dashboard
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret
FRONTEND_URL=http://localhost:5173
HEALTH_CHECK_INTERVAL=5
```

## 📝 Branch Requirements

Each branch must have:
- `/api/health` - Health check
- `/api/students/count` - Student count
- `/api/students/all` - All students
- `/api/staff/count` - Staff count
- `/api/staff/all` - All staff
- `/api/classes/count` - Class count
- `/api/finance/summary` - Finance data
- `/api/attendance/today` - Attendance
- `/api/mark-list/summary` - Marks
- `/api/evaluations/summary` - Evaluations

## 🎯 Common Tasks

### Add a New Branch
1. POST to `/api/branches` with branch details
2. System tests connection automatically
3. Health monitoring starts automatically

### View All Data
1. GET `/api/aggregate/overview` for summary
2. GET `/api/aggregate/students` for all students
3. GET `/api/aggregate/finance` for finance

### Monitor Branch Health
1. GET `/api/branches/:id/health` for current status
2. GET `/api/branches/:id/health-logs` for history
3. Automatic checks run every 5 minutes

## 🐛 Troubleshooting

### Server won't start
- Check database is running
- Verify .env configuration
- Check port 6000 is available

### Branch won't connect
- Verify branch URL is correct
- Check branch server is running
- Test manually: `curl https://branch.com/api/health`

### No data showing
- Check branch health status
- Verify branch endpoints exist
- Check sync logs in database

## 📞 Support

Check logs for errors:
```bash
# View server logs
npm run dev

# Check database
psql -d super_admin_dashboard
```

## ✅ Checklist

- [ ] Database created
- [ ] Schema loaded
- [ ] Dependencies installed
- [ ] .env configured
- [ ] Server running
- [ ] Can login
- [ ] Branch added
- [ ] Data fetching

---

**Quick Help**: Run `npm run dev` and visit `http://localhost:6000/api/health`

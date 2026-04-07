# ✅ IQRAS Super Admin Dashboard - Deployment Complete!

## 🎉 System Successfully Deployed

### 📍 URLs
- **Frontend**: https://iqras.skoolific.com (placeholder - frontend to be built)
- **Backend API**: https://iqras.skoolific.com/api
- **Health Check**: https://iqras.skoolific.com/api/health

### 🔐 Default Login Credentials
- **Username**: `superadmin`
- **Password**: `admin123`

⚠️ **IMPORTANT**: Change these credentials immediately after first login!

### ✅ What's Been Deployed

#### Backend (Complete & Running)
- ✅ Node.js Express server on port 6000
- ✅ PostgreSQL database: `super_iqra`
- ✅ All tables auto-created on startup
- ✅ PM2 process: `iqras-backend`
- ✅ SSL certificate installed
- ✅ Nginx reverse proxy configured
- ✅ Automatic health checks every 5 minutes

#### Database
- ✅ Database name: `super_iqra`
- ✅ Auto-created on first run
- ✅ All tables created automatically:
  - branches
  - super_admin_users
  - sync_logs
  - cached_branch_data
  - branch_health_logs
- ✅ Default admin user created

#### GitHub Repository
- ✅ Pushed to: https://github.com/SharkDevSol/iqras.git
- ✅ All code committed
- ✅ Ready for collaboration

### 📊 API Endpoints Available

#### Authentication
- POST `/api/auth/login` - Login
- POST `/api/auth/register` - Register new user
- GET `/api/auth/me` - Get current user

#### Branch Management
- GET `/api/branches` - List all branches
- POST `/api/branches` - Add new branch
- GET `/api/branches/:id` - Get branch details
- PUT `/api/branches/:id` - Update branch
- DELETE `/api/branches/:id` - Delete branch
- POST `/api/branches/:id/test` - Test connection
- GET `/api/branches/:id/health` - Health status

#### Data Aggregation
- GET `/api/aggregate/overview` - Dashboard overview
- GET `/api/aggregate/students` - All students
- GET `/api/aggregate/staff` - All staff
- GET `/api/aggregate/attendance` - Attendance data
- GET `/api/aggregate/finance` - Finance summary
- GET `/api/aggregate/academics` - Academic data
- GET `/api/aggregate/classes` - All classes
- GET `/api/aggregate/schedule` - Schedule data
- GET `/api/aggregate/faults` - Faults data
- GET `/api/aggregate/communications` - Communications
- GET `/api/aggregate/comparison` - Branch comparison

### 🧪 Test the API

```bash
# Health check
curl https://iqras.skoolific.com/api/health

# Login
curl -X POST https://iqras.skoolific.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"superadmin","password":"admin123"}'

# Get branches
curl https://iqras.skoolific.com/api/branches
```

### 📝 How to Add Your First Branch

#### Method 1: Using cURL
```bash
curl -X POST https://iqras.skoolific.com/api/branches \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Iqrab Branch 3",
    "code": "IQRAB3",
    "base_url": "https://iqrab3.skoolific.com",
    "location": "Addis Ababa",
    "principal_name": "Principal Name",
    "contact_email": "iqrab3@skoolific.com"
  }'
```

#### Method 2: Using Postman
1. Open Postman
2. Create POST request to `https://iqras.skoolific.com/api/branches`
3. Set Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "name": "Iqrab Branch 3",
  "code": "IQRAB3",
  "base_url": "https://iqrab3.skoolific.com",
  "location": "Addis Ababa",
  "principal_name": "Principal Name"
}
```

### 🔧 Server Details

#### VPS Information
- **IP**: 76.13.48.245
- **Domain**: iqras.skoolific.com
- **Backend Port**: 6000
- **Backend Path**: `/var/www/iqras/backend`
- **Frontend Path**: `/var/www/iqras.skoolific.com`
- **PM2 Process**: `iqras-backend`

#### Database
- **Name**: super_iqra
- **User**: skoolific_user
- **Host**: localhost
- **Port**: 5432

#### PM2 Commands
```bash
# View logs
pm2 logs iqras-backend

# Restart
pm2 restart iqras-backend

# Stop
pm2 stop iqras-backend

# Status
pm2 status
```

### 🎯 Next Steps

#### 1. Build Frontend (Optional - can use API directly)
```bash
cd /var/www/iqras/frontend
npm install
npm run build
cp -r dist/* /var/www/iqras.skoolific.com/
```

#### 2. Add Your Branches
Use the API to add your school branches (IQRAB1, IQRAB2, IQRAB3, etc.)

#### 3. Test Data Aggregation
Once branches are added, test the aggregation endpoints to see combined data

#### 4. Change Default Password
Login and change the default admin password immediately

### 📚 Documentation

- **Setup Guide**: `SETUP_GUIDE.md`
- **Backend README**: `backend/README.md`
- **Quick Reference**: `QUICK_REFERENCE.md`
- **API Documentation**: See backend README

### 🔒 Security Notes

1. ✅ SSL certificate installed and auto-renewing
2. ✅ JWT authentication enabled
3. ✅ Rate limiting configured
4. ✅ Helmet security headers active
5. ⚠️ Change default admin password
6. ⚠️ Update JWT_SECRET in production .env

### 🎊 Features

- ✅ Dynamic branch management (no coding needed to add branches)
- ✅ Automatic database creation
- ✅ Automatic table creation
- ✅ Health monitoring (every 5 minutes)
- ✅ Data aggregation from all branches
- ✅ Academic data (marks, evaluations, subjects, terms)
- ✅ Finance tracking
- ✅ Attendance monitoring
- ✅ Staff & student management
- ✅ Branch comparison analytics

### 📞 Support

For issues:
1. Check PM2 logs: `pm2 logs iqras-backend`
2. Check Nginx logs: `tail -f /var/log/nginx/error.log`
3. Test API: `curl https://iqras.skoolific.com/api/health`

---

**Status**: ✅ Backend Deployed & Running
**Date**: April 7, 2026
**Domain**: https://iqras.skoolific.com
**GitHub**: https://github.com/SharkDevSol/iqras.git

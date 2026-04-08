# IQRAS Super Admin Dashboard

Multi-branch school management system for aggregating data from multiple IQRAB branches.

## 🎯 Current Status

### ✅ What's Working
- Super Admin Dashboard deployed at https://iqras.skoolific.com
- Backend API running on PM2 (port 6000)
- Frontend built and served via Nginx with SSL
- PostgreSQL database configured
- Login system working
- Branch management (add/delete branches)
- Health monitoring system

### ⚠️ What Needs Attention
- **Branch systems need aggregation endpoints** to show data
- Currently only 2/16 required endpoints exist on iqrab3
- Dashboard shows "Connection successful" but no data appears

## 🔍 Test Results for iqrab3.skoolific.com

```
CRITICAL ENDPOINTS:
✅ Health Check (/api/health) - OK
❌ Students Count (/api/students/count) - NOT FOUND
❌ All Students (/api/students/all) - NOT FOUND
❌ Staff Count (/api/staff/count) - NOT FOUND
❌ All Staff (/api/staff/all) - NOT FOUND
❌ Classes Count (/api/classes/count) - NOT FOUND
❌ All Classes (/api/classes/all) - NOT FOUND

IMPORTANT ENDPOINTS:
❌ Finance Summary (/api/finance/summary) - NOT FOUND
❌ Mark List Summary (/api/mark-list/summary) - NOT FOUND
✅ Subjects (/api/mark-list/subjects) - OK

RESULTS: 2/16 endpoints working
```

## 🚀 Quick Fix (3 Steps)

### 1. Copy Template to Branch
```bash
scp BRANCH-AGGREGATION-ROUTES-TEMPLATE.js root@76.13.48.245:/var/www/iqrab3.skoolific.com/backend/routes/aggregationRoutes.js
```

### 2. Add Routes to server.js
```javascript
import aggregationRoutes from './routes/aggregationRoutes.js';
app.use('/api', aggregationRoutes);
```

### 3. Restart Backend
```bash
ssh root@76.13.48.245
pm2 restart iqrab3-backend
```

### 4. Test Again
```powershell
.\test-branch-endpoints.ps1 https://iqrab3.skoolific.com
```

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **WHY-NO-DATA.md** | Quick explanation of the issue |
| **SETUP-GUIDE.md** | Complete step-by-step setup instructions |
| **BRANCH-API-REQUIREMENTS.md** | Detailed API specifications |
| **BRANCH-AGGREGATION-ROUTES-TEMPLATE.js** | Ready-to-use routes code |
| **test-branch-endpoints.ps1** | PowerShell test script |
| **test-branch-endpoints.sh** | Bash test script |
| **DEPLOYMENT-COMPLETE.md** | Deployment information |

## 🔐 Access Information

- **URL**: https://iqras.skoolific.com
- **Username**: `superadmin`
- **Password**: `admin123` (change after first login!)
- **API**: https://iqras.skoolific.com/api
- **Health**: https://iqras.skoolific.com/api/health

## 📊 Features

### Dashboard Pages
1. **Dashboard** - Overview with statistics and branch health
2. **Branches** - Add/manage school branches dynamically
3. **Students** - View all students across all branches
4. **Staff** - View all staff with contact information
5. **Finance** - Financial overview with charts
6. **Academics** - Subjects, classes, terms, evaluations

### Backend Features
- 21 API endpoints for data aggregation
- JWT authentication
- Automatic health monitoring (every 5 minutes)
- Branch connection testing
- Data caching support
- Rate limiting
- Error handling

### Frontend Features
- Responsive design
- Real-time data fetching
- Interactive charts (Recharts)
- Filtering and search
- Export to CSV
- Branch health monitoring

## 🛠️ Technical Stack

### Backend
- Node.js + Express
- PostgreSQL database
- JWT authentication
- PM2 process manager
- Axios for HTTP requests

### Frontend
- React + Vite
- React Router
- Axios
- Recharts
- CSS Modules

### Infrastructure
- Nginx reverse proxy
- Let's Encrypt SSL
- Ubuntu VPS (76.13.48.245)

## 📋 Required Endpoints for Each Branch

Each branch must expose these endpoints:

### Critical (Required)
- `GET /api/health` - Health check
- `GET /api/students/count` - Student count
- `GET /api/students/all` - All students
- `GET /api/staff/count` - Staff count
- `GET /api/staff/all` - All staff
- `GET /api/classes/count` - Classes count
- `GET /api/classes/all` - All classes

### Important
- `GET /api/finance/summary` - Finance overview
- `GET /api/mark-list/summary` - Marks summary
- `GET /api/mark-list/subjects` - Subjects list

### Optional
- `GET /api/evaluations/summary` - Evaluations
- `GET /api/academic/terms` - Academic terms
- `GET /api/attendance/today` - Today's attendance
- `GET /api/attendance/date/:date` - Date attendance
- `GET /api/schedule/all` - Class schedule
- `GET /api/faults/summary` - Discipline data
- `GET /api/posts/summary` - Communications

## 🔧 Management Commands

### Check Backend Status
```bash
ssh root@76.13.48.245
pm2 status iqras-backend
pm2 logs iqras-backend
```

### Restart Backend
```bash
pm2 restart iqras-backend
```

### Check Database
```bash
sudo -u postgres psql -d super_iqra -c 'SELECT * FROM branches;'
```

### Test Branch Endpoints
```powershell
.\test-branch-endpoints.ps1 https://iqrab3.skoolific.com
```

## 🐛 Troubleshooting

### No data showing in dashboard
**Cause**: Branch systems don't have aggregation endpoints  
**Solution**: Add endpoints using BRANCH-AGGREGATION-ROUTES-TEMPLATE.js

### 404 errors in logs
**Cause**: Endpoints don't exist on branch  
**Solution**: Add aggregation routes to branch backend

### 500 errors in logs
**Cause**: Database query errors  
**Solution**: Check table/column names match your schema

### Connection timeout
**Cause**: Branch is slow or down  
**Solution**: Check branch health status

## 📞 Support

Check logs:
```bash
# Super admin backend
pm2 logs iqras-backend

# Branch backend
pm2 logs iqrab3-backend

# Nginx
tail -f /var/log/nginx/error.log
```

Test endpoints:
```bash
curl https://iqras.skoolific.com/api/health
curl https://iqrab3.skoolific.com/api/health
```

## 🎯 Next Steps

1. ✅ Add aggregation endpoints to iqrab3.skoolific.com
2. ✅ Test with super admin dashboard
3. ✅ Verify data appears in all pages
4. ✅ Add aggregation endpoints to other branches (iqrab1, iqrab2)
5. ✅ Change default admin password
6. ✅ Add more branches as needed

## 📝 Notes

- The super admin dashboard is fully functional
- Branch connection testing works (health check)
- Data aggregation will work once branches expose the required endpoints
- All documentation and templates are provided
- System is production-ready once branch endpoints are added

---

**Deployed on**: April 7, 2026  
**VPS IP**: 76.13.48.245  
**Domain**: iqras.skoolific.com  
**Status**: ✅ LIVE (waiting for branch endpoints)

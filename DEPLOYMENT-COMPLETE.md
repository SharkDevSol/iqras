# IQRAS Super Admin Dashboard - Deployment Complete! 🎉

## ✅ Deployment Status: SUCCESSFUL

The IQRAS Super Admin Dashboard has been successfully deployed and is now live!

## 🌐 Access Information

### Frontend (Web Dashboard)
- **URL**: https://iqras.skoolific.com
- **Status**: ✅ Live and accessible

### Backend API
- **URL**: https://iqras.skoolific.com/api
- **Health Check**: https://iqras.skoolific.com/api/health
- **Status**: ✅ Running on port 6000

### Login Credentials
- **Username**: `superadmin`
- **Password**: `admin123`
- ⚠️ **IMPORTANT**: Change this password after first login!

## 📊 System Components

### Backend
- **Location**: `/var/www/iqras.skoolific.com/backend`
- **PM2 Process**: `iqras-backend` (ID: 6)
- **Port**: 6000
- **Database**: PostgreSQL (`super_iqra`)
- **Status**: ✅ Running

### Frontend
- **Location**: `/var/www/iqras.skoolific.com/frontend/dist`
- **Web Server**: Nginx
- **SSL**: ✅ Configured with Let's Encrypt
- **Status**: ✅ Serving

### Database
- **Type**: PostgreSQL
- **Name**: `super_iqra`
- **User**: `postgres`
- **Tables Created**: ✅
  - branches
  - super_admin_users
  - sync_logs
  - cached_branch_data
  - branch_health_logs

## 🎯 Available Features

### Dashboard Pages
1. **Login** - Authentication page
2. **Dashboard** - Overview with statistics and branch health
3. **Branches** - Add and manage school branches
4. **Students** - View all students across all branches
5. **Staff** - View all staff with contact information
6. **Finance** - Financial overview with charts
7. **Academics** - Subjects, classes, terms, and evaluations

### API Endpoints
- `POST /api/auth/login` - User authentication
- `GET /api/branches` - List all branches
- `POST /api/branches` - Add new branch
- `GET /api/aggregate/overview` - Dashboard statistics
- `GET /api/aggregate/students` - All students data
- `GET /api/aggregate/staff` - All staff data
- `GET /api/aggregate/finance` - Financial data
- `GET /api/aggregate/academics` - Academic data

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

### Update System
```bash
cd /var/www/iqras.skoolific.com
git pull origin main
cd backend && npm install
pm2 restart iqras-backend
```

### Check Database
```bash
sudo -u postgres psql -d super_iqra -c '\dt'
sudo -u postgres psql -d super_iqra -c 'SELECT * FROM branches;'
```

### Check Nginx
```bash
nginx -t
systemctl status nginx
systemctl restart nginx
```

## 📝 How to Add Branches

1. Login to https://iqras.skoolific.com
2. Navigate to "Branches" page
3. Click "Add Branch" button
4. Fill in the form:
   - **Branch Name**: e.g., "IQRAB3"
   - **Branch Code**: e.g., "IQRAB3"
   - **Base URL**: e.g., "https://iqrab3.skoolific.com"
   - **Location**: Optional
   - **Principal Name**: Optional
   - **Contact Info**: Optional
5. Click "Add Branch"
6. The system will automatically:
   - Test the connection
   - Fetch data from the branch
   - Display it in the dashboard

## 🔒 Security Notes

1. ✅ SSL/HTTPS enabled
2. ✅ Rate limiting configured
3. ✅ CORS configured
4. ✅ Helmet security headers
5. ⚠️ Change default admin password immediately
6. ⚠️ Update JWT_SECRET in production

## 📈 Monitoring

### Health Checks
- Automatic health checks run every 5 minutes
- Branch status is updated automatically
- View health status in the Dashboard

### Logs
```bash
# Backend logs
pm2 logs iqras-backend

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## 🎨 Features Implemented

### Frontend
- ✅ Responsive design
- ✅ Modern UI with React
- ✅ Real-time data fetching
- ✅ Interactive charts (Recharts)
- ✅ Filtering and search
- ✅ Export to CSV
- ✅ Branch health monitoring

### Backend
- ✅ RESTful API
- ✅ JWT authentication
- ✅ PostgreSQL database
- ✅ Auto-database initialization
- ✅ Branch health monitoring
- ✅ Data aggregation from multiple branches
- ✅ Caching support
- ✅ Error handling
- ✅ Rate limiting

## 🚀 Next Steps

1. **Login** to the dashboard at https://iqras.skoolific.com
2. **Change** the default password
3. **Add** your first branch (e.g., iqrab3.skoolific.com)
4. **Explore** the dashboard features
5. **Monitor** branch health and data

## 📞 Support

If you encounter any issues:
1. Check PM2 logs: `pm2 logs iqras-backend`
2. Check Nginx logs: `tail -f /var/log/nginx/error.log`
3. Verify database connection: `sudo -u postgres psql -d super_iqra`
4. Test API health: `curl https://iqras.skoolific.com/api/health`

## 🎉 Congratulations!

Your IQRAS Super Admin Dashboard is now live and ready to manage multiple school branches!

**Access it now**: https://iqras.skoolific.com

---

**Deployed on**: April 7, 2026
**VPS IP**: 76.13.48.245
**Domain**: iqras.skoolific.com
**Status**: ✅ LIVE

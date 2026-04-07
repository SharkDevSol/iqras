# IQRAS Super Admin Dashboard - Deployment Guide

## System Overview
- **Domain**: https://iqras.skoolific.com
- **Backend Port**: 6000
- **Database**: super_iqra (MySQL)
- **VPS IP**: 76.13.48.245

## Backend Deployment

### 1. SSH to VPS
```bash
ssh root@76.13.48.245
```

### 2. Clone Repository
```bash
cd /var/www
git clone https://github.com/SharkDevSol/iqras.git iqras.skoolific.com
cd iqras.skoolific.com/backend
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment
```bash
cp .env.production .env
# Edit .env if needed
nano .env
```

### 5. Start Backend with PM2
```bash
pm2 start server.js --name iqras-backend
pm2 save
pm2 startup
```

### 6. Check Backend Status
```bash
pm2 status
pm2 logs iqras-backend
curl http://localhost:6000/api/health
```

## Frontend Deployment

### 1. Build Frontend (Already done locally)
The dist folder is already built and pushed to GitHub.

### 2. Deploy to VPS
```bash
cd /var/www/iqras.skoolific.com/frontend
# The dist folder should already be there from git
```

### 3. Configure Nginx
```bash
nano /etc/nginx/sites-available/iqras.skoolific.com
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name iqras.skoolific.com;

    # Frontend
    root /var/www/iqras.skoolific.com/frontend/dist;
    index index.html;

    # Frontend routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://localhost:6000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4. Enable Site and Restart Nginx
```bash
ln -s /etc/nginx/sites-available/iqras.skoolific.com /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 5. Setup SSL Certificate
```bash
certbot --nginx -d iqras.skoolific.com
```

## Database Setup

The database and tables are created automatically when the backend starts for the first time.

### Default Admin User
- **Username**: superadmin
- **Password**: admin123

## Verification

### 1. Check Backend
```bash
curl https://iqras.skoolific.com/api/health
```

### 2. Check Frontend
Open browser: https://iqras.skoolific.com

### 3. Test Login
- Go to https://iqras.skoolific.com
- Login with: superadmin / admin123

## Adding Branches

1. Login to the dashboard
2. Go to "Branches" page
3. Click "Add Branch"
4. Fill in:
   - Branch Name: e.g., "IQRAB3"
   - Branch Code: e.g., "IQRAB3"
   - Base URL: e.g., "https://iqrab3.skoolific.com"
   - Location, Principal, Contact info (optional)
5. Click "Add Branch"
6. The system will automatically fetch data from the branch

## Monitoring

### Check PM2 Status
```bash
pm2 status
pm2 logs iqras-backend
```

### Check Nginx Logs
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Check Database
```bash
mysql -u skoolific_user -p
USE super_iqra;
SHOW TABLES;
SELECT * FROM branches;
```

## Troubleshooting

### Backend Not Starting
```bash
pm2 logs iqras-backend --lines 100
# Check for errors
```

### Frontend Not Loading
```bash
# Check nginx configuration
nginx -t
# Check if dist folder exists
ls -la /var/www/iqras.skoolific.com/frontend/dist
```

### Database Connection Error
```bash
# Check database credentials in .env
# Test database connection
mysql -u skoolific_user -p -e "USE super_iqra; SHOW TABLES;"
```

### Branch Connection Failed
- Verify the branch URL is correct and accessible
- Check if the branch backend is running
- Verify CORS is configured on the branch backend

## Updating the System

### Update Backend
```bash
cd /var/www/iqras.skoolific.com
git pull origin main
cd backend
npm install
pm2 restart iqras-backend
```

### Update Frontend
```bash
cd /var/www/iqras.skoolific.com
git pull origin main
# The new dist folder will be pulled automatically
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/login` - Login
- `GET /api/branches` - Get all branches
- `POST /api/branches` - Add new branch
- `GET /api/aggregate/overview` - Dashboard overview
- `GET /api/aggregate/students` - All students
- `GET /api/aggregate/staff` - All staff
- `GET /api/aggregate/finance` - Finance data
- `GET /api/aggregate/academics` - Academic data

## Security Notes

1. Change the default admin password after first login
2. Update JWT_SECRET in .env to a strong random string
3. Keep the system updated regularly
4. Monitor logs for suspicious activity
5. Use strong passwords for database and admin accounts

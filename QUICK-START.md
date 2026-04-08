# Quick Start Guide - Fix "No Data" Issue

## The Problem
✅ Super Admin Dashboard is working  
✅ Branch connection test passes  
❌ No data shows in Dashboard, Students, Staff, Finance, or Academics pages

## The Solution
Add aggregation API endpoints to each branch system (iqrab3, iqrab1, iqrab2, etc.)

---

## For iqrab3.skoolific.com

### Step 1: Upload the template file
```bash
scp super-admin-dashboard/BRANCH-AGGREGATION-ROUTES-TEMPLATE.js root@76.13.48.245:/var/www/iqrab3.skoolific.com/backend/routes/aggregationRoutes.js
```

### Step 2: SSH into the server
```bash
ssh root@76.13.48.245
```

### Step 3: Edit the server.js file
```bash
cd /var/www/iqrab3.skoolific.com/backend
nano server.js
```

Add these lines near the top (with other imports):
```javascript
import aggregationRoutes from './routes/aggregationRoutes.js';
```

Add this line with other routes (after other app.use statements):
```javascript
app.use('/api', aggregationRoutes);
```

Save and exit (Ctrl+X, then Y, then Enter)

### Step 4: Adjust database queries (if needed)
```bash
nano routes/aggregationRoutes.js
```

Check if table names match your database:
- `students` table exists? (or is it `student_info`?)
- `staff` table exists? (or is it `teachers`?)
- `classes` table exists?
- `invoices` table exists? (or is it `payments`?)

If names are different, update the queries in the file.

### Step 5: Restart the backend
```bash
pm2 restart iqrab3-backend
# or if the process name is different:
pm2 list  # to see all processes
pm2 restart <process-name>
```

### Step 6: Test the endpoints
```bash
curl https://iqrab3.skoolific.com/api/health
curl https://iqrab3.skoolific.com/api/students/count
curl https://iqrab3.skoolific.com/api/staff/count
```

You should see JSON responses, not 404 errors.

### Step 7: Test with the dashboard
1. Go to https://iqras.skoolific.com
2. Login with `superadmin` / `admin123`
3. Navigate to "Dashboard" - you should see data now!
4. Navigate to "Students" - you should see all students
5. Navigate to "Staff" - you should see all staff

---

## For Other Branches (iqrab1, iqrab2, etc.)

Repeat the same steps for each branch:

### iqrab1.skoolific.com
```bash
scp super-admin-dashboard/BRANCH-AGGREGATION-ROUTES-TEMPLATE.js root@76.13.48.245:/var/www/iqrab1.skoolific.com/backend/routes/aggregationRoutes.js
ssh root@76.13.48.245
cd /var/www/iqrab1.skoolific.com/backend
# Edit server.js, add routes, restart
pm2 restart iqrab1-backend
```

### iqrab2.skoolific.com
```bash
scp super-admin-dashboard/BRANCH-AGGREGATION-ROUTES-TEMPLATE.js root@76.13.48.245:/var/www/iqrab2.skoolific.com/backend/routes/aggregationRoutes.js
ssh root@76.13.48.245
cd /var/www/iqrab2.skoolific.com/backend
# Edit server.js, add routes, restart
pm2 restart iqrab2-backend
```

---

## Verification

### Test all endpoints for a branch
```powershell
# On Windows
.\test-branch-endpoints.ps1 https://iqrab3.skoolific.com
```

```bash
# On Linux/Mac
./test-branch-endpoints.sh https://iqrab3.skoolific.com
```

Expected result: At least 7/16 endpoints should work (all critical ones)

### Check backend logs
```bash
ssh root@76.13.48.245
pm2 logs iqras-backend --lines 50
```

You should NOT see "404" errors anymore. Instead you should see successful data fetches.

---

## Common Issues

### Issue: "Cannot find module '../config/database.js'"
**Solution**: Update the import path in aggregationRoutes.js to match your database config location
```javascript
// Change this:
import pool from '../config/database.js';
// To this (if your config is elsewhere):
import pool from '../db/connection.js';
```

### Issue: "Table 'students' doesn't exist"
**Solution**: Update table names in the queries to match your database schema
```javascript
// Change this:
const result = await pool.query('SELECT COUNT(*) as total FROM students');
// To this:
const result = await pool.query('SELECT COUNT(*) as total FROM student_info');
```

### Issue: "Column 'name' doesn't exist"
**Solution**: Update column names in the queries
```javascript
// Change this:
SELECT s.name FROM students s
// To this:
SELECT s.student_name as name FROM students s
```

### Issue: Still getting 404 errors
**Solution**: Make sure you added the routes to server.js and restarted the backend
```bash
pm2 restart iqrab3-backend
pm2 logs iqrab3-backend --lines 20
```

---

## Summary

1. ✅ Copy template file to branch backend
2. ✅ Add import and route to server.js
3. ✅ Adjust database queries if needed
4. ✅ Restart backend
5. ✅ Test endpoints
6. ✅ Check dashboard - data should appear!

---

## Need Help?

Check the detailed guides:
- **WHY-NO-DATA.md** - Explanation of the issue
- **SETUP-GUIDE.md** - Complete setup instructions
- **BRANCH-API-REQUIREMENTS.md** - API specifications
- **README.md** - Full documentation

Test your branch:
```powershell
.\test-branch-endpoints.ps1 https://iqrab3.skoolific.com
```

Check logs:
```bash
pm2 logs iqras-backend
pm2 logs iqrab3-backend
```

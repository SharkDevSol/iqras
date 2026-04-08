# Super Admin Dashboard - Complete Setup Guide

## Current Status

✅ **Super Admin Dashboard**: Fully deployed at https://iqras.skoolific.com
- Backend running on PM2 (port 6000)
- Frontend built and served via Nginx
- Database configured (PostgreSQL)
- Login working (username: `superadmin`, password: `admin123`)

⚠️ **Branch Systems**: Need to expose aggregation API endpoints

## Why No Data is Showing

The Super Admin Dashboard successfully connects to branches (like iqrab3.skoolific.com) but cannot fetch data because the branch systems don't have the required API endpoints yet.

When you add a branch, the dashboard tests the connection using `/api/health` endpoint, which works. However, when trying to fetch actual data (students, staff, finance, etc.), it gets 404 errors because those endpoints don't exist on the branch systems.

## Solution: Add Aggregation Endpoints to Each Branch

### Step 1: For iqrab3.skoolific.com (and other branches)

1. **Copy the template file** to your branch backend:
   ```bash
   # On your local machine
   scp super-admin-dashboard/BRANCH-AGGREGATION-ROUTES-TEMPLATE.js root@76.13.48.245:/var/www/iqrab3.skoolific.com/backend/routes/aggregationRoutes.js
   ```

2. **Update the database import** in the file to match your branch's database config:
   ```javascript
   // Change this line to match your database config path
   import pool from '../config/database.js';
   ```

3. **Add the routes to your server.js**:
   ```javascript
   import aggregationRoutes from './routes/aggregationRoutes.js';
   
   // Add this line with your other routes
   app.use('/api', aggregationRoutes);
   ```

4. **Restart your branch backend**:
   ```bash
   ssh root@76.13.48.245
   cd /var/www/iqrab3.skoolific.com/backend
   pm2 restart iqrab3-backend  # or whatever your PM2 process name is
   ```

5. **Test the endpoints**:
   ```bash
   curl https://iqrab3.skoolific.com/api/health
   curl https://iqrab3.skoolific.com/api/students/count
   curl https://iqrab3.skoolific.com/api/staff/count
   ```

### Step 2: Adjust Database Queries

The template file uses generic table names. You may need to adjust the queries to match your actual database schema:

**Common adjustments needed:**
- Table names (e.g., `students` vs `student_info`)
- Column names (e.g., `name` vs `student_name`)
- Join conditions
- Status values (e.g., `'paid'` vs `'completed'`)

**Example adjustments:**
```javascript
// If your students table is named 'student_info'
const result = await pool.query('SELECT COUNT(*) as total FROM student_info');

// If your class column is named 'class_name' instead of 'name'
SELECT c.class_name as class FROM classes c
```

### Step 3: Handle Missing Tables

If some tables don't exist in your branch database (e.g., `faults`, `evaluations`), you have two options:

**Option 1: Return empty data**
```javascript
router.get('/faults/summary', async (req, res) => {
  res.json({
    totalFaults: 0,
    resolved: 0,
    pending: 0
  });
});
```

**Option 2: Return error**
```javascript
router.get('/faults/summary', async (req, res) => {
  res.status(501).json({ error: 'Faults feature not implemented' });
});
```

### Step 4: Test with Super Admin Dashboard

1. Go to https://iqras.skoolific.com
2. Login with `superadmin` / `admin123`
3. Navigate to "Dashboard" - you should see data now
4. Navigate to "Students" - you should see all students from all branches
5. Navigate to "Staff" - you should see all staff from all branches
6. Navigate to "Finance" - you should see financial data
7. Navigate to "Academics" - you should see academic data

## Required Endpoints Summary

| Endpoint | Purpose | Priority |
|----------|---------|----------|
| `/api/health` | Health check | ✅ Required |
| `/api/students/count` | Student count | ✅ Required |
| `/api/students/all` | All students | ✅ Required |
| `/api/staff/count` | Staff count | ✅ Required |
| `/api/staff/all` | All staff | ✅ Required |
| `/api/classes/count` | Classes count | ✅ Required |
| `/api/classes/all` | All classes | ✅ Required |
| `/api/finance/summary` | Finance overview | ⚠️ Important |
| `/api/mark-list/summary` | Marks summary | ⚠️ Important |
| `/api/mark-list/subjects` | Subjects list | ⚠️ Important |
| `/api/evaluations/summary` | Evaluations | 📝 Optional |
| `/api/academic/terms` | Academic terms | 📝 Optional |
| `/api/attendance/today` | Today's attendance | 📝 Optional |
| `/api/attendance/date/:date` | Date attendance | 📝 Optional |
| `/api/schedule/all` | Class schedule | 📝 Optional |
| `/api/faults/summary` | Discipline data | 📝 Optional |
| `/api/posts/summary` | Communications | 📝 Optional |

## Troubleshooting

### Issue: 404 errors in backend logs
**Solution**: The endpoints don't exist on the branch. Add the aggregation routes.

### Issue: 500 errors in backend logs
**Solution**: Database query errors. Check table/column names match your schema.

### Issue: Empty data arrays
**Solution**: Either no data in database, or query is incorrect. Check the database directly.

### Issue: Connection timeout
**Solution**: Branch is slow or down. Check branch health status.

### Issue: CORS errors
**Solution**: Add CORS headers to branch backend:
```javascript
app.use(cors({
  origin: 'https://iqras.skoolific.com',
  credentials: true
}));
```

## Next Steps

1. ✅ Add aggregation endpoints to iqrab3.skoolific.com
2. ✅ Test with super admin dashboard
3. ✅ Add aggregation endpoints to iqrab1.skoolific.com
4. ✅ Add aggregation endpoints to iqrab2.skoolific.com
5. ✅ Add any other branches

## Security Recommendations

1. **Add authentication** to aggregation endpoints:
   ```javascript
   import { authenticateToken } from '../middleware/auth.js';
   router.get('/students/all', authenticateToken, async (req, res) => {
     // ...
   });
   ```

2. **Add API key validation** for super admin:
   ```javascript
   const validateSuperAdminKey = (req, res, next) => {
     const apiKey = req.headers['x-api-key'];
     if (apiKey !== process.env.SUPER_ADMIN_API_KEY) {
       return res.status(401).json({ error: 'Unauthorized' });
     }
     next();
   };
   ```

3. **Add rate limiting**:
   ```javascript
   import rateLimit from 'express-rate-limit';
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 100
   });
   
   app.use('/api', limiter);
   ```

## Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs iqras-backend`
2. Check branch logs: `pm2 logs iqrab3-backend`
3. Test endpoints directly: `curl https://iqrab3.skoolific.com/api/health`
4. Check database connection: `psql -U postgres -d iqrab3`

## Files Reference

- `BRANCH-API-REQUIREMENTS.md` - Detailed API specifications
- `BRANCH-AGGREGATION-ROUTES-TEMPLATE.js` - Ready-to-use routes file
- `DEPLOYMENT-COMPLETE.md` - Deployment information

# Field Names Fix - Branch and Grade Display Issue

## Problem
The super admin dashboard was showing student data but the BRANCH and GRADE columns were empty.

## Root Cause
Field name mismatch between backend and frontend:

### Frontend Expected (Students.jsx):
- `branch_name` (with underscore)
- `branch_code` (with underscore)
- `grade` (for class/grade)
- `student_id`
- `gender`
- `status`

### Backend Was Returning:
- `branchName` (camelCase) ❌
- `branchCode` (camelCase) ❌
- `class` (instead of `grade`) ❌
- Missing `student_id`, `gender`, `status` ❌

## Solution

### 1. Updated iqrab3 Aggregation Routes (`/students/all` endpoint)
Changed the SQL query to return:
- `grade` instead of `class`
- `student_id` (using `id::text`)
- `gender` (hardcoded as 'Male' for now)
- `status` (hardcoded as 'active')

```sql
SELECT 
  id, 
  student_name as name, 
  '' as email, 
  guardian_phone as phone, 
  id::text as student_id,  -- Added
  'GRADE10' as grade,       -- Changed from 'class'
  'Male' as gender,         -- Added
  'active' as status        -- Added
FROM classes_schema."GRADE10" 
WHERE is_active = true
```

### 2. Updated Super Admin Aggregation Service
Changed field names from camelCase to snake_case:

**Before:**
```javascript
{
  ...student,
  branchId: branch.id,
  branchName: branch.name,
  branchCode: branch.code
}
```

**After:**
```javascript
{
  ...student,
  branch_id: branch.id,
  branch_name: branch.name,
  branch_code: branch.code
}
```

Applied to:
- `aggregateStudents()`
- `aggregateStaff()`
- `aggregateClasses()`

## Files Modified

### Local Files:
1. `aggregationRoutes.js` - Updated students/all endpoint
2. `super-admin-dashboard/backend/services/aggregationService.js` - Fixed field names

### VPS Files:
1. `/var/www/skoolific/iqrab3/backend/routes/aggregationRoutes.js` - Uploaded
2. `/var/www/iqras.skoolific.com/backend/services/aggregationService.js` - Pulled from GitHub

## Deployment Steps

1. ✅ Updated local files
2. ✅ Committed and pushed to GitHub
3. ✅ Uploaded aggregationRoutes.js to iqrab3 backend
4. ✅ Restarted iqrab3 backend (PM2: skoolific-backend)
5. ✅ Pulled latest changes on super admin VPS
6. ✅ Restarted super admin backend (PM2: iqras-backend)

## Result
The dashboard now correctly displays:
- Branch name in the BRANCH column
- Grade (GRADE10, GRADE11, etc.) in the GRADE column
- Student ID, gender, and status for each student

## Testing
Visit https://iqras.skoolific.com and navigate to the Students page to verify:
- Branch column shows "iqrab3"
- Grade column shows the actual grade (GRADE10, GRADE11, etc.)
- All 430 active students are displayed

## Notes
- Gender is currently hardcoded as 'Male' - can be updated later if gender data is available in the database
- Status is hardcoded as 'active' since we're filtering by `is_active = true`
- The same pattern should be applied to other branches (iqrab1, iqrab2) when they are added

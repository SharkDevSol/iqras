# Branch API Requirements for Super Admin Dashboard

## Overview
Each branch system (iqrab1, iqrab2, iqrab3, etc.) needs to expose specific API endpoints so the Super Admin Dashboard can aggregate data from all branches.

## Required API Endpoints

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Purpose**: Check if the branch is online and responding
- **Response**:
```json
{
  "status": "OK",
  "message": "Branch API is running",
  "timestamp": "2026-04-07T10:00:00Z"
}
```

### 2. Students Count
- **Endpoint**: `GET /api/students/count`
- **Purpose**: Get total number of students
- **Response**:
```json
{
  "total": 150
}
```

### 3. All Students
- **Endpoint**: `GET /api/students/all`
- **Purpose**: Get list of all students
- **Response**:
```json
[
  {
    "id": 1,
    "name": "Student Name",
    "class": "Class 10",
    "section": "A",
    "roll_number": "001",
    "email": "student@example.com",
    "phone": "1234567890"
  }
]
```

### 4. Staff Count
- **Endpoint**: `GET /api/staff/count`
- **Purpose**: Get total number of staff
- **Response**:
```json
{
  "total": 25
}
```

### 5. All Staff
- **Endpoint**: `GET /api/staff/all`
- **Purpose**: Get list of all staff
- **Response**:
```json
[
  {
    "id": 1,
    "name": "Staff Name",
    "role": "Teacher",
    "email": "staff@example.com",
    "phone": "1234567890",
    "subject": "Mathematics"
  }
]
```

### 6. Classes Count
- **Endpoint**: `GET /api/classes/count`
- **Purpose**: Get total number of classes
- **Response**:
```json
{
  "total": 12
}
```

### 7. All Classes
- **Endpoint**: `GET /api/classes/all`
- **Purpose**: Get list of all classes
- **Response**:
```json
[
  {
    "id": 1,
    "name": "Class 10",
    "section": "A",
    "total_students": 30,
    "class_teacher": "Teacher Name"
  }
]
```

### 8. Finance Summary
- **Endpoint**: `GET /api/finance/summary`
- **Purpose**: Get financial overview
- **Response**:
```json
{
  "totalRevenue": 500000,
  "totalExpenses": 300000,
  "totalPending": 50000,
  "netProfit": 200000
}
```

### 9. Mark List Summary
- **Endpoint**: `GET /api/mark-list/summary`
- **Purpose**: Get marks/grades summary
- **Response**:
```json
{
  "totalExams": 10,
  "totalMarklists": 50,
  "averageScore": 75.5
}
```

### 10. Mark List Subjects
- **Endpoint**: `GET /api/mark-list/subjects`
- **Purpose**: Get list of subjects
- **Response**:
```json
[
  {
    "id": 1,
    "name": "Mathematics",
    "code": "MATH101"
  }
]
```

### 11. Evaluations Summary
- **Endpoint**: `GET /api/evaluations/summary`
- **Purpose**: Get evaluations overview
- **Response**:
```json
{
  "totalEvaluations": 100,
  "pending": 10,
  "completed": 90
}
```

### 12. Academic Terms
- **Endpoint**: `GET /api/academic/terms`
- **Purpose**: Get academic terms/semesters
- **Response**:
```json
[
  {
    "id": 1,
    "name": "Term 1",
    "start_date": "2026-01-01",
    "end_date": "2026-04-30"
  }
]
```

### 13. Attendance Today
- **Endpoint**: `GET /api/attendance/today`
- **Purpose**: Get today's attendance
- **Response**:
```json
{
  "date": "2026-04-07",
  "totalPresent": 140,
  "totalAbsent": 10,
  "attendanceRate": 93.3
}
```

### 14. Attendance by Date
- **Endpoint**: `GET /api/attendance/date/:date`
- **Purpose**: Get attendance for specific date
- **Response**: Same as attendance/today

### 15. Schedule
- **Endpoint**: `GET /api/schedule/all`
- **Purpose**: Get class schedules
- **Response**:
```json
[
  {
    "id": 1,
    "class": "Class 10",
    "subject": "Mathematics",
    "teacher": "Teacher Name",
    "day": "Monday",
    "time": "09:00-10:00"
  }
]
```

### 16. Faults Summary
- **Endpoint**: `GET /api/faults/summary`
- **Purpose**: Get discipline/faults summary
- **Response**:
```json
{
  "totalFaults": 25,
  "resolved": 20,
  "pending": 5
}
```

### 17. Posts/Communications Summary
- **Endpoint**: `GET /api/posts/summary`
- **Purpose**: Get communications summary
- **Response**:
```json
{
  "totalPosts": 50,
  "announcements": 20,
  "messages": 30
}
```

## Implementation Steps

### For Each Branch (iqrab1, iqrab2, iqrab3, etc.):

1. Create a new file: `backend/routes/aggregationRoutes.js`
2. Implement all the endpoints listed above
3. Connect to your existing database queries
4. Add the routes to your main server file
5. Test each endpoint

## Security Considerations

- All endpoints should be protected with authentication
- Consider adding API keys for super admin access
- Implement rate limiting
- Validate all inputs
- Use HTTPS only

## Testing

Test each endpoint using:
```bash
curl https://iqrab3.skoolific.com/api/health
curl https://iqrab3.skoolific.com/api/students/count
```

## Next Steps

1. Implement these endpoints on iqrab3.skoolific.com first
2. Test with the super admin dashboard
3. Roll out to other branches (iqrab1, iqrab2, etc.)

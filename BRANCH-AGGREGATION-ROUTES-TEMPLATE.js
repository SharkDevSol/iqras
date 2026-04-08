// aggregationRoutes.js
// Add this file to your branch backend (e.g., iqrab3/backend/routes/aggregationRoutes.js)
// Then import and use in your server.js: app.use('/api', aggregationRoutes);

import express from 'express';
import pool from '../config/database.js'; // Adjust path to your database config

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Branch API is running',
    timestamp: new Date().toISOString()
  });
});

// Students count
router.get('/students/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as total FROM students');
    res.json({ total: parseInt(result.rows[0].total) });
  } catch (error) {
    console.error('Error getting students count:', error);
    res.status(500).json({ error: 'Failed to get students count' });
  }
});

// All students
router.get('/students/all', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.id,
        s.name,
        s.email,
        s.phone,
        s.roll_number,
        c.name as class,
        c.section
      FROM students s
      LEFT JOIN classes c ON s.class_id = c.id
      ORDER BY s.name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting all students:', error);
    res.status(500).json({ error: 'Failed to get students' });
  }
});

// Staff count
router.get('/staff/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as total FROM staff');
    res.json({ total: parseInt(result.rows[0].total) });
  } catch (error) {
    console.error('Error getting staff count:', error);
    res.status(500).json({ error: 'Failed to get staff count' });
  }
});

// All staff
router.get('/staff/all', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        name,
        email,
        phone,
        role,
        subject
      FROM staff
      ORDER BY name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting all staff:', error);
    res.status(500).json({ error: 'Failed to get staff' });
  }
});

// Classes count
router.get('/classes/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as total FROM classes');
    res.json({ total: parseInt(result.rows[0].total) });
  } catch (error) {
    console.error('Error getting classes count:', error);
    res.status(500).json({ error: 'Failed to get classes count' });
  }
});

// All classes
router.get('/classes/all', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id,
        c.name,
        c.section,
        COUNT(s.id) as total_students,
        st.name as class_teacher
      FROM classes c
      LEFT JOIN students s ON s.class_id = c.id
      LEFT JOIN staff st ON c.class_teacher_id = st.id
      GROUP BY c.id, c.name, c.section, st.name
      ORDER BY c.name, c.section
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting all classes:', error);
    res.status(500).json({ error: 'Failed to get classes' });
  }
});

// Finance summary
router.get('/finance/summary', async (req, res) => {
  try {
    const revenueResult = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) as total 
      FROM invoices 
      WHERE status = 'paid'
    `);
    
    const expensesResult = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) as total 
      FROM expenses
    `);
    
    const pendingResult = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) as total 
      FROM invoices 
      WHERE status = 'pending'
    `);

    const totalRevenue = parseFloat(revenueResult.rows[0].total);
    const totalExpenses = parseFloat(expensesResult.rows[0].total);
    const totalPending = parseFloat(pendingResult.rows[0].total);

    res.json({
      totalRevenue,
      totalExpenses,
      totalPending,
      netProfit: totalRevenue - totalExpenses
    });
  } catch (error) {
    console.error('Error getting finance summary:', error);
    res.status(500).json({ error: 'Failed to get finance summary' });
  }
});

// Mark list summary
router.get('/mark-list/summary', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(DISTINCT exam_id) as total_exams,
        COUNT(*) as total_marklists,
        AVG(marks_obtained) as average_score
      FROM mark_lists
    `);
    
    res.json({
      totalExams: parseInt(result.rows[0].total_exams || 0),
      totalMarklists: parseInt(result.rows[0].total_marklists || 0),
      averageScore: parseFloat(result.rows[0].average_score || 0).toFixed(2)
    });
  } catch (error) {
    console.error('Error getting mark list summary:', error);
    res.status(500).json({ error: 'Failed to get mark list summary' });
  }
});

// Mark list subjects
router.get('/mark-list/subjects', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT
        s.id,
        s.name,
        s.code
      FROM subjects s
      ORDER BY s.name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting subjects:', error);
    res.status(500).json({ error: 'Failed to get subjects' });
  }
});

// Evaluations summary
router.get('/evaluations/summary', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_evaluations,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
      FROM evaluations
    `);
    
    res.json({
      totalEvaluations: parseInt(result.rows[0].total_evaluations || 0),
      pending: parseInt(result.rows[0].pending || 0),
      completed: parseInt(result.rows[0].completed || 0)
    });
  } catch (error) {
    console.error('Error getting evaluations summary:', error);
    res.status(500).json({ error: 'Failed to get evaluations summary' });
  }
});

// Academic terms
router.get('/academic/terms', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        name,
        start_date,
        end_date
      FROM academic_terms
      ORDER BY start_date DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting academic terms:', error);
    res.status(500).json({ error: 'Failed to get academic terms' });
  }
});

// Attendance today
router.get('/attendance/today', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'present' THEN 1 END) as present,
        COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent
      FROM attendance
      WHERE date = $1
    `, [today]);
    
    const total = parseInt(result.rows[0].total || 0);
    const present = parseInt(result.rows[0].present || 0);
    const absent = parseInt(result.rows[0].absent || 0);
    
    res.json({
      date: today,
      totalPresent: present,
      totalAbsent: absent,
      attendanceRate: total > 0 ? ((present / total) * 100).toFixed(2) : 0
    });
  } catch (error) {
    console.error('Error getting today attendance:', error);
    res.status(500).json({ error: 'Failed to get attendance' });
  }
});

// Attendance by date
router.get('/attendance/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'present' THEN 1 END) as present,
        COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent
      FROM attendance
      WHERE date = $1
    `, [date]);
    
    const total = parseInt(result.rows[0].total || 0);
    const present = parseInt(result.rows[0].present || 0);
    const absent = parseInt(result.rows[0].absent || 0);
    
    res.json({
      date,
      totalPresent: present,
      totalAbsent: absent,
      attendanceRate: total > 0 ? ((present / total) * 100).toFixed(2) : 0
    });
  } catch (error) {
    console.error('Error getting attendance by date:', error);
    res.status(500).json({ error: 'Failed to get attendance' });
  }
});

// Schedule
router.get('/schedule/all', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        sc.id,
        c.name as class,
        c.section,
        s.name as subject,
        st.name as teacher,
        sc.day,
        sc.start_time,
        sc.end_time
      FROM schedule sc
      LEFT JOIN classes c ON sc.class_id = c.id
      LEFT JOIN subjects s ON sc.subject_id = s.id
      LEFT JOIN staff st ON sc.teacher_id = st.id
      ORDER BY sc.day, sc.start_time
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting schedule:', error);
    res.status(500).json({ error: 'Failed to get schedule' });
  }
});

// Faults summary
router.get('/faults/summary', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_faults,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending
      FROM faults
    `);
    
    res.json({
      totalFaults: parseInt(result.rows[0].total_faults || 0),
      resolved: parseInt(result.rows[0].resolved || 0),
      pending: parseInt(result.rows[0].pending || 0)
    });
  } catch (error) {
    console.error('Error getting faults summary:', error);
    res.status(500).json({ error: 'Failed to get faults summary' });
  }
});

// Posts/Communications summary
router.get('/posts/summary', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_posts,
        COUNT(CASE WHEN type = 'announcement' THEN 1 END) as announcements,
        COUNT(CASE WHEN type = 'message' THEN 1 END) as messages
      FROM posts
    `);
    
    res.json({
      totalPosts: parseInt(result.rows[0].total_posts || 0),
      announcements: parseInt(result.rows[0].announcements || 0),
      messages: parseInt(result.rows[0].messages || 0)
    });
  } catch (error) {
    console.error('Error getting posts summary:', error);
    res.status(500).json({ error: 'Failed to get posts summary' });
  }
});

export default router;

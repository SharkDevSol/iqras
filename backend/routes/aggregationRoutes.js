import express from 'express';
import aggregationService from '../services/aggregationService.js';

const router = express.Router();

// Get dashboard overview (all branches summary)
router.get('/overview', async (req, res) => {
  try {
    const overview = await aggregationService.aggregateOverview();
    res.json(overview);
  } catch (error) {
    console.error('Error fetching overview:', error);
    res.status(500).json({ error: 'Failed to fetch overview data' });
  }
});

// Get all students from all branches
router.get('/students', async (req, res) => {
  try {
    const students = await aggregationService.aggregateStudents();
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get all staff from all branches
router.get('/staff', async (req, res) => {
  try {
    const staff = await aggregationService.aggregateStaff();
    res.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

// Get attendance from all branches
router.get('/attendance', async (req, res) => {
  try {
    const { date } = req.query;
    const attendance = await aggregationService.aggregateAttendance(date);
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

// Get finance data from all branches
router.get('/finance', async (req, res) => {
  try {
    const finance = await aggregationService.aggregateFinance();
    res.json(finance);
  } catch (error) {
    console.error('Error fetching finance:', error);
    res.status(500).json({ error: 'Failed to fetch finance data' });
  }
});

// Get academic data from all branches
router.get('/academics', async (req, res) => {
  try {
    const academics = await aggregationService.aggregateAcademics();
    res.json(academics);
  } catch (error) {
    console.error('Error fetching academics:', error);
    res.status(500).json({ error: 'Failed to fetch academic data' });
  }
});

// Get all classes from all branches
router.get('/classes', async (req, res) => {
  try {
    const classes = await aggregationService.aggregateClasses();
    res.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

// Get all marklists from all branches
router.get('/marklists', async (req, res) => {
  try {
    const marklists = await aggregationService.aggregateMarklists();
    res.json(marklists);
  } catch (error) {
    console.error('Error fetching marklists:', error);
    res.status(500).json({ error: 'Failed to fetch marklists' });
  }
});

// Get schedule from all branches
router.get('/schedule', async (req, res) => {
  try {
    const schedule = await aggregationService.aggregateSchedule();
    res.json(schedule);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});

// Get faults from all branches
router.get('/faults', async (req, res) => {
  try {
    const faults = await aggregationService.aggregateFaults();
    res.json(faults);
  } catch (error) {
    console.error('Error fetching faults:', error);
    res.status(500).json({ error: 'Failed to fetch faults' });
  }
});

// Get communications from all branches
router.get('/communications', async (req, res) => {
  try {
    const communications = await aggregationService.aggregateCommunications();
    res.json(communications);
  } catch (error) {
    console.error('Error fetching communications:', error);
    res.status(500).json({ error: 'Failed to fetch communications' });
  }
});

// Get branch comparison data
router.get('/comparison', async (req, res) => {
  try {
    const comparison = await aggregationService.getBranchComparison();
    res.json(comparison);
  } catch (error) {
    console.error('Error fetching comparison:', error);
    res.status(500).json({ error: 'Failed to fetch comparison data' });
  }
});

export default router;

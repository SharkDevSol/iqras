import express from 'express';
import { query } from '../config/database.js';
import branchService from '../services/branchService.js';

const router = express.Router();

// Get all branches
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM branches ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).json({ error: 'Failed to fetch branches' });
  }
});

// Get single branch
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM branches WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Branch not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching branch:', error);
    res.status(500).json({ error: 'Failed to fetch branch' });
  }
});

// Add new branch
router.post('/', async (req, res) => {
  try {
    const {
      name,
      code,
      base_url,
      api_key,
      location,
      contact_email,
      contact_phone,
      principal_name
    } = req.body;

    // Validate required fields
    if (!name || !code || !base_url) {
      return res.status(400).json({ error: 'Name, code, and base URL are required' });
    }

    // Test connection before adding
    const connectionTest = await branchService.testBranchConnection(base_url, api_key);
    
    if (!connectionTest.success) {
      return res.status(400).json({ 
        error: 'Cannot connect to branch', 
        message: connectionTest.message 
      });
    }

    // Insert branch
    const result = await query(
      `INSERT INTO branches 
       (name, code, base_url, api_key, location, contact_email, contact_phone, principal_name, health_status, response_time_ms, last_health_check)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
       RETURNING *`,
      [name, code, base_url, api_key, location, contact_email, contact_phone, principal_name, connectionTest.status, connectionTest.responseTime]
    );

    res.status(201).json({
      message: 'Branch added successfully',
      branch: result.rows[0]
    });
  } catch (error) {
    console.error('Error adding branch:', error);
    
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({ error: 'Branch code already exists' });
    }
    
    res.status(500).json({ error: 'Failed to add branch' });
  }
});

// Update branch
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      code,
      base_url,
      api_key,
      status,
      location,
      contact_email,
      contact_phone,
      principal_name
    } = req.body;

    // Check if branch exists
    const checkResult = await query('SELECT * FROM branches WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    // If URL changed, test new connection
    if (base_url && base_url !== checkResult.rows[0].base_url) {
      const connectionTest = await branchService.testBranchConnection(base_url, api_key);
      if (!connectionTest.success) {
        return res.status(400).json({ 
          error: 'Cannot connect to new branch URL', 
          message: connectionTest.message 
        });
      }
    }

    // Update branch
    const result = await query(
      `UPDATE branches 
       SET name = COALESCE($1, name),
           code = COALESCE($2, code),
           base_url = COALESCE($3, base_url),
           api_key = COALESCE($4, api_key),
           status = COALESCE($5, status),
           location = COALESCE($6, location),
           contact_email = COALESCE($7, contact_email),
           contact_phone = COALESCE($8, contact_phone),
           principal_name = COALESCE($9, principal_name),
           updated_at = NOW()
       WHERE id = $10
       RETURNING *`,
      [name, code, base_url, api_key, status, location, contact_email, contact_phone, principal_name, id]
    );

    res.json({
      message: 'Branch updated successfully',
      branch: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating branch:', error);
    
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Branch code already exists' });
    }
    
    res.status(500).json({ error: 'Failed to update branch' });
  }
});

// Delete branch
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query('DELETE FROM branches WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Branch not found' });
    }
    
    res.json({ message: 'Branch deleted successfully' });
  } catch (error) {
    console.error('Error deleting branch:', error);
    res.status(500).json({ error: 'Failed to delete branch' });
  }
});

// Test branch connection
router.post('/:id/test', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query('SELECT base_url, api_key FROM branches WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Branch not found' });
    }
    
    const branch = result.rows[0];
    const connectionTest = await branchService.testBranchConnection(branch.base_url, branch.api_key);
    
    res.json(connectionTest);
  } catch (error) {
    console.error('Error testing branch connection:', error);
    res.status(500).json({ error: 'Failed to test connection' });
  }
});

// Get branch health status
router.get('/:id/health', async (req, res) => {
  try {
    const { id } = req.params;
    const healthCheck = await branchService.checkBranchHealth(id);
    res.json(healthCheck);
  } catch (error) {
    console.error('Error checking branch health:', error);
    res.status(500).json({ error: 'Failed to check branch health' });
  }
});

// Get branch health logs
router.get('/:id/health-logs', async (req, res) => {
  try {
    const { id } = req.params;
    const limit = req.query.limit || 50;
    
    const result = await query(
      `SELECT * FROM branch_health_logs 
       WHERE branch_id = $1 
       ORDER BY checked_at DESC 
       LIMIT $2`,
      [id, limit]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching health logs:', error);
    res.status(500).json({ error: 'Failed to fetch health logs' });
  }
});

export default router;

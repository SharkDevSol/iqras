import axios from 'axios';
import { query } from '../config/database.js';

class BranchService {
  constructor() {
    this.timeout = 10000; // 10 seconds timeout
  }

  // Create axios instance for a branch
  createBranchClient(branchUrl, apiKey = null) {
    const headers = {};
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    return axios.create({
      baseURL: branchUrl,
      timeout: this.timeout,
      headers
    });
  }

  // Test branch connection
  async testBranchConnection(branchUrl, apiKey = null) {
    try {
      const client = this.createBranchClient(branchUrl, apiKey);
      const startTime = Date.now();
      const response = await client.get('/api/health');
      const responseTime = Date.now() - startTime;

      return {
        success: true,
        status: 'healthy',
        responseTime,
        message: 'Branch is reachable'
      };
    } catch (error) {
      return {
        success: false,
        status: 'error',
        responseTime: null,
        message: error.message || 'Branch is not reachable'
      };
    }
  }

  // Fetch dashboard overview from a branch
  async fetchBranchOverview(branchUrl, apiKey = null) {
    try {
      const client = this.createBranchClient(branchUrl, apiKey);
      
      // Fetch multiple endpoints in parallel
      const [studentsRes, staffRes, classesRes, financeRes] = await Promise.allSettled([
        client.get('/api/students/count'),
        client.get('/api/staff/count'),
        client.get('/api/classes/count'),
        client.get('/api/finance/summary')
      ]);

      return {
        students: studentsRes.status === 'fulfilled' ? studentsRes.value.data : { total: 0 },
        staff: staffRes.status === 'fulfilled' ? staffRes.value.data : { total: 0 },
        classes: classesRes.status === 'fulfilled' ? classesRes.value.data : { total: 0 },
        finance: financeRes.status === 'fulfilled' ? financeRes.value.data : {}
      };
    } catch (error) {
      console.error(`Error fetching overview from ${branchUrl}:`, error.message);
      return null;
    }
  }

  // Fetch all students from a branch
  async fetchBranchStudents(branchUrl, apiKey = null) {
    try {
      const client = this.createBranchClient(branchUrl, apiKey);
      const response = await client.get('/api/students/all');
      return response.data;
    } catch (error) {
      console.error(`Error fetching students from ${branchUrl}:`, error.message);
      return [];
    }
  }

  // Fetch all staff from a branch
  async fetchBranchStaff(branchUrl, apiKey = null) {
    try {
      const client = this.createBranchClient(branchUrl, apiKey);
      const response = await client.get('/api/staff/all');
      return response.data;
    } catch (error) {
      console.error(`Error fetching staff from ${branchUrl}:`, error.message);
      return [];
    }
  }

  // Fetch attendance data from a branch
  async fetchBranchAttendance(branchUrl, date = null, apiKey = null) {
    try {
      const client = this.createBranchClient(branchUrl, apiKey);
      const endpoint = date ? `/api/attendance/date/${date}` : '/api/attendance/today';
      const response = await client.get(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error fetching attendance from ${branchUrl}:`, error.message);
      return [];
    }
  }

  // Fetch finance data from a branch
  async fetchBranchFinance(branchUrl, apiKey = null) {
    try {
      const client = this.createBranchClient(branchUrl, apiKey);
      const response = await client.get('/api/finance/summary');
      return response.data;
    } catch (error) {
      console.error(`Error fetching finance from ${branchUrl}:`, error.message);
      return null;
    }
  }

  // Fetch academic data (marks, evaluations, etc.)
  async fetchBranchAcademics(branchUrl, apiKey = null) {
    try {
      const client = this.createBranchClient(branchUrl, apiKey);
      
      const [marksRes, evaluationsRes, subjectsRes, termsRes] = await Promise.allSettled([
        client.get('/api/mark-list/summary'),
        client.get('/api/evaluations/summary'),
        client.get('/api/mark-list/subjects'),
        client.get('/api/academic/terms')
      ]);

      return {
        marks: marksRes.status === 'fulfilled' ? marksRes.value.data : [],
        evaluations: evaluationsRes.status === 'fulfilled' ? evaluationsRes.value.data : [],
        subjects: subjectsRes.status === 'fulfilled' ? subjectsRes.value.data : [],
        terms: termsRes.status === 'fulfilled' ? termsRes.value.data : []
      };
    } catch (error) {
      console.error(`Error fetching academics from ${branchUrl}:`, error.message);
      return null;
    }
  }

  // Fetch class data from a branch
  async fetchBranchClasses(branchUrl, apiKey = null) {
    try {
      const client = this.createBranchClient(branchUrl, apiKey);
      const response = await client.get('/api/classes/all');
      return response.data;
    } catch (error) {
      console.error(`Error fetching classes from ${branchUrl}:`, error.message);
      return [];
    }
  }

  // Fetch schedule data from a branch
  async fetchBranchSchedule(branchUrl, apiKey = null) {
    try {
      const client = this.createBranchClient(branchUrl, apiKey);
      const response = await client.get('/api/schedule/all');
      return response.data;
    } catch (error) {
      console.error(`Error fetching schedule from ${branchUrl}:`, error.message);
      return [];
    }
  }

  // Fetch faults/discipline data from a branch
  async fetchBranchFaults(branchUrl, apiKey = null) {
    try {
      const client = this.createBranchClient(branchUrl, apiKey);
      const response = await client.get('/api/faults/summary');
      return response.data;
    } catch (error) {
      console.error(`Error fetching faults from ${branchUrl}:`, error.message);
      return [];
    }
  }

  // Fetch communication/posts data from a branch
  async fetchBranchCommunications(branchUrl, apiKey = null) {
    try {
      const client = this.createBranchClient(branchUrl, apiKey);
      const response = await client.get('/api/posts/summary');
      return response.data;
    } catch (error) {
      console.error(`Error fetching communications from ${branchUrl}:`, error.message);
      return [];
    }
  }

  // Health check for a branch
  async checkBranchHealth(branchId) {
    try {
      const branchResult = await query(
        'SELECT id, base_url, api_key FROM branches WHERE id = $1',
        [branchId]
      );

      if (branchResult.rows.length === 0) {
        throw new Error('Branch not found');
      }

      const branch = branchResult.rows[0];
      const healthCheck = await this.testBranchConnection(branch.base_url, branch.api_key);

      // Update branch health status
      await query(
        `UPDATE branches 
         SET last_health_check = NOW(), 
             health_status = $1, 
             response_time_ms = $2,
             updated_at = NOW()
         WHERE id = $3`,
        [healthCheck.status, healthCheck.responseTime, branchId]
      );

      // Log health check
      await query(
        `INSERT INTO branch_health_logs (branch_id, status, response_time_ms, error_message)
         VALUES ($1, $2, $3, $4)`,
        [branchId, healthCheck.status, healthCheck.responseTime, healthCheck.message]
      );

      return healthCheck;
    } catch (error) {
      console.error(`Error checking health for branch ${branchId}:`, error.message);
      throw error;
    }
  }

  // Check health for all branches
  async checkAllBranchesHealth() {
    try {
      const branchesResult = await query('SELECT id FROM branches WHERE status = $1', ['active']);
      const branches = branchesResult.rows;

      const healthChecks = await Promise.allSettled(
        branches.map(branch => this.checkBranchHealth(branch.id))
      );

      return healthChecks.map((result, index) => ({
        branchId: branches[index].id,
        success: result.status === 'fulfilled',
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason.message : null
      }));
    } catch (error) {
      console.error('Error checking all branches health:', error.message);
      throw error;
    }
  }
}

export default new BranchService();

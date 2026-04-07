import { query } from '../config/database.js';
import branchService from './branchService.js';

class AggregationService {
  // Get all active branches
  async getActiveBranches() {
    const result = await query(
      'SELECT * FROM branches WHERE status = $1 ORDER BY name',
      ['active']
    );
    return result.rows;
  }

  // Aggregate overview data from all branches
  async aggregateOverview() {
    try {
      const branches = await this.getActiveBranches();
      
      const overviewPromises = branches.map(async (branch) => {
        try {
          const overview = await branchService.fetchBranchOverview(branch.base_url, branch.api_key);
          return {
            branchId: branch.id,
            branchName: branch.name,
            branchCode: branch.code,
            data: overview
          };
        } catch (error) {
          return {
            branchId: branch.id,
            branchName: branch.name,
            branchCode: branch.code,
            data: null,
            error: error.message
          };
        }
      });

      const results = await Promise.allSettled(overviewPromises);
      
      const branchData = results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);

      // Calculate totals
      const totals = {
        totalStudents: 0,
        totalStaff: 0,
        totalClasses: 0,
        totalRevenue: 0,
        totalExpenses: 0,
        branches: branchData.length
      };

      branchData.forEach(branch => {
        if (branch.data) {
          totals.totalStudents += branch.data.students?.total || 0;
          totals.totalStaff += branch.data.staff?.total || 0;
          totals.totalClasses += branch.data.classes?.total || 0;
          totals.totalRevenue += branch.data.finance?.totalRevenue || 0;
          totals.totalExpenses += branch.data.finance?.totalExpenses || 0;
        }
      });

      return {
        totals,
        branches: branchData
      };
    } catch (error) {
      console.error('Error aggregating overview:', error);
      throw error;
    }
  }

  // Aggregate all students from all branches
  async aggregateStudents() {
    try {
      const branches = await this.getActiveBranches();
      
      const studentPromises = branches.map(async (branch) => {
        const students = await branchService.fetchBranchStudents(branch.base_url, branch.api_key);
        return students.map(student => ({
          ...student,
          branchId: branch.id,
          branchName: branch.name,
          branchCode: branch.code
        }));
      });

      const results = await Promise.allSettled(studentPromises);
      const allStudents = results
        .filter(r => r.status === 'fulfilled')
        .flatMap(r => r.value);

      return allStudents;
    } catch (error) {
      console.error('Error aggregating students:', error);
      throw error;
    }
  }

  // Aggregate all staff from all branches
  async aggregateStaff() {
    try {
      const branches = await this.getActiveBranches();
      
      const staffPromises = branches.map(async (branch) => {
        const staff = await branchService.fetchBranchStaff(branch.base_url, branch.api_key);
        return staff.map(member => ({
          ...member,
          branchId: branch.id,
          branchName: branch.name,
          branchCode: branch.code
        }));
      });

      const results = await Promise.allSettled(staffPromises);
      const allStaff = results
        .filter(r => r.status === 'fulfilled')
        .flatMap(r => r.value);

      return allStaff;
    } catch (error) {
      console.error('Error aggregating staff:', error);
      throw error;
    }
  }

  // Aggregate attendance data from all branches
  async aggregateAttendance(date = null) {
    try {
      const branches = await this.getActiveBranches();
      
      const attendancePromises = branches.map(async (branch) => {
        const attendance = await branchService.fetchBranchAttendance(branch.base_url, date, branch.api_key);
        return {
          branchId: branch.id,
          branchName: branch.name,
          branchCode: branch.code,
          data: attendance
        };
      });

      const results = await Promise.allSettled(attendancePromises);
      return results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);
    } catch (error) {
      console.error('Error aggregating attendance:', error);
      throw error;
    }
  }

  // Aggregate finance data from all branches
  async aggregateFinance() {
    try {
      const branches = await this.getActiveBranches();
      
      const financePromises = branches.map(async (branch) => {
        const finance = await branchService.fetchBranchFinance(branch.base_url, branch.api_key);
        return {
          branchId: branch.id,
          branchName: branch.name,
          branchCode: branch.code,
          data: finance
        };
      });

      const results = await Promise.allSettled(financePromises);
      const branchFinance = results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);

      // Calculate totals
      const totals = {
        totalRevenue: 0,
        totalExpenses: 0,
        totalPending: 0,
        netProfit: 0
      };

      branchFinance.forEach(branch => {
        if (branch.data) {
          totals.totalRevenue += branch.data.totalRevenue || 0;
          totals.totalExpenses += branch.data.totalExpenses || 0;
          totals.totalPending += branch.data.totalPending || 0;
        }
      });

      totals.netProfit = totals.totalRevenue - totals.totalExpenses;

      return {
        totals,
        branches: branchFinance
      };
    } catch (error) {
      console.error('Error aggregating finance:', error);
      throw error;
    }
  }

  // Aggregate academic data from all branches
  async aggregateAcademics() {
    try {
      const branches = await this.getActiveBranches();
      
      const academicPromises = branches.map(async (branch) => {
        const academics = await branchService.fetchBranchAcademics(branch.base_url, branch.api_key);
        return {
          branchId: branch.id,
          branchName: branch.name,
          branchCode: branch.code,
          data: academics
        };
      });

      const results = await Promise.allSettled(academicPromises);
      return results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);
    } catch (error) {
      console.error('Error aggregating academics:', error);
      throw error;
    }
  }

  // Aggregate classes from all branches
  async aggregateClasses() {
    try {
      const branches = await this.getActiveBranches();
      
      const classPromises = branches.map(async (branch) => {
        const classes = await branchService.fetchBranchClasses(branch.base_url, branch.api_key);
        return classes.map(cls => ({
          ...cls,
          branchId: branch.id,
          branchName: branch.name,
          branchCode: branch.code
        }));
      });

      const results = await Promise.allSettled(classPromises);
      return results
        .filter(r => r.status === 'fulfilled')
        .flatMap(r => r.value);
    } catch (error) {
      console.error('Error aggregating classes:', error);
      throw error;
    }
  }

  // Aggregate schedule from all branches
  async aggregateSchedule() {
    try {
      const branches = await this.getActiveBranches();
      
      const schedulePromises = branches.map(async (branch) => {
        const schedule = await branchService.fetchBranchSchedule(branch.base_url, branch.api_key);
        return {
          branchId: branch.id,
          branchName: branch.name,
          branchCode: branch.code,
          data: schedule
        };
      });

      const results = await Promise.allSettled(schedulePromises);
      return results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);
    } catch (error) {
      console.error('Error aggregating schedule:', error);
      throw error;
    }
  }

  // Aggregate faults from all branches
  async aggregateFaults() {
    try {
      const branches = await this.getActiveBranches();
      
      const faultPromises = branches.map(async (branch) => {
        const faults = await branchService.fetchBranchFaults(branch.base_url, branch.api_key);
        return {
          branchId: branch.id,
          branchName: branch.name,
          branchCode: branch.code,
          data: faults
        };
      });

      const results = await Promise.allSettled(faultPromises);
      return results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);
    } catch (error) {
      console.error('Error aggregating faults:', error);
      throw error;
    }
  }

  // Aggregate communications from all branches
  async aggregateCommunications() {
    try {
      const branches = await this.getActiveBranches();
      
      const commPromises = branches.map(async (branch) => {
        const communications = await branchService.fetchBranchCommunications(branch.base_url, branch.api_key);
        return {
          branchId: branch.id,
          branchName: branch.name,
          branchCode: branch.code,
          data: communications
        };
      });

      const results = await Promise.allSettled(commPromises);
      return results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);
    } catch (error) {
      console.error('Error aggregating communications:', error);
      throw error;
    }
  }

  // Get branch comparison data
  async getBranchComparison() {
    try {
      const overview = await this.aggregateOverview();
      
      const comparison = overview.branches.map(branch => ({
        branchId: branch.branchId,
        branchName: branch.branchName,
        branchCode: branch.branchCode,
        students: branch.data?.students?.total || 0,
        staff: branch.data?.staff?.total || 0,
        classes: branch.data?.classes?.total || 0,
        revenue: branch.data?.finance?.totalRevenue || 0,
        expenses: branch.data?.finance?.totalExpenses || 0,
        profit: (branch.data?.finance?.totalRevenue || 0) - (branch.data?.finance?.totalExpenses || 0)
      }));

      return comparison;
    } catch (error) {
      console.error('Error getting branch comparison:', error);
      throw error;
    }
  }
}

export default new AggregationService();

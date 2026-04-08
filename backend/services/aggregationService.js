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
          branch_id: branch.id,
          branch_name: branch.name,
          branch_code: branch.code
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
          branch_id: branch.id,
          branch_name: branch.name,
          branch_code: branch.code
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
          branch_id: branch.id,
          branch_name: branch.name,
          branch_code: branch.code,
          total_revenue: finance?.totalRevenue || 0,
          total_pending: finance?.totalPending || 0,
          total_paid: finance?.totalRevenue || 0, // Assuming paid = revenue for now
          total_overdue: 0, // Not available in current API
          total_invoices: 0 // Not available in current API
        };
      });

      const results = await Promise.allSettled(financePromises);
      const byBranch = results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);

      // Calculate summary totals
      const summary = {
        total_revenue: byBranch.reduce((sum, b) => sum + (parseFloat(b.total_revenue) || 0), 0),
        total_pending: byBranch.reduce((sum, b) => sum + (parseFloat(b.total_pending) || 0), 0),
        total_paid: byBranch.reduce((sum, b) => sum + (parseFloat(b.total_paid) || 0), 0),
        total_overdue: byBranch.reduce((sum, b) => sum + (parseFloat(b.total_overdue) || 0), 0)
      };

      return {
        summary,
        byBranch
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
        const [academics, classes, marklists] = await Promise.all([
          branchService.fetchBranchAcademics(branch.base_url, branch.api_key),
          branchService.fetchBranchClasses(branch.base_url, branch.api_key),
          branchService.fetchBranchMarklists(branch.base_url, branch.api_key)
        ]);
        return {
          branch_id: branch.id,
          branch_name: branch.name,
          branch_code: branch.code,
          data: academics,
          classes: classes,
          marklists: marklists
        };
      });

      const results = await Promise.allSettled(academicPromises);
      const branchAcademics = results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);

      // Aggregate classes
      const classes = [];
      branchAcademics.forEach(branch => {
        if (branch.classes && Array.isArray(branch.classes)) {
          branch.classes.forEach(cls => {
            classes.push({
              class_name: cls.name || cls.class_name,
              grade: cls.name || cls.grade,
              branch_name: branch.branch_name,
              branch_code: branch.branch_code,
              student_count: cls.total_students || cls.student_count || 0
            });
          });
        }
      });

      // Aggregate marklists
      const marklists = [];
      branchAcademics.forEach(branch => {
        if (branch.marklists && Array.isArray(branch.marklists)) {
          branch.marklists.forEach(marklist => {
            marklists.push({
              student_name: marklist.student_name,
              class_name: marklist.class_name || marklist.grade,
              exam_name: marklist.exam_name,
              subject_name: marklist.subject_name,
              marks_obtained: marklist.marks_obtained || marklist.marks,
              total_marks: marklist.total_marks,
              branch_name: branch.branch_name,
              branch_code: branch.branch_code
            });
          });
        }
      });

      // Aggregate evaluations
      const evaluations = [];
      branchAcademics.forEach(branch => {
        if (branch.data?.evaluations) {
          const evalData = branch.data.evaluations;
          if (evalData.totalEvaluations || evalData.total_evaluations) {
            const count = evalData.totalEvaluations || evalData.total_evaluations;
            if (count > 0) {
              evaluations.push({
                evaluation_name: `${branch.branch_name} Evaluations`,
                evaluation_type: 'Summary',
                max_points: 100,
                branch_name: branch.branch_name,
                branch_code: branch.branch_code
              });
            }
          }
        }
      });

      // Calculate summary
      const summary = {
        total_classes: classes.length,
        total_mark_lists: marklists.length,
        total_evaluations: branchAcademics.reduce((sum, b) => {
          const evalData = b.data?.evaluations;
          return sum + (evalData?.totalEvaluations || evalData?.total_evaluations || 0);
        }, 0),
        total_students: classes.reduce((sum, cls) => sum + cls.student_count, 0)
      };

      return {
        summary,
        classes,
        marklists,
        evaluations
      };
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
          branch_id: branch.id,
          branch_name: branch.name,
          branch_code: branch.code
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

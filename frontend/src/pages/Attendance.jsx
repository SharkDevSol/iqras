import { useState, useEffect } from 'react';
import { getBranches } from '../services/api';
import { FiCheckCircle, FiXCircle, FiClock, FiCalendar } from 'react-icons/fi';
import axios from 'axios';
import './Attendance.css';

function Attendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedBranch, setSelectedBranch] = useState('all');

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:6000/api';
      
      const [attendanceRes, branchesRes] = await Promise.all([
        axios.get(`${API_URL}/aggregate/attendance?date=${selectedDate}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        getBranches()
      ]);
      
      setAttendanceData(attendanceRes.data);
      setBranches(branchesRes.data);
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAttendance = selectedBranch === 'all' 
    ? attendanceData 
    : attendanceData.filter(a => a.branch_code === selectedBranch);

  const totalStats = filteredAttendance.reduce((acc, branch) => {
    const data = branch.data || {};
    return {
      present: acc.present + (parseInt(data.totalPresent) || 0),
      absent: acc.absent + (parseInt(data.totalAbsent) || 0)
    };
  }, { present: 0, absent: 0 });

  const totalStudents = totalStats.present + totalStats.absent;
  const overallRate = totalStudents > 0 
    ? ((totalStats.present / totalStudents) * 100).toFixed(1) 
    : 0;

  if (loading) {
    return <div className="loading">Loading attendance data...</div>;
  }

  return (
    <div className="attendance-page">
      <div className="page-header">
        <h2>Student Attendance</h2>
      </div>

      <div className="date-selector">
        <div className="date-input-group">
          <FiCalendar />
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
        <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
          <option value="all">All Branches</option>
          {branches.map(b => (
            <option key={b.id} value={b.code}>{b.name}</option>
          ))}
        </select>
      </div>

      <div className="stats-grid">
        <div className="stat-card present">
          <div className="stat-icon">
            <FiCheckCircle />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Present</div>
            <div className="stat-value">{totalStats.present}</div>
          </div>
        </div>
        <div className="stat-card absent">
          <div className="stat-icon">
            <FiXCircle />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Absent</div>
            <div className="stat-value">{totalStats.absent}</div>
          </div>
        </div>
        <div className="stat-card total">
          <div className="stat-icon">
            <FiClock />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Students</div>
            <div className="stat-value">{totalStudents}</div>
          </div>
        </div>
        <div className="stat-card rate">
          <div className="stat-icon">
            <FiCheckCircle />
          </div>
          <div className="stat-content">
            <div className="stat-label">Attendance Rate</div>
            <div className="stat-value">{overallRate}%</div>
          </div>
        </div>
      </div>

      <div className="branch-attendance-section">
        <h3>Attendance by Branch</h3>
        <div className="branch-cards-grid">
          {filteredAttendance.map((branch, index) => {
            const data = branch.data || {};
            const present = parseInt(data.totalPresent) || 0;
            const absent = parseInt(data.totalAbsent) || 0;
            const total = present + absent;
            const rate = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
            
            return (
              <div key={index} className="branch-attendance-card">
                <div className="branch-header">
                  <h4>{branch.branch_name}</h4>
                  <span className={`rate-badge ${rate >= 90 ? 'excellent' : rate >= 75 ? 'good' : rate >= 60 ? 'average' : 'poor'}`}>
                    {rate}%
                  </span>
                </div>
                <div className="attendance-stats">
                  <div className="attendance-stat present">
                    <FiCheckCircle />
                    <div>
                      <div className="stat-number">{present}</div>
                      <div className="stat-text">Present</div>
                    </div>
                  </div>
                  <div className="attendance-stat absent">
                    <FiXCircle />
                    <div>
                      <div className="stat-number">{absent}</div>
                      <div className="stat-text">Absent</div>
                    </div>
                  </div>
                  <div className="attendance-stat total">
                    <FiClock />
                    <div>
                      <div className="stat-number">{total}</div>
                      <div className="stat-text">Total</div>
                    </div>
                  </div>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${rate}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {filteredAttendance.length === 0 && (
        <div className="no-data">
          <p>No attendance data available for {selectedDate}</p>
        </div>
      )}
    </div>
  );
}

export default Attendance;

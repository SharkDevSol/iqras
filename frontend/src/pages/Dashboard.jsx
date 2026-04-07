import { useState, useEffect } from 'react';
import { getOverview, getBranches } from '../services/api';
import { FiUsers, FiUserCheck, FiDollarSign, FiActivity } from 'react-icons/fi';
import './Dashboard.css';

function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [overviewRes, branchesRes] = await Promise.all([
        getOverview(),
        getBranches()
      ]);
      setOverview(overviewRes.data);
      setBranches(branchesRes.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const stats = [
    {
      icon: <FiUsers />,
      label: 'Total Students',
      value: overview?.totals?.totalStudents || 0,
      color: '#667eea'
    },
    {
      icon: <FiUserCheck />,
      label: 'Total Staff',
      value: overview?.totals?.totalStaff || 0,
      color: '#764ba2'
    },
    {
      icon: <FiActivity />,
      label: 'Total Classes',
      value: overview?.totals?.totalClasses || 0,
      color: '#f093fb'
    },
    {
      icon: <FiDollarSign />,
      label: 'Total Revenue',
      value: `$${(overview?.totals?.totalRevenue || 0).toLocaleString()}`,
      color: '#4ade80'
    }
  ];

  return (
    <div className="dashboard">
      <h2>Dashboard Overview</h2>
      
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-icon" style={{ background: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="branches-section">
        <h3>Branches ({branches.length})</h3>
        <div className="branches-grid">
          {branches.map((branch) => (
            <div key={branch.id} className="branch-card">
              <div className="branch-header">
                <h4>{branch.name}</h4>
                <span className={`status-badge ${branch.health_status}`}>
                  {branch.health_status || 'unknown'}
                </span>
              </div>
              <div className="branch-info">
                <div className="info-item">
                  <span>Code:</span>
                  <strong>{branch.code}</strong>
                </div>
                <div className="info-item">
                  <span>Location:</span>
                  <strong>{branch.location || 'N/A'}</strong>
                </div>
                <div className="info-item">
                  <span>Students:</span>
                  <strong>{branch.total_students || 0}</strong>
                </div>
                <div className="info-item">
                  <span>Staff:</span>
                  <strong>{branch.total_staff || 0}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

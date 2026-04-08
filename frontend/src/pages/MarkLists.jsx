import { useState, useEffect } from 'react';
import { getBranches } from '../services/api';
import { FiTrendingUp, FiTrendingDown, FiAward, FiUsers } from 'react-icons/fi';
import axios from 'axios';
import './MarkLists.css';

function MarkLists() {
  const [marklists, setMarklists] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:6000/api';
      
      const [marklistsRes, branchesRes] = await Promise.all([
        axios.get(`${API_URL}/aggregate/marklists`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        getBranches()
      ]);
      
      setMarklists(marklistsRes.data);
      setBranches(branchesRes.data);
      calculateAnalytics(marklistsRes.data);
    } catch (error) {
      console.error('Error loading mark lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (data) => {
    if (!data || data.length === 0) {
      setAnalytics(null);
      return;
    }

    // Overall school analytics
    const allMarks = data.map(m => parseFloat(m.marks_obtained) || 0);
    const schoolHighest = Math.max(...allMarks);
    const schoolLowest = Math.min(...allMarks);
    const schoolAverage = (allMarks.reduce((a, b) => a + b, 0) / allMarks.length).toFixed(2);

    // By class analytics
    const byClass = {};
    data.forEach(mark => {
      const className = mark.class_name;
      if (!byClass[className]) {
        byClass[className] = [];
      }
      byClass[className].push(parseFloat(mark.marks_obtained) || 0);
    });

    const classAnalytics = Object.keys(byClass).map(className => {
      const marks = byClass[className];
      return {
        className,
        highest: Math.max(...marks),
        lowest: Math.min(...marks),
        average: (marks.reduce((a, b) => a + b, 0) / marks.length).toFixed(2),
        count: marks.length
      };
    }).sort((a, b) => b.average - a.average);

    // Top performers
    const topPerformers = [...data]
      .sort((a, b) => (parseFloat(b.marks_obtained) || 0) - (parseFloat(a.marks_obtained) || 0))
      .slice(0, 10);

    setAnalytics({
      school: {
        highest: schoolHighest,
        lowest: schoolLowest,
        average: schoolAverage,
        total: data.length
      },
      byClass: classAnalytics,
      topPerformers
    });
  };

  const filteredMarklists = marklists.filter(mark => {
    const matchesBranch = selectedBranch === 'all' || mark.branch_code === selectedBranch;
    const matchesClass = selectedClass === 'all' || mark.class_name === selectedClass;
    return matchesBranch && matchesClass;
  });

  const classes = [...new Set(marklists.map(m => m.class_name).filter(Boolean))].sort();

  const getScoreClass = (score) => {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'average';
    return 'poor';
  };

  if (loading) {
    return <div className="loading">Loading mark lists...</div>;
  }

  return (
    <div className="marklists-page">
      <div className="page-header">
        <h2>Mark Lists & Performance Analytics</h2>
      </div>

      {analytics && (
        <>
          <div className="analytics-section">
            <h3>School-Wide Performance</h3>
            <div className="stats-grid">
              <div className="stat-card highest">
                <div className="stat-icon">
                  <FiTrendingUp />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Highest Score</div>
                  <div className="stat-value">{analytics.school.highest}</div>
                </div>
              </div>
              <div className="stat-card lowest">
                <div className="stat-icon">
                  <FiTrendingDown />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Lowest Score</div>
                  <div className="stat-value">{analytics.school.lowest}</div>
                </div>
              </div>
              <div className="stat-card average">
                <div className="stat-icon">
                  <FiAward />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Average Score</div>
                  <div className="stat-value">{analytics.school.average}</div>
                </div>
              </div>
              <div className="stat-card total">
                <div className="stat-icon">
                  <FiUsers />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Total Records</div>
                  <div className="stat-value">{analytics.school.total}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="analytics-section">
            <h3>Performance by Class</h3>
            <div className="class-analytics-grid">
              {analytics.byClass.map((cls, index) => (
                <div key={index} className="class-card">
                  <h4>{cls.className}</h4>
                  <div className="class-stats">
                    <div className="class-stat">
                      <span className="label">Highest:</span>
                      <span className={`value ${getScoreClass(cls.highest)}`}>{cls.highest}</span>
                    </div>
                    <div className="class-stat">
                      <span className="label">Lowest:</span>
                      <span className={`value ${getScoreClass(cls.lowest)}`}>{cls.lowest}</span>
                    </div>
                    <div className="class-stat">
                      <span className="label">Average:</span>
                      <span className={`value ${getScoreClass(cls.average)}`}>{cls.average}</span>
                    </div>
                    <div className="class-stat">
                      <span className="label">Records:</span>
                      <span className="value">{cls.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="analytics-section">
            <h3>Top 10 Performers</h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Student Name</th>
                    <th>Class</th>
                    <th>Subject</th>
                    <th>Exam</th>
                    <th>Score</th>
                    <th>Branch</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topPerformers.map((mark, index) => (
                    <tr key={index}>
                      <td>
                        <span className="rank-badge">{index + 1}</span>
                      </td>
                      <td>{mark.student_name}</td>
                      <td>
                        <span className="grade-badge">{mark.class_name}</span>
                      </td>
                      <td>{mark.subject_name}</td>
                      <td>{mark.exam_name}</td>
                      <td>
                        <span className={`score-badge ${getScoreClass(mark.marks_obtained)}`}>
                          {mark.marks_obtained}/{mark.total_marks}
                        </span>
                      </td>
                      <td>
                        <span className="branch-tag">{mark.branch_name}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <div className="filters-section">
        <h3>All Mark Lists ({filteredMarklists.length})</h3>
        <div className="filters">
          <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
            <option value="all">All Branches</option>
            {branches.map(b => (
              <option key={b.id} value={b.code}>{b.name}</option>
            ))}
          </select>
          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
            <option value="all">All Classes</option>
            {classes.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Class</th>
              <th>Exam</th>
              <th>Subject</th>
              <th>Marks</th>
              <th>Total</th>
              <th>Percentage</th>
              <th>Branch</th>
            </tr>
          </thead>
          <tbody>
            {filteredMarklists.map((mark, index) => {
              const percentage = ((parseFloat(mark.marks_obtained) / parseFloat(mark.total_marks)) * 100).toFixed(1);
              return (
                <tr key={index}>
                  <td>{mark.student_name}</td>
                  <td>
                    <span className="grade-badge">{mark.class_name}</span>
                  </td>
                  <td>{mark.exam_name}</td>
                  <td>{mark.subject_name}</td>
                  <td>
                    <span className={`score-badge ${getScoreClass(mark.marks_obtained)}`}>
                      {mark.marks_obtained}
                    </span>
                  </td>
                  <td>{mark.total_marks}</td>
                  <td>
                    <span className={`percentage ${getScoreClass(percentage)}`}>
                      {percentage}%
                    </span>
                  </td>
                  <td>
                    <span className="branch-tag">{mark.branch_name}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MarkLists;

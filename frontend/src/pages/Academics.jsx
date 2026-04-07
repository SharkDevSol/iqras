import { useState, useEffect } from 'react';
import { getAcademics, getBranches } from '../services/api';
import { FiBook, FiUsers, FiCalendar, FiAward, FiFileText } from 'react-icons/fi';
import './Academics.css';

function Academics() {
  const [academicsData, setAcademicsData] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('subjects');
  const [selectedBranch, setSelectedBranch] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [academicsRes, branchesRes] = await Promise.all([
        getAcademics(),
        getBranches()
      ]);
      setAcademicsData(academicsRes.data);
      setBranches(branchesRes.data);
    } catch (error) {
      console.error('Error loading academics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading academics data...</div>;
  }

  const summary = academicsData?.summary || {};
  const subjects = academicsData?.subjects || [];
  const classes = academicsData?.classes || [];
  const terms = academicsData?.terms || [];
  const evaluations = academicsData?.evaluations || [];

  const filterByBranch = (items) => {
    if (selectedBranch === 'all') return items;
    return items.filter(item => item.branch_code === selectedBranch);
  };

  const getScoreClass = (score) => {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'average';
    return 'poor';
  };

  return (
    <div className="academics-page">
      <div className="page-header">
        <h2>Academics Overview</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Subjects</div>
          <div className="stat-value">{summary.total_subjects || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Classes</div>
          <div className="stat-value">{summary.total_classes || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Terms</div>
          <div className="stat-value">{summary.total_terms || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Evaluations</div>
          <div className="stat-value">{summary.total_evaluations || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Mark Lists</div>
          <div className="stat-value">{summary.total_mark_lists || 0}</div>
        </div>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'subjects' ? 'active' : ''}`}
          onClick={() => setActiveTab('subjects')}
        >
          <FiBook /> Subjects
        </button>
        <button 
          className={`tab ${activeTab === 'classes' ? 'active' : ''}`}
          onClick={() => setActiveTab('classes')}
        >
          <FiUsers /> Classes
        </button>
        <button 
          className={`tab ${activeTab === 'terms' ? 'active' : ''}`}
          onClick={() => setActiveTab('terms')}
        >
          <FiCalendar /> Terms
        </button>
        <button 
          className={`tab ${activeTab === 'evaluations' ? 'active' : ''}`}
          onClick={() => setActiveTab('evaluations')}
        >
          <FiAward /> Evaluations
        </button>
      </div>

      <div className="content-section">
        <div className="filters">
          <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
            <option value="all">All Branches</option>
            {branches.map(b => (
              <option key={b.id} value={b.code}>{b.name}</option>
            ))}
          </select>
        </div>

        {activeTab === 'subjects' && (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Subject Name</th>
                  <th>Grade</th>
                  <th>Branch</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filterByBranch(subjects).map((subject, index) => (
                  <tr key={index}>
                    <td>{subject.subject_name}</td>
                    <td>
                      <span className="grade-badge">{subject.grade}</span>
                    </td>
                    <td>
                      <span className="branch-tag">{subject.branch_name}</span>
                    </td>
                    <td>{subject.status || 'Active'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'classes' && (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Class Name</th>
                  <th>Grade</th>
                  <th>Branch</th>
                  <th>Students</th>
                </tr>
              </thead>
              <tbody>
                {filterByBranch(classes).map((cls, index) => (
                  <tr key={index}>
                    <td>{cls.class_name}</td>
                    <td>
                      <span className="grade-badge">{cls.grade}</span>
                    </td>
                    <td>
                      <span className="branch-tag">{cls.branch_name}</span>
                    </td>
                    <td>{cls.student_count || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Term Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Branch</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filterByBranch(terms).map((term, index) => (
                  <tr key={index}>
                    <td>{term.term_name}</td>
                    <td>{term.start_date ? new Date(term.start_date).toLocaleDateString() : 'N/A'}</td>
                    <td>{term.end_date ? new Date(term.end_date).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <span className="branch-tag">{term.branch_name}</span>
                    </td>
                    <td>{term.status || 'Active'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'evaluations' && (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Evaluation Name</th>
                  <th>Type</th>
                  <th>Max Points</th>
                  <th>Branch</th>
                </tr>
              </thead>
              <tbody>
                {filterByBranch(evaluations).map((evaluation, index) => (
                  <tr key={index}>
                    <td>{evaluation.evaluation_name}</td>
                    <td>{evaluation.evaluation_type}</td>
                    <td>
                      <span className="score-badge good">
                        {evaluation.max_points || 100}
                      </span>
                    </td>
                    <td>
                      <span className="branch-tag">{evaluation.branch_name}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Academics;

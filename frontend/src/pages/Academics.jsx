import { useState, useEffect } from 'react';
import { getAcademics, getBranches } from '../services/api';
import { FiBook, FiUsers, FiCalendar, FiAward, FiFileText } from 'react-icons/fi';
import './Academics.css';

function Academics() {
  const [academicsData, setAcademicsData] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('classes');
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
  const classes = academicsData?.classes || [];
  const marklists = academicsData?.marklists || [];
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
          <div className="stat-label">Total Classes</div>
          <div className="stat-value">{summary.total_classes || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Mark Lists</div>
          <div className="stat-value">{summary.total_mark_lists || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Evaluations</div>
          <div className="stat-value">{summary.total_evaluations || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Students</div>
          <div className="stat-value">{summary.total_students || 0}</div>
        </div>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'classes' ? 'active' : ''}`}
          onClick={() => setActiveTab('classes')}
        >
          <FiUsers /> Classes
        </button>
        <button 
          className={`tab ${activeTab === 'marklists' ? 'active' : ''}`}
          onClick={() => setActiveTab('marklists')}
        >
          <FiFileText /> Mark Lists
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

        {activeTab === 'marklists' && (
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
                  <th>Branch</th>
                </tr>
              </thead>
              <tbody>
                {filterByBranch(marklists).map((marklist, index) => (
                  <tr key={index}>
                    <td>{marklist.student_name}</td>
                    <td>
                      <span className="grade-badge">{marklist.class_name}</span>
                    </td>
                    <td>{marklist.exam_name}</td>
                    <td>{marklist.subject_name}</td>
                    <td>
                      <span className={`score-badge ${getScoreClass(marklist.marks_obtained)}`}>
                        {marklist.marks_obtained}
                      </span>
                    </td>
                    <td>{marklist.total_marks}</td>
                    <td>
                      <span className="branch-tag">{marklist.branch_name}</span>
                    </td>
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

import { useState, useEffect } from 'react';
import { getAllStudents, getBranches } from '../services/api';
import { FiSearch, FiFilter, FiDownload } from 'react-icons/fi';
import './Students.css';

function Students() {
  const [students, setStudents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [studentsRes, branchesRes] = await Promise.all([
        getAllStudents(),
        getBranches()
      ]);
      setStudents(studentsRes.data);
      setBranches(branchesRes.data);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === 'all' || student.branch_code === selectedBranch;
    const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade;
    return matchesSearch && matchesBranch && matchesGrade;
  });

  const grades = [...new Set(students.map(s => s.grade).filter(Boolean))].sort();

  const exportToCSV = () => {
    const headers = ['Student ID', 'Name', 'Grade', 'Branch', 'Gender', 'Status'];
    const rows = filteredStudents.map(s => [
      s.student_id,
      s.name,
      s.grade,
      s.branch_name,
      s.gender,
      s.status
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
  };

  if (loading) {
    return <div className="loading">Loading students...</div>;
  }

  return (
    <div className="students-page">
      <div className="page-header">
        <h2>All Students ({filteredStudents.length})</h2>
        <button className="export-btn" onClick={exportToCSV}>
          <FiDownload /> Export CSV
        </button>
      </div>

      <div className="filters">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
          <option value="all">All Branches</option>
          {branches.map(b => (
            <option key={b.id} value={b.code}>{b.name}</option>
          ))}
        </select>
        <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)}>
          <option value="all">All Grades</option>
          {grades.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Grade</th>
              <th>Gender</th>
              <th>Branch</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={index}>
                <td>{student.student_id}</td>
                <td>{student.name}</td>
                <td>{student.grade}</td>
                <td>{student.gender}</td>
                <td>
                  <span className="branch-tag">{student.branch_name}</span>
                </td>
                <td>
                  <span className={`status-badge ${student.status}`}>
                    {student.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Students;

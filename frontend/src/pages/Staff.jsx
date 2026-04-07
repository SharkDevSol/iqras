import { useState, useEffect } from 'react';
import { getAllStaff, getBranches } from '../services/api';
import { FiSearch, FiDownload, FiMail, FiPhone } from 'react-icons/fi';
import './Staff.css';

function Staff() {
  const [staff, setStaff] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [staffRes, branchesRes] = await Promise.all([
        getAllStaff(),
        getBranches()
      ]);
      setStaff(staffRes.data);
      setBranches(branchesRes.data);
    } catch (error) {
      console.error('Error loading staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = 
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.staff_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === 'all' || member.branch_code === selectedBranch;
    const matchesRole = selectedRole === 'all' || member.role === selectedRole;
    return matchesSearch && matchesBranch && matchesRole;
  });

  const roles = [...new Set(staff.map(s => s.role).filter(Boolean))].sort();

  const exportToCSV = () => {
    const headers = ['Staff ID', 'Name', 'Role', 'Branch', 'Email', 'Phone', 'Status'];
    const rows = filteredStaff.map(s => [
      s.staff_id,
      s.name,
      s.role,
      s.branch_name,
      s.email,
      s.phone,
      s.status
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'staff.csv';
    a.click();
  };

  if (loading) {
    return <div className="loading">Loading staff...</div>;
  }

  return (
    <div className="staff-page">
      <div className="page-header">
        <h2>All Staff ({filteredStaff.length})</h2>
        <button className="export-btn" onClick={exportToCSV}>
          <FiDownload /> Export CSV
        </button>
      </div>

      <div className="filters">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by name, ID, or email..."
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
        <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
          <option value="all">All Roles</option>
          {roles.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Staff ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Branch</th>
              <th>Contact</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((member, index) => (
              <tr key={index}>
                <td>{member.staff_id}</td>
                <td>{member.name}</td>
                <td>
                  <span className="role-tag">{member.role}</span>
                </td>
                <td>
                  <span className="branch-tag">{member.branch_name}</span>
                </td>
                <td>
                  <div className="contact-info">
                    {member.email && (
                      <div className="contact-item">
                        <FiMail size={14} />
                        <span>{member.email}</span>
                      </div>
                    )}
                    {member.phone && (
                      <div className="contact-item">
                        <FiPhone size={14} />
                        <span>{member.phone}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${member.status}`}>
                    {member.status}
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

export default Staff;

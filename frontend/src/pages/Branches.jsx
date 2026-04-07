import { useState, useEffect } from 'react';
import { getBranches, addBranch, deleteBranch, testBranch } from '../services/api';
import { FiPlus, FiTrash2, FiCheckCircle, FiXCircle, FiActivity } from 'react-icons/fi';
import './Branches.css';

function Branches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    base_url: '',
    location: '',
    principal_name: '',
    contact_email: '',
    contact_phone: ''
  });
  const [testing, setTesting] = useState(null);

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      const response = await getBranches();
      setBranches(response.data);
    } catch (error) {
      console.error('Error loading branches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addBranch(formData);
      setShowModal(false);
      setFormData({
        name: '',
        code: '',
        base_url: '',
        location: '',
        principal_name: '',
        contact_email: '',
        contact_phone: ''
      });
      loadBranches();
      alert('Branch added successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add branch');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this branch?')) return;
    try {
      await deleteBranch(id);
      loadBranches();
      alert('Branch deleted successfully!');
    } catch (error) {
      alert('Failed to delete branch');
    }
  };

  const handleTest = async (id) => {
    setTesting(id);
    try {
      const response = await testBranch(id);
      alert(response.data.success ? 'Connection successful!' : 'Connection failed: ' + response.data.message);
    } catch (error) {
      alert('Connection test failed');
    } finally {
      setTesting(null);
    }
  };

  if (loading) {
    return <div className="loading">Loading branches...</div>;
  }

  return (
    <div className="branches-page">
      <div className="page-header">
        <h2>Branch Management</h2>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          <FiPlus /> Add Branch
        </button>
      </div>

      <div className="branches-list">
        {branches.map((branch) => (
          <div key={branch.id} className="branch-item">
            <div className="branch-main">
              <div className="branch-title">
                <h3>{branch.name}</h3>
                <span className={`status-badge ${branch.health_status}`}>
                  {branch.health_status === 'healthy' ? <FiCheckCircle /> : <FiXCircle />}
                  {branch.health_status || 'unknown'}
                </span>
              </div>
              <div className="branch-details">
                <div className="detail-row">
                  <span>Code:</span>
                  <strong>{branch.code}</strong>
                </div>
                <div className="detail-row">
                  <span>URL:</span>
                  <a href={branch.base_url} target="_blank" rel="noopener noreferrer">
                    {branch.base_url}
                  </a>
                </div>
                <div className="detail-row">
                  <span>Location:</span>
                  <strong>{branch.location || 'N/A'}</strong>
                </div>
                <div className="detail-row">
                  <span>Principal:</span>
                  <strong>{branch.principal_name || 'N/A'}</strong>
                </div>
              </div>
            </div>
            <div className="branch-actions">
              <button 
                className="test-btn" 
                onClick={() => handleTest(branch.id)}
                disabled={testing === branch.id}
              >
                <FiActivity /> {testing === branch.id ? 'Testing...' : 'Test'}
              </button>
              <button className="delete-btn" onClick={() => handleDelete(branch.id)}>
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Branch</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Branch Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Branch Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g., IQRAB3"
                  required
                />
              </div>
              <div className="form-group">
                <label>Base URL *</label>
                <input
                  type="url"
                  value={formData.base_url}
                  onChange={(e) => setFormData({ ...formData, base_url: e.target.value })}
                  placeholder="https://iqrab3.skoolific.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Principal Name</label>
                <input
                  type="text"
                  value={formData.principal_name}
                  onChange={(e) => setFormData({ ...formData, principal_name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Contact Email</label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Contact Phone</label>
                <input
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit">Add Branch</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Branches;

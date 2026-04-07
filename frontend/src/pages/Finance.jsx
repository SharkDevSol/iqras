import { useState, useEffect } from 'react';
import { getFinance } from '../services/api';
import { FiDollarSign, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Finance.css';

function Finance() {
  const [financeData, setFinanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await getFinance();
      setFinanceData(response.data);
    } catch (error) {
      console.error('Error loading finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading finance data...</div>;
  }

  const summary = financeData?.summary || {};
  const byBranch = financeData?.byBranch || [];

  const chartData = byBranch.map(branch => ({
    name: branch.branch_name,
    Revenue: parseFloat(branch.total_revenue) || 0,
    Pending: parseFloat(branch.total_pending) || 0,
    Paid: parseFloat(branch.total_paid) || 0
  }));

  return (
    <div className="finance-page">
      <div className="page-header">
        <h2>Finance Overview</h2>
      </div>

      <div className="summary-cards">
        <div className="summary-card revenue">
          <div className="card-header">
            <div className="card-icon">
              <FiDollarSign />
            </div>
            <div className="card-label">Total Revenue</div>
          </div>
          <div className="card-value">
            {parseFloat(summary.total_revenue || 0).toLocaleString()} ETB
          </div>
        </div>

        <div className="summary-card pending">
          <div className="card-header">
            <div className="card-icon">
              <FiClock />
            </div>
            <div className="card-label">Pending Payments</div>
          </div>
          <div className="card-value">
            {parseFloat(summary.total_pending || 0).toLocaleString()} ETB
          </div>
        </div>

        <div className="summary-card paid">
          <div className="card-header">
            <div className="card-icon">
              <FiCheckCircle />
            </div>
            <div className="card-label">Paid Invoices</div>
          </div>
          <div className="card-value">
            {parseFloat(summary.total_paid || 0).toLocaleString()} ETB
          </div>
        </div>

        <div className="summary-card overdue">
          <div className="card-header">
            <div className="card-icon">
              <FiAlertCircle />
            </div>
            <div className="card-label">Overdue Payments</div>
          </div>
          <div className="card-value">
            {parseFloat(summary.total_overdue || 0).toLocaleString()} ETB
          </div>
        </div>
      </div>

      <div className="chart-section">
        <h3>Revenue by Branch</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Revenue" fill="#48bb78" />
            <Bar dataKey="Pending" fill="#ed8936" />
            <Bar dataKey="Paid" fill="#4299e1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h3>Branch Finance Details</h3>
        <div className="branch-finance-grid">
          {byBranch.map((branch, index) => (
            <div key={index} className="branch-finance-card">
              <h4>{branch.branch_name}</h4>
              <div className="finance-row">
                <span className="finance-label">Total Revenue</span>
                <span className="finance-value positive">
                  {parseFloat(branch.total_revenue || 0).toLocaleString()} ETB
                </span>
              </div>
              <div className="finance-row">
                <span className="finance-label">Pending</span>
                <span className="finance-value">
                  {parseFloat(branch.total_pending || 0).toLocaleString()} ETB
                </span>
              </div>
              <div className="finance-row">
                <span className="finance-label">Paid</span>
                <span className="finance-value positive">
                  {parseFloat(branch.total_paid || 0).toLocaleString()} ETB
                </span>
              </div>
              <div className="finance-row">
                <span className="finance-label">Overdue</span>
                <span className="finance-value negative">
                  {parseFloat(branch.total_overdue || 0).toLocaleString()} ETB
                </span>
              </div>
              <div className="finance-row">
                <span className="finance-label">Total Invoices</span>
                <span className="finance-value">
                  {branch.total_invoices || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Finance;

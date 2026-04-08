import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiUserCheck, FiDollarSign, FiBook, FiFileText, FiCalendar, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';
import './Layout.css';

function Layout({ children, onLogout }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: '/', icon: <FiHome />, label: 'Dashboard' },
    { path: '/branches', icon: <FiUsers />, label: 'Branches' },
    { path: '/students', icon: <FiUserCheck />, label: 'Students' },
    { path: '/staff', icon: <FiUserCheck />, label: 'Staff' },
    { path: '/finance', icon: <FiDollarSign />, label: 'Finance' },
    { path: '/academics', icon: <FiBook />, label: 'Academics' },
    { path: '/marklists', icon: <FiFileText />, label: 'Mark Lists' },
    { path: '/attendance', icon: <FiCalendar />, label: 'Attendance' },
  ];

  return (
    <div className="layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>🎓 IQRAS</h2>
          <button className="close-btn" onClick={() => setSidebarOpen(false)}>
            <FiX />
          </button>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <button className="logout-btn" onClick={onLogout}>
          <FiLogOut />
          <span>Logout</span>
        </button>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
            <FiMenu />
          </button>
          <h1>Super Admin Dashboard</h1>
        </header>
        <div className="content">
          {children}
        </div>
      </main>

      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}

export default Layout;

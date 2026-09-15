import React, { useEffect } from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

// Mock sub-components for the dashboard
const Overview = () => (
  <div className="admin-overview">
    <h2>Dashboard Overview</h2>
    <div className="stats-grid">
      <div className="stat-card"><h3>Total Doctors</h3><p className="headline-xl">4</p></div>
      <div className="stat-card"><h3>Total Services</h3><p className="headline-xl">6</p></div>
      <div className="stat-card"><h3>Published Blogs</h3><p className="headline-xl">12</p></div>
      <div className="stat-card"><h3>Appointments</h3><p className="headline-xl">28</p></div>
    </div>
  </div>
);

const PlaceholderCRUD = ({ title }) => (
  <div className="admin-crud">
    <div className="crud-header">
      <h2>{title}</h2>
      <button className="btn btn-primary">Add New</button>
    </div>
    <div className="crud-table-wrapper">
      <table className="crud-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name / Title</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>No records found or mock data.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2 className="headline-sm" style={{color: 'var(--color-primary)'}}>TheraKids Admin</h2>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin/dashboard" end className={({isActive}) => isActive ? 'active' : ''}>Overview</NavLink>
          <NavLink to="/admin/dashboard/doctors" className={({isActive}) => isActive ? 'active' : ''}>Doctors</NavLink>
          <NavLink to="/admin/dashboard/services" className={({isActive}) => isActive ? 'active' : ''}>Services</NavLink>
          <NavLink to="/admin/dashboard/gallery" className={({isActive}) => isActive ? 'active' : ''}>Gallery</NavLink>
          <NavLink to="/admin/dashboard/blogs" className={({isActive}) => isActive ? 'active' : ''}>Blogs</NavLink>
          <NavLink to="/admin/dashboard/testimonials" className={({isActive}) => isActive ? 'active' : ''}>Testimonials</NavLink>
          <NavLink to="/admin/dashboard/appointments" className={({isActive}) => isActive ? 'active' : ''}>Appointments</NavLink>
          <NavLink to="/admin/dashboard/settings" className={({isActive}) => isActive ? 'active' : ''}>Site Settings</NavLink>
        </nav>
        <div className="admin-sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </aside>
      
      <main className="admin-main-content">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="doctors" element={<PlaceholderCRUD title="Manage Doctors" />} />
          <Route path="services" element={<PlaceholderCRUD title="Manage Services" />} />
          <Route path="gallery" element={<PlaceholderCRUD title="Manage Gallery" />} />
          <Route path="blogs" element={<PlaceholderCRUD title="Manage Blogs" />} />
          <Route path="testimonials" element={<PlaceholderCRUD title="Manage Testimonials" />} />
          <Route path="appointments" element={<PlaceholderCRUD title="Manage Appointments" />} />
          <Route path="settings" element={<PlaceholderCRUD title="Site Settings" />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;

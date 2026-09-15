import React, { useCallback, useEffect, useState } from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import API_URL from '../../config';
import './AdminDashboard.css';

// ==========================================
// API helper — attaches the JWT and handles 401
// ==========================================

const adminFetch = async (path, options = {}) => {
  const token = localStorage.getItem('admin_token');
  const res = await fetch(`${API_URL}/api/admin${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  if (res.status === 401) {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin';
    throw new Error('Session expired');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
};

// ==========================================
// Field/type configuration per resource
// ==========================================

const RESOURCES = {
  doctors: {
    title: 'Manage Doctors',
    columns: ['id', 'name', 'designation', 'is_active'],
    fields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'designation', label: 'Designation' },
      { key: 'specialisation', label: 'Specialisation' },
      { key: 'profile_image', label: 'Profile Image', type: 'image', full: true },
      { key: 'qualifications', label: 'Qualifications', full: true },
      { key: 'short_bio', label: 'Short Bio', type: 'textarea', full: true },
      { key: 'full_bio', label: 'Full Bio', type: 'textarea', full: true },
      { key: 'display_order', label: 'Display Order', type: 'number' },
      { key: 'is_active', label: 'Active', type: 'checkbox' }
    ]
  },
  services: {
    title: 'Manage Services',
    columns: ['id', 'name', 'slug', 'is_active'],
    fields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'slug', label: 'Slug (unique)', required: true },
      { key: 'display_order', label: 'Display Order', type: 'number' },
      { key: 'is_active', label: 'Active', type: 'checkbox' },
      { key: 'image', label: 'Image', type: 'image', full: true },
      { key: 'short_description', label: 'Short Description', type: 'textarea', full: true },
      { key: 'full_description', label: 'Full Description', type: 'textarea', full: true },
      { key: 'benefits', label: 'Benefits (JSON array, e.g. ["A","B"])', type: 'textarea', full: true }
    ]
  },
  gallery: {
    title: 'Manage Gallery',
    columns: ['id', 'caption', 'category', 'is_active'],
    fields: [
      { key: 'image_path', label: 'Image', type: 'image', required: true, full: true },
      { key: 'caption', label: 'Caption' },
      { key: 'category', label: 'Category' },
      { key: 'display_order', label: 'Display Order', type: 'number' },
      { key: 'is_active', label: 'Active', type: 'checkbox' }
    ]
  },
  blogs: {
    title: 'Manage Blogs',
    columns: ['id', 'title', 'status', 'published_at'],
    fields: [
      { key: 'title', label: 'Title', required: true, full: true },
      { key: 'slug', label: 'Slug (unique)', required: true },
      { key: 'category', label: 'Category' },
      { key: 'author', label: 'Author' },
      { key: 'status', label: 'Status', type: 'select', options: ['draft', 'published'] },
      { key: 'published_at', label: 'Published At', type: 'datetime-local' },
      { key: 'featured_image', label: 'Featured Image', type: 'image', full: true },
      { key: 'seo_title', label: 'SEO Title', full: true },
      { key: 'meta_description', label: 'Meta Description', type: 'textarea', full: true },
      { key: 'excerpt', label: 'Excerpt', type: 'textarea', full: true },
      { key: 'content', label: 'Content (HTML)', type: 'textarea', full: true, rows: 10 }
    ]
  },
  testimonials: {
    title: 'Manage Testimonials',
    columns: ['id', 'name', 'designation', 'is_active'],
    fields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'designation', label: 'Designation (e.g. Parent, City)' },
      { key: 'display_order', label: 'Display Order', type: 'number' },
      { key: 'is_active', label: 'Active', type: 'checkbox' },
      { key: 'testimonial', label: 'Testimonial', type: 'textarea', full: true, rows: 4 }
    ]
  }
};

const formatDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  return isNaN(d) ? String(value) : d.toLocaleDateString();
};

const absoluteUrl = (url) => {
  if (!url || url.startsWith('http') || url.startsWith('data:')) return url;
  return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const displayCell = (key, value) => {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (value === null || value === undefined || value === '') return '—';
  if (key.endsWith('_at')) return formatDate(value);
  const s = String(value);
  return s.length > 60 ? s.slice(0, 60) + '…' : s;
};

// ==========================================
// Image field with upload + preview (used in the CRUD modal)
// ==========================================

const ImageField = ({ value, required, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const inputRef = React.useRef(null);

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const token = localStorage.getItem('admin_token');
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch(`${API_URL}/api/admin/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onChange(data.url);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-field">
      {value && (
        <div className="image-preview">
          <img src={absoluteUrl(value)} alt="Preview" onError={e => { e.currentTarget.style.display = 'none'; }} />
        </div>
      )}
      <div className="image-field-row">
        <input
          type="text"
          placeholder="/uploads/... or https://..."
          value={value}
          required={required}
          onChange={e => onChange(e.target.value)}
        />
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={e => { handleUpload(e.target.files[0]); e.target.value = ''; }}
        />
        <button type="button" className="btn btn-outline btn-sm" disabled={uploading} onClick={() => inputRef.current?.click()}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
      {uploadError && <span className="image-field-error">{uploadError}</span>}
    </div>
  );
};

// ==========================================
// Overview — live stats
// ==========================================

const Overview = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminFetch('/stats').then(setStats).catch(e => setError(e.message));
  }, []);

  if (error) return <div className="admin-error">{error}</div>;
  if (!stats) return <div className="admin-loading">Loading stats...</div>;

  const cards = [
    { label: 'Total Doctors', value: stats.doctors },
    { label: 'Total Services', value: stats.services },
    { label: 'Published Blogs', value: stats.blogs },
    { label: 'Appointments', value: stats.appointments },
    { label: 'New Appointments', value: stats.newAppointments }
  ];

  return (
    <div className="admin-overview">
      <h2>Dashboard Overview</h2>
      <div className={`stats-grid ${cards.length > 4 ? 'stats-grid-5' : ''}`}>
        {cards.map(c => (
          <div className="stat-card" key={c.label}>
            <h3>{c.label}</h3>
            <p className="headline-xl">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// Generic CRUD manager
// ==========================================

const emptyForm = (fields) => {
  const form = {};
  for (const f of fields) {
    if (f.type === 'checkbox') form[f.key] = true;
    else if (f.type === 'number') form[f.key] = 0;
    else if (f.type === 'select') form[f.key] = f.options[0];
    else form[f.key] = '';
  }
  return form;
};

const CrudManager = ({ resource }) => {
  const cfg = RESOURCES[resource];
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null); // null | 'new' | row object
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    adminFetch(`/${resource}`).then(setRows).catch(e => setError(e.message));
  }, [resource]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => { setForm(emptyForm(cfg.fields)); setEditing('new'); };
  const openEdit = (row) => {
    const f = {};
    for (const field of cfg.fields) f[field.key] = row[field.key] ?? (field.type === 'checkbox' ? false : '');
    const datetimeField = cfg.fields.find(x => x.type === 'datetime-local' && f[x.key]);
    if (datetimeField) {
      // convert "2026-08-10 09:00:00" to datetime-local format
      const v = f[datetimeField.key];
      if (v) f[datetimeField.key] = String(v).replace(' ', 'T').slice(0, 16);
    }
    setForm(f);
    setEditing(row);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { ...form };
      if (payload.published_at === '') delete payload.published_at;
      if (editing === 'new') {
        await adminFetch(`/${resource}`, { method: 'POST', body: JSON.stringify(payload) });
      } else {
        await adminFetch(`/${resource}/${editing.id}`, { method: 'PUT', body: JSON.stringify(payload) });
      }
      setEditing(null);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row) => {
    const label = row.name || row.title || row.caption || `#${row.id}`;
    if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) return;
    setError(null);
    try {
      await adminFetch(`/${resource}/${row.id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (rows === null && !error) return <div className="admin-loading">Loading...</div>;

  return (
    <div className="admin-crud">
      <div className="crud-header">
        <h2>{cfg.title}</h2>
        <button className="btn btn-primary btn-sm" onClick={openCreate}>+ Add New</button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="crud-table-wrapper">
        <table className="crud-table">
          <thead>
            <tr>{cfg.columns.map(col => <th key={col}>{col.replace(/_/g, ' ')}</th>)}<th>Actions</th></tr>
          </thead>
          <tbody>
            {rows && rows.length === 0 && (
              <tr><td colSpan={cfg.columns.length + 1} className="empty-row">No records yet. Click “+ Add New” to create one.</td></tr>
            )}
            {rows && rows.map(row => (
              <tr key={row.id}>
                {cfg.columns.map(col => <td key={col}>{displayCell(col, row[col])}</td>)}
                <td className="actions-cell">
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(row)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="admin-modal-backdrop" onClick={() => setEditing(null)}>
          <form className="admin-modal" onClick={e => e.stopPropagation()} onSubmit={handleSave}>
            <div className="admin-modal-header">
              <h3>{editing === 'new' ? 'Add' : 'Edit'} — {cfg.title.replace('Manage ', '')}</h3>
              <button type="button" className="admin-modal-close" onClick={() => setEditing(null)}>&times;</button>
            </div>
            <div className="form-grid">
              {cfg.fields.map(f => (
                <div className={`form-field ${f.full ? 'full' : ''}`} key={f.key}>
                  {f.type === 'checkbox' ? (
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={!!form[f.key]}
                        onChange={e => setForm({ ...form, [f.key]: e.target.checked })}
                      />
                      {f.label}
                    </label>
                  ) : (
                    <>
                      <label>{f.label}{f.required && ' *'}</label>
                      {f.type === 'image' ? (
                        <ImageField
                          value={form[f.key] ?? ''}
                          required={f.required}
                          onChange={v => setForm({ ...form, [f.key]: v })}
                        />
                      ) : f.type === 'textarea' ? (
                        <textarea
                          rows={f.rows || 3}
                          value={form[f.key] ?? ''}
                          required={f.required}
                          onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        />
                      ) : f.type === 'select' ? (
                        <select
                          value={form[f.key] ?? ''}
                          onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        >
                          {f.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      ) : (
                        <input
                          type={f.type === 'number' ? 'number' : f.type === 'datetime-local' ? 'datetime-local' : 'text'}
                          value={form[f.key] ?? ''}
                          required={f.required}
                          onChange={e => setForm({ ...form, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value })}
                        />
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="admin-modal-footer">
              <button type="button" className="btn btn-outline" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// ==========================================
// Appointments — status updates + delete
// ==========================================

const APPOINTMENT_STATUSES = ['New', 'Contacted', 'Completed', 'Cancelled'];

const AppointmentsManager = () => {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    adminFetch('/appointments').then(setRows).catch(e => setError(e.message));
  }, []);

  useEffect(() => { load(); }, [load]);

  const setStatus = async (row, status) => {
    setError(null);
    try {
      await adminFetch(`/appointments/${row.id}`, { method: 'PUT', body: JSON.stringify({ status }) });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete appointment for "${row.child_name}"? This cannot be undone.`)) return;
    setError(null);
    try {
      await adminFetch(`/appointments/${row.id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (rows === null && !error) return <div className="admin-loading">Loading...</div>;

  return (
    <div className="admin-crud">
      <div className="crud-header"><h2>Manage Appointments</h2></div>
      {error && <div className="admin-error">{error}</div>}
      <div className="crud-table-wrapper">
        <table className="crud-table">
          <thead>
            <tr>
              <th>ID</th><th>Parent</th><th>Child</th><th>Phone</th><th>Preferred</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows && rows.length === 0 && (
              <tr><td colSpan="7" className="empty-row">No appointment requests yet.</td></tr>
            )}
            {rows && rows.map(row => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.parent_name}<br /><span className="cell-sub">{row.email}</span></td>
                <td>{row.child_name} ({row.child_age})</td>
                <td>{row.phone}</td>
                <td>{formatDate(row.preferred_date)}<br /><span className="cell-sub">{row.preferred_time}</span></td>
                <td>
                  <select
                    className={`status-select status-${String(row.status).toLowerCase()}`}
                    value={row.status}
                    onChange={e => setStatus(row, e.target.value)}
                  >
                    {APPOINTMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="actions-cell">
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// Site Settings editor
// ==========================================

const SettingsManager = () => {
  const [values, setValues] = useState(null);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminFetch('/settings').then(setValues).catch(e => setError(e.message));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await adminFetch('/settings', { method: 'PUT', body: JSON.stringify(values) });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (values === null && !error) return <div className="admin-loading">Loading...</div>;

  return (
    <div className="admin-crud">
      <div className="crud-header"><h2>Site Settings</h2></div>
      {error && <div className="admin-error">{error}</div>}
      {saved && <div className="admin-success">Settings saved.</div>}
      {values && (
        <form className="crud-table-wrapper settings-form" onSubmit={handleSave}>
          {Object.entries(values).map(([key, value]) => (
            <div className="form-field full" key={key}>
              <label>{key.replace(/_/g, ' ')}</label>
              <input
                type="text"
                value={value ?? ''}
                onChange={e => setValues({ ...values, [key]: e.target.value })}
              />
            </div>
          ))}
          <div className="admin-modal-footer">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

// ==========================================
// Change Password
// ==========================================

const ChangePassword = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    if (form.newPassword !== form.confirm) {
      setError('New passwords do not match');
      return;
    }
    if (form.newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }
    setSaving(true);
    try {
      await adminFetch('/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword })
      });
      setSaved(true);
      setForm({ currentPassword: '', newPassword: '', confirm: '' });
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-crud">
      <div className="crud-header"><h2>Change Password</h2></div>
      {error && <div className="admin-error">{error}</div>}
      {saved && <div className="admin-success">Password updated successfully.</div>}
      <form className="crud-table-wrapper settings-form" onSubmit={handleSave}>
        <div className="form-field full">
          <label>Current Password *</label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={form.currentPassword}
            onChange={e => setForm({ ...form, currentPassword: e.target.value })}
          />
        </div>
        <div className="form-field full">
          <label>New Password * (min 8 characters)</label>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={form.newPassword}
            onChange={e => setForm({ ...form, newPassword: e.target.value })}
          />
        </div>
        <div className="form-field full">
          <label>Confirm New Password *</label>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={form.confirm}
            onChange={e => setForm({ ...form, confirm: e.target.value })}
          />
        </div>
        <div className="admin-modal-footer">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
};

// ==========================================
// Shell
// ==========================================

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
          <NavLink to="/admin/dashboard/password" className={({isActive}) => isActive ? 'active' : ''}>Change Password</NavLink>
        </nav>
        <div className="admin-sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </aside>
      
      <main className="admin-main-content">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="doctors" element={<CrudManager key="doctors" resource="doctors" />} />
          <Route path="services" element={<CrudManager key="services" resource="services" />} />
          <Route path="gallery" element={<CrudManager key="gallery" resource="gallery" />} />
          <Route path="blogs" element={<CrudManager key="blogs" resource="blogs" />} />
          <Route path="testimonials" element={<CrudManager key="testimonials" resource="testimonials" />} />
          <Route path="appointments" element={<AppointmentsManager />} />
          <Route path="settings" element={<SettingsManager />} />
          <Route path="password" element={<ChangePassword />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;

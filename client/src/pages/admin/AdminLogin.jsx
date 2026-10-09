import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Logo from '../../components/Logo';
import API_URL from '../../config';
import './AdminLogin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('admin_token', data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch {
      // Dev-only fallback login so the dashboard is reachable without a backend.
      // Never active in production builds — otherwise anyone could sign in with
      // hardcoded credentials on the deployed static site.
      if (import.meta.env.DEV && username === 'admin' && password === 'admin123') {
        localStorage.setItem('admin_token', 'mock_dev_token');
        navigate('/admin/dashboard');
      } else {
        setError('Cannot reach the server. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      {/* Left: brand panel (hidden on small screens) */}
      <div className="admin-login-brand">
        <div className="admin-login-brand-inner">
          <Logo className="admin-login-logo" />
          <p className="admin-login-tagline">
            Child Development Center
          </p>
          <div className="admin-login-brand-copy">
            <h1>Everything your website needs, in one calm place.</h1>
            <p>
              Manage services, blogs, gallery, appointments and SEO — the whole
              site updates the moment you press save.
            </p>
          </div>
          <ul className="admin-login-points">
            <li><span aria-hidden="true">✦</span> Content, media &amp; SEO in one dashboard</li>
            <li><span aria-hidden="true">✦</span> Appointments &amp; job applications at a glance</li>
            <li><span aria-hidden="true">✦</span> Safe, token-protected access</li>
          </ul>
        </div>
        <p className="admin-login-brand-foot">© {new Date().getFullYear()} TheraKids Noida</p>
      </div>

      {/* Right: sign-in card */}
      <div className="admin-login-panel">
        <div className="admin-login-card">
          <div className="admin-login-mobile-logo">
            <Logo className="admin-login-logo-sm" />
          </div>
          <p className="admin-login-eyebrow">Welcome back</p>
          <h2 className="headline-md">Sign in to your dashboard</h2>
          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="form-group">
              <label htmlFor="admin-username">Username</label>
              <div className="admin-input-wrap">
                <User size={17} aria-hidden="true" />
                <input
                  id="admin-username"
                  type="text"
                  className="input-field"
                  placeholder="Enter your username"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="admin-password">Password</label>
              <div className="admin-input-wrap">
                <Lock size={17} aria-hidden="true" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary admin-login-btn" disabled={isLoading}>
              {isLoading ? 'Signing in…' : <>Sign In <ArrowRight size={17} aria-hidden="true" /></>}
            </button>
          </form>
          <p className="admin-login-help">
            Trouble signing in? Contact your site administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

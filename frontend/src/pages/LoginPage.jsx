
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const roles = [
  {
    id: 'student',
    title: 'Student',
    subtitle: 'Academic & campus services',
    icon: '🎓',
  },
  {
    id: 'faculty',
    title: 'Faculty',
    subtitle: 'Teaching & information',
    icon: '👨‍🏫',
  },
  {
    id: 'admin',
    title: 'Admin',
    subtitle: 'Campus operations',
    icon: '🛡️',
  },
];

const dashboardRoutes = {
  student: '/dashboard/student',
  faculty: '/dashboard/faculty',
  admin: '/dashboard/admin',
};

export default function LoginPage() {
  const navigate = useNavigate();

  const [role, setRole] = useState('student');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Demo notification popup
  const [showDemoPopup, setShowDemoPopup] = useState(true);

  function handleLogin(event) {
    event.preventDefault();

    const trimmedUserId = userId.trim();

    if (!trimmedUserId || !password.trim()) {
      setError('Please enter both your User ID and password.');
      return;
    }

    const dashboardPath = dashboardRoutes[role];

    if (!dashboardPath) {
      setError('Invalid account type selected.');
      return;
    }

    // Demo login only. Replace with backend authentication later.
    sessionStorage.setItem('demoRole', role);
    sessionStorage.setItem('demoUserId', trimmedUserId);

    navigate(dashboardPath);
  }

  return (
    <main className="login-page">

      {/* Demo Login Popup */}
      {showDemoPopup && (
        <div className="demo-popup-overlay">
          <div
            className="demo-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-popup-title"
          >
            <button
              type="button"
              className="demo-popup-close"
              onClick={() => setShowDemoPopup(false)}
              aria-label="Close notification"
            >
              ×
            </button>

            <div className="demo-popup-icon">ℹ</div>

            <h3 id="demo-popup-title">
              Demo Login Information
            </h3>

            <p>
              Type any username and any password to login.
            </p>

            <button
              type="button"
              className="demo-popup-button"
              onClick={() => setShowDemoPopup(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <header className="login-topbar">
        <button
          type="button"
          className="login-brand"
          onClick={() => navigate('/')}
        >
          <span className="login-brand-mark">C</span>
          <span>Campus Connect</span>
        </button>

        <button
          type="button"
          className="login-home-link"
          onClick={() => navigate('/')}
        >
          ← Back to home
        </button>
      </header>

      <section className="login-main">
        <div className="login-welcome-panel">
          <span className="login-eyebrow">
            YOUR CAMPUS, CONNECTED
          </span>

          <h1>
            One campus.
            <br />
            <span>Endless possibilities.</span>
          </h1>

          <p className="login-welcome-description">
            Your academic life, campus information and student services
            together in one simple experience.
          </p>

          <div className="login-benefits">
            <div className="login-benefit">
              <span>01</span>
              <div>
                <strong>Everything in one place</strong>
                <p>Notices, faculty, events and resources.</p>
              </div>
            </div>

            <div className="login-benefit">
              <span>02</span>
              <div>
                <strong>Built for your campus</strong>
                <p>Services tailored to your role.</p>
              </div>
            </div>

            <div className="login-benefit">
              <span>03</span>
              <div>
                <strong>AI-powered assistance</strong>
                <p>Find campus information more easily.</p>
              </div>
            </div>
          </div>

          <div className="login-decoration" aria-hidden="true">
            <span className="login-orbit login-orbit-one" />
            <span className="login-orbit login-orbit-two" />
            <span className="login-decoration-dot" />
          </div>

          <p className="login-panel-footer">
            LEARN · CONNECT · GROW
          </p>
        </div>

        <div className="login-form-panel">
          <div className="login-form-card">
            <span className="login-eyebrow">WELCOME BACK</span>

            <h2>Sign in to Campus Connect</h2>

            <p className="login-form-description">
              Select your account type to continue.
            </p>

            <div className="login-role-grid">
              {roles.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={`login-role-card ${
                    role === item.id ? 'selected' : ''
                  }`}
                  onClick={() => {
                    setRole(item.id);
                    setError('');
                  }}
                  aria-pressed={role === item.id}
                >
                  <span className="login-role-icon">
                    {item.icon}
                  </span>

                  <span className="login-role-title">
                    {item.title}
                  </span>

                  <span className="login-role-subtitle">
                    {item.subtitle}
                  </span>

                  <span className="login-role-check">
                    {role === item.id ? '✓' : ''}
                  </span>
                </button>
              ))}
            </div>

            <form className="login-form" onSubmit={handleLogin}>
              <label htmlFor="login-user-id">
                User ID
              </label>

              <input
                id="login-user-id"
                type="text"
                placeholder="Enter your User ID"
                autoComplete="username"
                value={userId}
                onChange={(event) => {
                  setUserId(event.target.value);
                  setError('');
                }}
                required
              />

              <div className="login-password-heading">
                <label htmlFor="login-password">
                  Password
                </label>
              </div>

              <div className="login-password-wrap">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError('');
                  }}
                  required
                />

                <button
                  type="button"
                  className="login-show-password"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={
                    showPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {error && (
                <p className="login-error" role="alert">
                  {error}
                </p>
              )}

              <button className="login-submit" type="submit">
                <span>
                  Sign in as{' '}
                  {roles.find((item) => item.id === role)?.title}
                </span>

                <span className="login-submit-arrow">→</span>
              </button>
            </form>

            <p className="login-demo-note">
              Demo mode: any non-empty User ID and password will work.
            </p>
          </div>
        </div>
      </section>

      <footer className="login-footer">
        <span>© Campus Connect · CampusOS AI</span>
        <span>Made for campus life.</span>
      </footer>
    </main>
  );
}

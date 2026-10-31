
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';

const services = [
  {
    title: 'Campus Notices',
    description: 'Stay updated with important campus announcements.',
    icon: '📢',
    path: '/notices',
    color: 'mint',
  },
  {
    title: 'My Timetable',
    description: 'Find your class schedule and academic resources.',
    icon: '🗓️',
    path: '/resources',
    color: 'blue',
  },
  {
    title: 'Faculty Directory',
    description: 'Discover faculty members and their departments.',
    icon: '👨‍🏫',
    path: '/faculty',
    color: 'purple',
  },
  {
    title: 'Departments',
    description: 'Explore academic departments and their information.',
    icon: '🏛️',
    path: '/departments',
    color: 'orange',
  },
  {
    title: 'My Complaints',
    description: 'Submit feedback and check complaint information.',
    icon: '📝',
    path: '/complaints',
    color: 'pink',
  },
  {
    title: 'AI Assistant',
    description: 'Ask questions about campus services and information.',
    icon: '🤖',
    path: '/ai-assistant',
    color: 'cyan',
  },
];

export default function StudentDashboard() {
  const navigate = useNavigate();

  const userId =
    sessionStorage.getItem('demoUserId') || 'Student';

  function openDashboard() {
    navigate('/dashboard/student');
  }

  function logout() {
    sessionStorage.removeItem('demoRole');
    sessionStorage.removeItem('demoUserId');

    navigate('/login', { replace: true });
  }

  return (
    <main className="student-dashboard">
      <header className="student-topbar">
        <button
          type="button"
          className="student-brand"
          onClick={openDashboard}
          aria-label="Go to Student Dashboard"
        >
          <span className="student-brand-mark">C</span>
          <span>Campus Connect</span>
        </button>

        <div className="student-user">
          <div className="student-avatar">
            {userId.charAt(0).toUpperCase()}
          </div>

          <div className="student-user-info">
            <strong>{userId}</strong>
            <span>Student Account</span>
          </div>

          <button
            type="button"
            className="student-logout"
            onClick={logout}
          >
            Log out
          </button>
        </div>
      </header>

      <div className="student-dashboard-content">
        <section className="student-welcome">
          <div className="student-welcome-copy">
            <span className="student-eyebrow">
              STUDENT PORTAL
            </span>

            <h1>
              Welcome back, <span>{userId}</span>!
            </h1>

            <p>
              Your campus life, all in one place. What would you
              like to explore today?
            </p>

            <button
              type="button"
              className="student-ai-button"
              onClick={() => navigate('/ai-assistant')}
            >
              <span>✦</span> Ask Campus AI <span>→</span>
            </button>
          </div>

          <div
            className="student-welcome-art"
            aria-hidden="true"
          >
            <div className="student-art-orbit" />
            <div className="student-art-cap">🎓</div>
            <div className="student-art-book">📚</div>
            <div className="student-art-main">✦</div>
          </div>
        </section>

        <section className="student-services-section">
          <div className="student-section-heading">
            <div>
              <span className="student-eyebrow">
                CAMPUS AT A GLANCE
              </span>
              <h2>Your Campus Services</h2>
            </div>

            <span className="student-service-count">
              {services.length} SERVICES
            </span>
          </div>

          <div className="student-services-grid">
            {services.map((service) => (
              <button
                type="button"
                className="student-service-card"
                key={service.title}
                onClick={() => navigate(service.path)}
              >
                <span
                  className={`student-service-icon ${service.color}`}
                >
                  {service.icon}
                </span>

                <span className="student-service-title">
                  {service.title}
                </span>

                <span className="student-service-description">
                  {service.description}
                </span>

                <span className="student-service-link">
                  Explore service <span>→</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="student-bottom-note">
          <span className="student-note-icon">✦</span>

          <div>
            <strong>Need help around campus?</strong>
            <p>
              Campus AI can help you find college information
              and services.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/ai-assistant')}
          >
            Chat now →
          </button>
        </section>

        <footer className="student-dashboard-footer">
          Campus Connect · CampusOS AI
          <span>Learn · Connect · Grow</span>
        </footer>
      </div>
    </main>
  );
}

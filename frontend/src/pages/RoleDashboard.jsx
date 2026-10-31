
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import './RoleDashboard.css';

const dashboardContent = {
  faculty: {
    title: 'Faculty Dashboard',
    description: 'Teaching, academic updates and campus information.',
    welcomeTitle: 'Manage your academic activities.',
    welcomeDescription: 'Publish notices and share important information.',
    cards: [
      {
        title: 'Publish Notices',
        description: 'Create and share academic announcements.',
        path: '/notices',
        icon: '📢',
      },
      {
        title: 'Timetable',
        description: 'Access timetable and academic resources.',
        path: '/resources',
        icon: '🗓️',
      },
      {
        title: 'Faculty Directory',
        description: 'Browse faculty and department information.',
        path: '/faculty',
        icon: '👨‍🏫',
      },
      {
        title: 'Campus Events',
        description: 'View upcoming campus events.',
        path: '/events',
        icon: '🎉',
      },
      {
        title: 'Departments',
        description: 'Explore department information.',
        path: '/departments',
        icon: '🏛️',
      },
      {
        title: 'AI Assistant',
        description: 'Get help finding campus information.',
        path: '/ai-assistant',
        icon: '🤖',
      },
    ],
  },

  admin: {
    title: 'Admin Dashboard',
    description: 'Manage campus services and administrative activities.',
    welcomeTitle: 'Keep campus operations running smoothly.',
    welcomeDescription: 'Review complaints and monitor campus information.',
    cards: [
      {
        title: 'Manage Complaints',
        description: 'Review complaints and track their resolution.',
        path: '/complaints',
        icon: '📝',
      },
      {
        title: 'Campus Notices',
        description: 'Review campus announcements.',
        path: '/notices',
        icon: '📢',
      },
      {
        title: 'Departments',
        description: 'Review department information.',
        path: '/departments',
        icon: '🏛️',
      },
      {
        title: 'Faculty Directory',
        description: 'Browse faculty information.',
        path: '/faculty',
        icon: '👨‍🏫',
      },
      {
        title: 'Campus Events',
        description: 'Review upcoming events.',
        path: '/events',
        icon: '🎉',
      },
      {
        title: 'Library',
        description: 'Access library information.',
        path: '/library',
        icon: '📚',
      },
      {
        title: 'Placements',
        description: 'Review placement information.',
        path: '/placements',
        icon: '💼',
      },
    ],
  },
};

export default function RoleDashboard() {
  const { role } = useParams();
  const navigate = useNavigate();

  const savedRole = sessionStorage.getItem('demoRole');
  const userId = sessionStorage.getItem('demoUserId');

  const content = dashboardContent[role];

  // Student uses the separate StudentDashboard component.
  if (role === 'student') {
    return <Navigate to="/dashboard/student" replace />;
  }

  if (!content || !userId || savedRole !== role) {
    return <Navigate to="/login" replace />;
  }

  function handleLogout() {
    sessionStorage.removeItem('demoRole');
    sessionStorage.removeItem('demoUserId');
    navigate('/login', { replace: true });
  }

  return (
    <section className="role-dashboard">
      <div className="role-dashboard-top">
        <div>
          <span className="role-dashboard-eyebrow">
            CAMPUS CONNECT
          </span>

          <h1>{content.title}</h1>
          <p>{content.description}</p>
        </div>

        <div className="role-dashboard-user">
          <span className="role-avatar">
            {role.charAt(0).toUpperCase()}
          </span>

          <div>
            <strong>{userId}</strong>
            <span>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
          </div>

          <button type="button" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>

      <div className="role-dashboard-welcome">
        <div>
          <span>WELCOME BACK</span>
          <h2>{content.welcomeTitle}</h2>
          <p>{content.welcomeDescription}</p>
        </div>

        <span className="role-welcome-icon">
          {role === 'faculty' ? '👨‍🏫' : '🛡️'}
        </span>
      </div>

      <h2 className="role-dashboard-section-title">
        {role === 'faculty' ? 'Teaching Services' : 'Administration Services'}
      </h2>

      <div className="role-dashboard-grid">
        {content.cards.map((card) => (
          <button
            type="button"
            className="role-service-card"
            key={card.title}
            onClick={() => navigate(card.path)}
          >
            <span className="role-service-icon">
              {card.icon}
            </span>

            <strong>{card.title}</strong>

            <span className="role-service-description">
              {card.description}
            </span>

            <span className="role-service-link">
              Open service →
            </span>
          </button>
        ))}
      </div>

      <p className="role-dashboard-demo-note">
        Demo mode: these dashboards provide navigation only.
        Notice publishing, complaint resolution and secure backend
        permissions will be implemented in the next steps.
      </p>
    </section>
  );
}

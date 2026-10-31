
import { NavLink } from 'react-router-dom';

const menuItems = [
  { label: 'Campus Guide', path: '/campus-guide' },
  { label: 'AI Assistant', path: '/ai-assistant' },
  { label: 'Notices', path: '/notices' },
  { label: 'Events', path: '/events' },
  { label: 'Departments', path: '/departments' },
  { label: 'Faculty', path: '/faculty' },
  { label: 'Admission Guide', path: '/admission' },
  { label: 'Resources', path: '/resources' },
  { label: 'Complaints', path: '/complaints' },
  { label: 'Placements', path: '/placements' },
  { label: 'Library', path: '/library' },
];

function Sidebar() {
  const role = sessionStorage.getItem('demoRole') || 'student';

  const dashboardPaths = {
    student: '/dashboard/student',
    faculty: '/dashboard/faculty',
    admin: '/dashboard/admin',
  };

  const dashboardPath =
    dashboardPaths[role] || '/dashboard/student';

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>Campus Connect</h2>
        <p>Campus Portal</p>
      </div>

      <p className="sidebar-section-label">MAIN MENU</p>

      <nav aria-label="Main navigation">
        <NavLink to={dashboardPath} end>
          Dashboard
        </NavLink>

        {menuItems.map((item) => (
          <NavLink key={item.path} to={item.path}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;


import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

function MainLayout() {
  const location = useLocation();

  const isAIAssistant = location.pathname === '/ai-assistant';
  const isCampusGuide = location.pathname === '/campus-guide';

  const layoutClasses = [
    'app-layout',
    isAIAssistant ? 'app-layout-ai' : '',
    isCampusGuide ? 'app-layout-campus-guide' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const contentClasses = [
    'page-content',
    isAIAssistant ? 'page-content-ai' : '',
    isCampusGuide ? 'page-content-campus-guide' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={layoutClasses}>
      <Sidebar />

      <div className="main-panel">
        <main className={contentClasses}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;

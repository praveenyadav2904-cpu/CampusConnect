
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import MainLayout from './layouts/MainLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RoleDashboard from './pages/RoleDashboard';
import StudentDashboard from './pages/StudentDashboard';

import Departments from './pages/Departments';
import Notices from './pages/Notices';
import Events from './pages/Events';
import Faculty from './pages/Faculty';
import Admission from './pages/Admission';
import Resources from './pages/Resources';
import Complaints from './pages/Complaints';
import Placements from './pages/Placements';
import Library from './pages/Library';
import AIAssistant from './pages/AIAssistant';
import CampusGuide from './pages/CampusGuide';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Campus Pages */}
        <Route element={<MainLayout />}>
          <Route
            path="/dashboard/student"
            element={<StudentDashboard />}
          />

          <Route
            path="/dashboard/:role"
            element={<RoleDashboard />}
          />

          {/* Campus Guide */}
          <Route
            path="/campus-guide"
            element={<CampusGuide />}
          />

          <Route path="/departments" element={<Departments />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/events" element={<Events />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/placements" element={<Placements />} />
          <Route path="/library" element={<Library />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
        </Route>

        {/* Unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

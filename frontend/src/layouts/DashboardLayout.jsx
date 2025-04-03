// layouts/DashboardLayout.jsx
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';

function DashboardLayout() {
  const { currentUser, logout } = useAuth();

  return (
    <div className="container-fluid p-0">
      <div className="row g-0 min-vh-100">
        <div className="col-md-3 col-lg-2 bg-light">
          <Sidebar />
        </div>
        <div className="col-md-9 col-lg-10">
          <Navbar />
          <main className="p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;

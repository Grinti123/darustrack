// components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';

function Navbar({ toggleSidebar }) {
  const { currentUser, logout, refreshToken } = useAuth();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRefreshToken = async () => {
    setIsRefreshing(true);
    toast.loading('Refreshing token...');
    try {
      await refreshToken();
      toast.dismiss();
      toast.success('Token refreshed successfully!');
    } catch (error) {
      toast.dismiss();
      toast.error(`Token refresh failed: ${error.message}`);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4 sticky-top">
      <div className="container-fluid">
        <button
          className="btn btn-sm d-lg-none me-3"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <i className="bi bi-list fs-4"></i>
        </button>

        <span className="navbar-brand d-md-none">DarusTrack</span>

        <button
          className="btn btn-sm btn-outline-secondary ms-2 d-none d-md-inline-flex align-items-center"
          onClick={handleRefreshToken}
          disabled={isRefreshing}
          title="Refresh Token"
        >
          <i className={`bi bi-arrow-clockwise ${isRefreshing ? 'animate-spin' : ''}`}></i>
          <span className="ms-1 d-none d-lg-inline">Refresh</span>
        </button>

        <div className="ms-auto d-flex align-items-center">
          <div className="dropdown">
            <button
              className="btn btn-light dropdown-toggle d-flex align-items-center"
              type="button"
              id="userDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div className="d-none d-md-block me-2">
                {currentUser?.name || 'User'}
              </div>
              <div className="avatar-sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                   style={{ width: '32px', height: '32px' }}>
                <span>{currentUser?.name?.charAt(0) || 'U'}</span>
              </div>
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li>
                <div className="dropdown-item-text d-md-none">
                  <strong>{currentUser?.name || 'User'}</strong>
                </div>
              </li>
              <li><hr className="dropdown-divider d-md-none" /></li>
              <li className="d-md-none">
                <button
                  className="dropdown-item d-flex align-items-center"
                  onClick={handleRefreshToken}
                  disabled={isRefreshing}
                >
                  <i className={`bi bi-arrow-clockwise me-2 ${isRefreshing ? 'animate-spin' : ''}`}></i>
                  Refresh Token
                </button>
              </li>
              <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
              <li><hr className="dropdown-divider" /></li>
              <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
`;
document.head.appendChild(styleSheet);

export default Navbar;

// components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Navbar({ toggleSidebar }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
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

export default Navbar;

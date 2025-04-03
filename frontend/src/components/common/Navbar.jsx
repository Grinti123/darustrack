// components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4">
      <div className="container-fluid">
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
              <span className="me-2">{currentUser?.name || 'User'}</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
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

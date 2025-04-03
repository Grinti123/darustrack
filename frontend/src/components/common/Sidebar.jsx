// components/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Sidebar() {
  const { userRole } = useAuth();
  const location = useLocation(); // This hook gives us the current location/route

  // Define menu items for each role
  const menuItems = {
    orang_tua: [
      { title: 'Dashboard', path: '/dashboard', icon: 'bi bi-grid' },
      { title: 'Informasi Kurikulum', path: '/curriculum', icon: 'bi bi-info-circle' },
      { title: 'Informasi Mata Pelajaran', path: '/subjects', icon: 'bi bi-book' },
      { title: 'Kehadiran', path: '/attendance', icon: 'bi bi-person-check' },
      { title: 'Penilaian Akademik', path: '/academic-assessment', icon: 'bi bi-award' },
      { title: 'Jadwal Mata Pelajaran', path: '/schedule', icon: 'bi bi-clock' },
      { title: 'Catatan Evaluasi Siswa', path: '/evaluation-notes', icon: 'bi bi-journal-text' }
    ],
    wali_kelas: [
      { title: 'Dashboard', path: '/dashboard', icon: 'bi bi-grid' },
      { title: 'Informasi Kurikulum', path: '/curriculum', icon: 'bi bi-info-circle' },
      { title: 'Informasi Mata Pelajaran', path: '/subjects', icon: 'bi bi-book' },
      { title: 'Kehadiran', path: '/attendance', icon: 'bi bi-person-check' },
      { title: 'Penilaian Akademik', path: '/academic-assessment', icon: 'bi bi-award' },
      { title: 'Jadwal Mata Pelajaran', path: '/schedule', icon: 'bi bi-clock' },
      { title: 'Catatan Evaluasi Siswa', path: '/evaluation-notes', icon: 'bi bi-journal-text' }
    ],
    admin: [
      { title: 'Dashboard', path: '/dashboard', icon: 'bi bi-grid' },
      { title: 'Informasi Kurikulum', path: '/curriculum', icon: 'bi bi-info-circle' },
      { title: 'Informasi Mata Pelajaran', path: '/subjects', icon: 'bi bi-book' },
      { title: 'Kelola Pengguna', path: '/user-management', icon: 'bi bi-people' },
      { title: 'Kelola Kelas', path: '/classes', icon: 'bi bi-building' }
    ],
    principal: [
      { title: 'Dashboard', path: '/dashboard', icon: 'bi bi-grid' },
      { title: 'Informasi Kurikulum', path: '/curriculum', icon: 'bi bi-info-circle' },
      { title: 'Informasi Penilaian Siswa', path: '/student-assessment', icon: 'bi bi-file-earmark-text' },
      { title: 'Informasi Mata Pelajaran', path: '/subjects', icon: 'bi bi-book' }
    ]
  };

  // Get menu items for current user role
  const currentMenuItems = menuItems[userRole] || [];

  return (
    <div className="sidebar bg-white p-3 shadow-sm h-100 position-sticky top-0" style={{overflowY: 'auto', maxHeight: '100vh'}}>
      <div className="text-center mb-4">
        <img src="../src/assets/logo.png" alt="DarusTrack Logo" height="50" />
        <h3 className="mt-2 text-primary">DarusTrack</h3>
      </div>

      <ul className="nav flex-column">
        {currentMenuItems.map((item, index) => {
          // Check if this menu item matches the current route
          const isActive = location.pathname === item.path;

          return (
            <li className="nav-item mb-2" key={index}>
              <Link
                to={item.path}
                className={`nav-link d-flex align-items-center ${isActive ? 'bg-primary text-white rounded' : 'text-dark'}`}
              >
                <i className={`${item.icon} me-2`}></i>
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;

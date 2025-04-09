// App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Curriculum from './pages/Curriculum'
import Calendar from './pages/Calendar'
import Subjects from './pages/Subjects'
import Attendance from './pages/Attendance'
import AcademicAssessment from './pages/AcademicAssessment'
import Schedule from './pages/Schedule'
import Evaluations from './pages/Evaluations'
import StudentAssessment from './pages/StudentAssessment'
import DashboardLayout from './layouts/DashboardLayout'
import UserManagement from './pages/UserManagement'
import SubjectManagement from './pages/SubjectManagement'
import ClassManagement from './pages/ClassManagement'
import SubjectDetail from './pages/SubjectDetail'

function App() {
  const { currentUser, userRole } = useAuth()

  // Protected route component
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!currentUser) {
      return <Navigate to="/login" replace />
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return <Navigate to="/dashboard" replace />
    }

    return children
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={
        <ProtectedRoute allowedRoles={['admin', 'wali_kelas', 'orang_tua', 'kepala_sekolah']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />

        {/* Common Routes */}
        <Route path="curriculum" element={<Curriculum />} />
        <Route path="subjects" element={
          <ProtectedRoute>
            <SubjectManagement />
          </ProtectedRoute>
        } />
        <Route path="subjects/:subjectId" element={
          <ProtectedRoute>
            <SubjectDetail />
          </ProtectedRoute>
        } />

        {/* Parent & Teacher & Admin Routes */}
        <Route path="calendar" element={
          <ProtectedRoute allowedRoles={['orang_tua', 'wali_kelas', 'admin']}>
            <Calendar />
          </ProtectedRoute>
        } />

        <Route path="attendance" element={
          <ProtectedRoute allowedRoles={['orang_tua', 'wali_kelas', 'admin']}>
            <Attendance />
          </ProtectedRoute>
        } />

        <Route path="schedule" element={
          <ProtectedRoute allowedRoles={['orang_tua', 'wali_kelas', 'admin']}>
            <Schedule />
          </ProtectedRoute>
        } />

        <Route path="evaluation-notes" element={
          <ProtectedRoute allowedRoles={['orang_tua', 'wali_kelas', 'admin']}>
            <Evaluations />
          </ProtectedRoute>
        } />

        {/* Parent & Teacher Routes */}
        <Route path="academic-assessment" element={
          <ProtectedRoute allowedRoles={['orang_tua', 'wali_kelas']}>
            <AcademicAssessment />
          </ProtectedRoute>
        } />

        {/* Admin-only Routes */}
        <Route path="user-management" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UserManagement />
          </ProtectedRoute>
        } />

        {/* Principal-only Routes */}
        <Route path="student-assessment" element={
          <ProtectedRoute allowedRoles={['kepala_sekolah']}>
            <StudentAssessment />
          </ProtectedRoute>
        } />

        <Route path="classes" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ClassManagement />
          </ProtectedRoute>
        } />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

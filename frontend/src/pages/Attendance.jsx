import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AttendanceForm from '../components/AttendanceForm';
import ParentAttendance from '../components/ParentAttendance';

const Attendance = () => {
  const { userRole } = useAuth();

  // Render different attendance components based on user role
  return (
    <div className="container py-4">
      {userRole === 'orang_tua' ? (
        <ParentAttendance />
      ) : (
        <AttendanceForm />
      )}
    </div>
  );
};

export default Attendance;

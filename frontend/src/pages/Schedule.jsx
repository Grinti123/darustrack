import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Schedule = () => {
  const { userRole } = useAuth();
  const [activeDay, setActiveDay] = useState('Senin');
  const [scheduleData, setScheduleData] = useState({});

  // Mock data - in a real app this would come from an API
  useEffect(() => {
    // Student schedule data
    const studentSchedule = {
      'Senin': [
        { subject: 'Matematika', timeStart: '07.15', timeEnd: '08.30' },
        { subject: 'Bahasa Indonesia', timeStart: '08.35', timeEnd: '10.00' },
        { subject: 'PPKN', timeStart: '10.30', timeEnd: '12.00' },
        { subject: 'Seni Budaya', timeStart: '13.00', timeEnd: '14.30' }
      ],
      'Selasa': [
        { subject: 'Bahasa Inggris', timeStart: '07.15', timeEnd: '08.30' },
        { subject: 'IPA', timeStart: '08.35', timeEnd: '10.00' },
        { subject: 'Penjas', timeStart: '10.30', timeEnd: '12.00' }
      ],
      'Rabu': [
        { subject: 'IPS', timeStart: '07.15', timeEnd: '08.30' },
        { subject: 'Matematika', timeStart: '08.35', timeEnd: '10.00' },
        { subject: 'Agama', timeStart: '10.30', timeEnd: '12.00' }
      ],
      'Kamis': [
        { subject: 'Bahasa Indonesia', timeStart: '07.15', timeEnd: '08.30' },
        { subject: 'IPA', timeStart: '08.35', timeEnd: '10.00' },
        { subject: 'Prakarya', timeStart: '10.30', timeEnd: '12.00' }
      ],
      'Jumat': [
        { subject: 'Matematika', timeStart: '07.15', timeEnd: '08.30' },
        { subject: 'Bahasa Inggris', timeStart: '08.35', timeEnd: '10.00' }
      ],
      'Sabtu': [
        { subject: 'Komputer', timeStart: '07.15', timeEnd: '08.30' },
        { subject: 'Muatan Lokal', timeStart: '08.35', timeEnd: '10.00' }
      ]
    };

    // Teacher schedule data - classes to teach
    const teacherSchedule = {
      'Senin': [
        {
          subject: 'Matematika',
          timeStart: '07.15',
          timeEnd: '08.30',
          class: 'Kelas 5A'
        },
        {
          subject: 'Matematika',
          timeStart: '10.30',
          timeEnd: '12.00',
          class: 'Kelas 6B'
        }
      ],
      'Selasa': [
        {
          subject: 'Matematika',
          timeStart: '08.35',
          timeEnd: '10.00',
          class: 'Kelas 6A'
        }
      ],
      'Rabu': [
        {
          subject: 'Matematika',
          timeStart: '08.35',
          timeEnd: '10.00',
          class: 'Kelas 5B'
        }
      ],
      'Kamis': [
        {
          subject: 'Matematika',
          timeStart: '13.00',
          timeEnd: '14.30',
          class: 'Kelas 6C'
        }
      ],
      'Jumat': [
        {
          subject: 'Matematika',
          timeStart: '07.15',
          timeEnd: '08.30',
          class: 'Kelas 5C'
        }
      ],
      'Sabtu': []
    };

    // Set appropriate schedule based on user role
    if (userRole === 'teacher') {
      setScheduleData(teacherSchedule);
    } else {
      setScheduleData(studentSchedule);
    }
  }, [userRole]);

  // Define colors for each day
  const dayColors = {
    'Senin': 'primary',
    'Selasa': 'success',
    'Rabu': 'purple',
    'Kamis': 'danger',
    'Jumat': 'warning',
    'Sabtu': 'secondary'
  };

  // Custom CSS for the purple button (since Bootstrap doesn't have a purple variant by default)
  const purpleButtonStyle = {
    backgroundColor: activeDay === 'Rabu' ? '#6f42c1' : 'transparent',
    borderColor: '#6f42c1',
    color: activeDay === 'Rabu' ? 'white' : '#6f42c1'
  };

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  return (
    <div className="container py-4">
      <h2 className="mb-4">Jadwal Pelajaran</h2>

      {/* Day tabs with different colors */}
      <div className="d-flex mb-4 overflow-auto">
        {days.map((day) => (
          <button
            key={day}
            className={`btn me-2 ${
              day === 'Rabu'
                ? 'border'
                : activeDay === day
                  ? `btn-${dayColors[day]}`
                  : `btn-outline-${dayColors[day]}`
            }`}
            style={day === 'Rabu' ? purpleButtonStyle : {}}
            onClick={() => setActiveDay(day)}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Schedule content */}
      <div className="card">
        <div className="card-body">
          <h4 className={`card-title text-${dayColors[activeDay]} mb-4`}>{activeDay}</h4>

          {scheduleData[activeDay] && scheduleData[activeDay].length > 0 ? (
            scheduleData[activeDay].map((schedule, index) => (
              <div
                key={index}
                className="card mb-3 border-0 shadow-sm"
              >
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">{schedule.subject}</h5>
                    {userRole === 'teacher' && (
                      <div className="text-muted small">{schedule.class}</div>
                    )}
                  </div>
                  <div className="text-end">
                    <span className="badge bg-light text-dark p-2">
                      {schedule.timeStart} - {schedule.timeEnd}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted py-4">
              No schedule for this day
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule;

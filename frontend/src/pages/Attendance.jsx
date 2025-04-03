import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { teachersAPI } from '../utils/api';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const Attendance = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewType, setViewType] = useState('daily');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role === 'wali_kelas') {
      fetchAttendance();
    }
  }, [selectedDate, user]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const response = await teachersAPI.getAttendance(formattedDate);
      setStudents(response.data);
    } catch (err) {
      setError('Gagal mengambil data kehadiran');
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (studentId, status) => {
    if (user?.role !== 'wali_kelas') return;

    try {
      setLoading(true);
      setError(null);
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const updatedStudents = students.map(student =>
        student.id === studentId ? { ...student, status } : student
      );

      await teachersAPI.saveAttendance(formattedDate, updatedStudents);
      setStudents(updatedStudents);
    } catch (err) {
      setError('Gagal menyimpan kehadiran');
      console.error('Error saving attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (user?.role !== 'wali_kelas') return;

    try {
      setLoading(true);
      setError(null);
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      await teachersAPI.saveAttendance(formattedDate, students);
    } catch (err) {
      setError('Gagal menyimpan kehadiran');
      console.error('Error saving attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusButtonClass = (status, buttonType) => {
    if (status !== buttonType) return '';

    switch (buttonType) {
      case 'hadir':
        return 'active bg-primary text-white';
      case 'izin':
        return 'active bg-warning text-white';
      case 'sakit':
        return 'active bg-danger text-white';
      default:
        return '';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'hadir':
        return <span className="badge bg-primary">Hadir</span>;
      case 'izin':
        return <span className="badge bg-warning">Izin</span>;
      case 'sakit':
        return <span className="badge bg-danger">Sakit</span>;
      default:
        return <span className="badge bg-secondary">-</span>;
    }
  };

  const renderDailyView = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Kehadiran Siswa</h2>
        <div className="d-flex align-items-center gap-2">
          <input
            type="date"
            className="form-control"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
          />
          {user?.role === 'wali_kelas' && (
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th width="5%">No.</th>
                  <th>Nama</th>
                  <th width="30%" className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student.id}>
                    <td>{index + 1}.</td>
                    <td>{student.name}</td>
                    <td>
                      {user?.role === 'wali_kelas' ? (
                        <div className="d-flex gap-1 justify-content-center">
                          <button
                            className={`btn btn-sm ${getStatusButtonClass(student.status, 'hadir')}`}
                            onClick={() => handleStatusChange(student.id, 'hadir')}
                          >
                            Hadir
                          </button>
                          <button
                            className={`btn btn-sm ${getStatusButtonClass(student.status, 'izin')}`}
                            onClick={() => handleStatusChange(student.id, 'izin')}
                          >
                            Izin
                          </button>
                          <button
                            className={`btn btn-sm ${getStatusButtonClass(student.status, 'sakit')}`}
                            onClick={() => handleStatusChange(student.id, 'sakit')}
                          >
                            Sakit
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          {getStatusBadge(student.status)}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );

  const renderHistoryView = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Riwayat Kehadiran</h2>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th width="5%">No.</th>
                  <th>Hari/Tanggal</th>
                  <th width="20%" className="text-center">Kehadiran</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student.id}>
                    <td>{index + 1}.</td>
                    <td>{format(new Date(student.date), 'EEEE, d MMMM yyyy', { locale: id })}</td>
                    <td className="text-center">
                      {getStatusBadge(student.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>Rows per page: <select className="form-select form-select-sm d-inline-block w-auto">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select></div>
            <nav aria-label="Page navigation">
              <ul className="pagination pagination-sm mb-0">
                <li className="page-item"><button className="page-link">&lt;</button></li>
                <li className="page-item active"><button className="page-link">1</button></li>
                <li className="page-item"><button className="page-link">2</button></li>
                <li className="page-item"><button className="page-link">...</button></li>
                <li className="page-item"><button className="page-link">10</button></li>
                <li className="page-item"><button className="page-link">11</button></li>
                <li className="page-item"><button className="page-link">&gt;</button></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="container py-4">
      <div className="mb-4">
        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn ${viewType === 'daily' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewType('daily')}
          >
            Kehadiran Harian
          </button>
          <button
            type="button"
            className={`btn ${viewType === 'history' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewType('history')}
          >
            Riwayat Kehadiran
          </button>
        </div>
      </div>

      {viewType === 'daily' ? renderDailyView() : renderHistoryView()}
    </div>
  );
};

export default Attendance;

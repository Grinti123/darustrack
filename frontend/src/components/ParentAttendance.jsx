import React, { useState, useEffect } from 'react';
import { parentsAPI } from '../utils/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const ParentAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [filterDate, setFilterDate] = useState('');

  // Status color mapping
  const statusColors = {
    'hadir': { bg: 'bg-success', text: 'Hadir' },
    'alpha': { bg: 'bg-danger', text: 'Alpha' },
    'izin': { bg: 'bg-warning', text: 'Izin' },
    'sakit': { bg: 'bg-info', text: 'Sakit' }
  };

  // Month options for filter
  const getMonthOptions = () => {
    const months = [];
    const currentDate = new Date();

    // Generate 12 months back from current date
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthValue = format(date, 'yyyy-MM');
      const monthLabel = format(date, 'MMMM yyyy');
      months.push({ value: monthValue, label: monthLabel });
    }

    return months;
  };

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await parentsAPI.getAttendance({ month: selectedMonth });

      // Validate response
      if (!response) {
        throw new Error('No data received from server');
      }

      // Extract attendance data from response
      const attendanceRecords = Array.isArray(response) ? response :
                              response.attendances ? response.attendances :
                              response.data ? response.data : [];

      if (!Array.isArray(attendanceRecords)) {
        throw new Error('Invalid attendance data format');
      }

      // Process and validate each record
      const processedData = attendanceRecords
        .filter(item => item && typeof item === 'object' && item.date)
        .map(item => ({
          id: item.id || `attendance-${Math.random()}`,
          date: item.date,
          status: (item.status || 'unknown').toLowerCase(),
          note: item.note || '-',
          created_at: item.created_at
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      console.log('Processed attendance data:', processedData);
      setAttendanceData(processedData);

    } catch (err) {
      console.error('Attendance fetch error:', err);
      setError(err.message || 'Gagal memuat data kehadiran');
      toast.error('Gagal memuat data kehadiran: ' + (err.message || 'Unknown error'));
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMonth) {
      fetchAttendanceData();
    }
  }, [selectedMonth]);

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'EEEE, dd MMMM yyyy');
    } catch (error) {
      return dateString || '-';
    }
  };

  // Filter attendance data by date
  const filteredAttendance = filterDate
    ? attendanceData.filter(item => item.date.includes(filterDate))
    : attendanceData;

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleDateFilterChange = (e) => {
    setFilterDate(e.target.value);
  };

  const handleRefresh = () => {
    fetchAttendanceData();
  };

  // Attendance statistics
  const attendanceStats = attendanceData.reduce((stats, item) => {
    const status = item.status || 'unknown';
    stats[status] = (stats[status] || 0) + 1;
    stats.total += 1;
    return stats;
  }, { hadir: 0, alpha: 0, izin: 0, sakit: 0, total: 0 });

  // Calculate attendance percentage
  const attendancePercentage = attendanceStats.total > 0
    ? Math.round((attendanceStats.hadir / attendanceStats.total) * 100)
    : 0;

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Ringkasan Kehadiran</h5>

              <div className="row justify-content-between align-items-center mb-4">
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="monthFilter" className="form-label">Bulan</label>
                    <select
                      id="monthFilter"
                      className="form-select"
                      value={selectedMonth}
                      onChange={handleMonthChange}
                    >
                      {getMonthOptions().map(month => (
                        <option key={month.value} value={month.value}>{month.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="dateFilter" className="form-label">Filter Tanggal</label>
                    <input
                      type="text"
                      className="form-control"
                      id="dateFilter"
                      placeholder="contoh: 2023-06"
                      value={filterDate}
                      onChange={handleDateFilterChange}
                    />
                  </div>
                </div>
                <div className="col-md-4 d-flex align-items-end justify-content-end">
                  <button
                    className="btn btn-outline-primary"
                    onClick={handleRefresh}
                    disabled={loading}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i> Refresh
                  </button>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-3">
                  <div className="card border-0 bg-light">
                    <div className="card-body text-center">
                      <h6 className="text-muted mb-2">Kehadiran</h6>
                      <h2 className="mb-0 text-success">{attendancePercentage}%</h2>
                    </div>
                  </div>
                </div>
                <div className="col-md-9">
                  <div className="row g-2">
                    <div className="col-md-3">
                      <div className="card h-100 border-0 bg-success bg-opacity-10">
                        <div className="card-body text-center">
                          <h6 className="text-muted mb-2">Hadir</h6>
                          <h3 className="mb-0 text-success">{attendanceStats.hadir}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card h-100 border-0 bg-danger bg-opacity-10">
                        <div className="card-body text-center">
                          <h6 className="text-muted mb-2">Alpha</h6>
                          <h3 className="mb-0 text-danger">{attendanceStats.alpha}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card h-100 border-0 bg-warning bg-opacity-10">
                        <div className="card-body text-center">
                          <h6 className="text-muted mb-2">Izin</h6>
                          <h3 className="mb-0 text-warning">{attendanceStats.izin}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card h-100 border-0 bg-info bg-opacity-10">
                        <div className="card-body text-center">
                          <h6 className="text-muted mb-2">Sakit</h6>
                          <h3 className="mb-0 text-info">{attendanceStats.sakit}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              ) : filteredAttendance.length === 0 ? (
                <div className="alert alert-info" role="alert">
                  <i className="bi bi-info-circle me-2"></i>
                  Tidak ada data kehadiran untuk periode yang dipilih.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th scope="col" style={{ width: '50px' }}>No</th>
                        <th scope="col">Tanggal</th>
                        <th scope="col">Status</th>
                        <th scope="col">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAttendance.map((attendance, index) => (
                        <tr key={attendance.id || index}>
                          <td>{index + 1}</td>
                          <td>{formatDate(attendance.date)}</td>
                          <td>
                            <span className={`badge ${statusColors[attendance.status]?.bg || 'bg-secondary'}`}>
                              {statusColors[attendance.status]?.text || attendance.status || 'Unknown'}
                            </span>
                          </td>
                          <td>{attendance.note || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentAttendance;

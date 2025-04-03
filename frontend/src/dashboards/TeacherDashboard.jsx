import React, { useState, useEffect } from 'react'
import ClassAttendanceChart from '../components/ClassAttendanceChart'
import ClassPerformanceChart from '../components/ClassPerformanceChart'

function TeacherDashboard() {
  const [classData, setClassData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulating API call to get class data
    setTimeout(() => {
      setClassData({
        className: '2A',
        totalStudents: 32,
        attendanceRate: 94,
        averageGrade: 85.2,
        students: [
          { id: 1, name: 'Andre Setiawan', attendance: 98, grade: 87, status: 'active' },
          { id: 2, name: 'Budi Santoso', attendance: 90, grade: 82, status: 'active' },
          { id: 3, name: 'Citra Ayu', attendance: 96, grade: 91, status: 'active' },
          { id: 4, name: 'Deni Kurniawan', attendance: 85, grade: 78, status: 'warning' },
          { id: 5, name: 'Elsa Putri', attendance: 88, grade: 84, status: 'active' },
          { id: 6, name: 'Fandi Ahmad', attendance: 92, grade: 89, status: 'active' },
        ],
        subjects: [
          { name: 'Matematika', averageScore: 83.5 },
          { name: 'IPA', averageScore: 87.2 },
          { name: 'Bahasa', averageScore: 85.8 },
          { name: 'IPS', averageScore: 84.3 },
          { name: 'Seni Budaya', averageScore: 90.1 },
        ],
        assignments: [
          { id: 1, title: 'PR Matematika', dueDate: 'Maret 15, 2025', submitted: 28, total: 32 },
          { id: 2, title: 'Praktek IPA', dueDate: 'Maret 22, 2025', submitted: 15, total: 32 },
          { id: 3, title: 'Essai Bahasa Inggris', dueDate: 'Maret 18, 2025', submitted: 22, total: 32 },
        ]
      })
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading || !classData) {
    return <div className="alert alert-info">Memuat Data Kelas...</div>
  }

  return (
    <div>
      <div className="row">
        <div className="col-md-6 col-lg-3 mb-4">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Total Siswa</h5>
              <p className="display-4">{classData.totalStudents}</p>
              <p className="card-text">Kelas Hari Ini: {classData.className}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 mb-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Tingkat Kehadiran</h5>
              <p className="display-4">{classData.attendanceRate}%</p>
              <p className="card-text">Rata-Rata Bulan Lalu</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 mb-4">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">Rata-Rata Nilai</h5>
              <p className="display-4">{classData.averageGrade}</p>
              <p className="card-text">Semester Ini</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 mb-4">
          <div className="card bg-warning text-dark">
            <div className="card-body">
              <h5 className="card-title">Siswa Beresiko</h5>
              <p className="display-4">{classData.students.filter(s => s.status === 'warning').length}</p>
              <p className="card-text">Butuh Perhatian</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">Kehadiran Kelas</h5>
            </div>
            <div className="card-body">
              <ClassAttendanceChart />
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">Kinerja Mata Pelajaran</h5>
            </div>
            <div className="card-body">
              <ClassPerformanceChart subjects={classData.subjects} />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8 mb-4">
          <div className="card">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Ringkasan Siswa</h5>
              <button className="btn btn-sm btn-outline-primary">Lihat Semua Siswa</button>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                <thead>
                    <tr>
                      <th>Nama</th>
                      <th>Kehadiran</th>
                      <th>Rata-Rata Nilai</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classData.students.map((student) => (
                      <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="progress flex-grow-1" style={{ height: '6px' }}>
                              <div
                                className={`progress-bar ${student.attendance > 90 ? 'bg-success' : 'bg-warning'}`}
                                role="progressbar"
                                style={{ width: `${student.attendance}%` }}
                                aria-valuenow={student.attendance}
                                aria-valuemin="0"
                                aria-valuemax="100"
                              ></div>
                            </div>
                            <span className="ms-2">{student.attendance}%</span>
                          </div>
                        </td>
                        <td>{student.grade}</td>
                        <td>
                          {student.status === 'active' ? (
                            <span className="badge bg-success">Aktif</span>
                          ) : (
                            <span className="badge bg-warning">Butuh Perhatian</span>
                          )}
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-1">
                            <i className="bi bi-eye"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-secondary">
                            <i className="bi bi-pencil"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">Pekerjaan Rumah</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {classData.assignments.map((assignment) => (
                  <li key={assignment.id} className="list-group-item px-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{assignment.title}</h6>
                        <small className="text-muted">Due: {assignment.dueDate}</small>
                      </div>
                      <span className="badge bg-primary">{assignment.submitted}/{assignment.total}</span>
                    </div>
                    <div className="progress mt-2" style={{ height: '6px' }}>
                      <div
                        className="progress-bar bg-info"
                        role="progressbar"
                        style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }}
                        aria-valuenow={(assignment.submitted / assignment.total) * 100}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="d-grid mt-3">
                <button className="btn btn-outline-primary">Tambah Tugas Baru</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherDashboard

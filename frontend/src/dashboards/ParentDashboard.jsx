import React from 'react'
import StudentProgressChart from '../components/StudentProgressChart'
import AttendanceChart from '../components/AttendaceChart'

function ParentDashboard({ student }) {
  return (
    <div>
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avatar-lg me-3 bg-light rounded-circle d-flex align-items-center justify-content-center">
                  <span className="display-6 text-primary">{student.name.charAt(0)}</span>
                </div>
                <div>
                  <h4 className="mb-1">{student.name}</h4>
                  <p className="text-muted mb-0">Kelas {student.class}</p>
                </div>
              </div>
              <hr />
              <div className="mb-3">
                <p className="mb-1 text-muted">Wali Kelas</p>
                <p className="fw-bold mb-0">{student.homeRoomTeacher}</p>
              </div>
              <div className="mb-3">
                <p className="mb-1 text-muted">Tanggal Lahir</p>
                <p className="fw-bold mb-0">{student.birthDate}</p>
              </div>
              <div className="mb-3">
                <p className="mb-1 text-muted">Tingkah Laku</p>
                <p className="fw-bold mb-0">{student.behavior}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card h-100">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">Proses Akademis</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <StudentProgressChart />
                </div>
                <div className="col-md-6">
                  <AttendanceChart attendance={student.attendance} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-7">
          <div className="card">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Nilai Terakhir</h5>
              <a href="/academic-assessment" className="btn btn-sm btn-outline-primary">Lihat Semua</a>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Mapel</th>
                      <th>Nilai</th>
                      <th>Skor</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.recentGrades.map((grade, index) => (
                      <tr key={index}>
                        <td>{grade.subject}</td>
                        <td>{grade.grade}</td>
                        <td>{grade.score}</td>
                        <td>
                          {grade.score >= 90 ? (
                            <span className="badge bg-success">Sempurna</span>
                          ) : grade.score >= 80 ? (
                            <span className="badge bg-primary">Baik</span>
                          ) : (
                            <span className="badge bg-warning">Perlu Perubahan</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div className="card">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">Tugas</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {student.upcomingTests.map((test, index) => (
                  <li key={index} className="list-group-item px-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{test.subject}</h6>
                        <small className="text-muted">{test.topic}</small>
                      </div>
                      <span className="badge bg-light text-dark">{test.date}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParentDashboard

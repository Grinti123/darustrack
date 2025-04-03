import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

function Profile() {
  const { userRole } = useAuth()
  const [student, setStudent] = useState(null)

  useEffect(() => {
    // Simulating API call to get student data
    if (userRole === 'parent') {
      setStudent({
        name: 'Andre Setiawan',
        birthDate: '1 Desember 2017',
        class: '2 A',
        homeRoomTeacher: 'Budiono Sp.d'
      })
    }
  }, [userRole])

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-primary">Profile</h2>

              {userRole === 'parent' && student && (
                <div className="mt-4">
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Nama</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {student.name}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Tanggal Lahir</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {student.birthDate}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Kelas</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {student.class}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Wali Kelas</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {student.homeRoomTeacher}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title text-primary">Informasi Akademik</h5>
              <ul className="list-group mt-3">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Rata-rata Nilai
                  <span className="badge bg-primary rounded-pill">85.4</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Kehadiran
                  <span className="badge bg-success rounded-pill">97%</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Peringkat Kelas
                  <span className="badge bg-info rounded-pill">8</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

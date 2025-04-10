import React, { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const StudentAssessment = () => {
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [classDetail, setClassDetail] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('https://darustrack-backend-production.up.railway.app/headmaster/classes', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch classes')
      }

      const data = await response.json()
      console.log('Fetched classes:', data)
      setClasses(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching classes:', err)
      setError('Gagal mengambil data kelas')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchClassDetail = async (classId) => {
    try {
      setIsLoadingDetail(true)
      const response = await fetch(`https://darustrack-backend-production.up.railway.app/headmaster/classes/${classId}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch class detail')
      }

      const data = await response.json()
      console.log('Fetched class detail:', data)
      setClassDetail(data)
      setSelectedClass(classId)
      setError(null)
    } catch (err) {
      console.error('Error fetching class detail:', err)
      setError('Gagal mengambil detail kelas')
    } finally {
      setIsLoadingDetail(false)
    }
  }

  const handleCloseDetail = () => {
    setSelectedClass(null)
    setClassDetail(null)
  }

  // Chart options and data for subject averages
  const subjectChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Rata-rata Mata Pelajaran',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  }

  // Chart options for student rankings
  const studentChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Peringkat Siswa',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  }

  // Prepare chart data when classDetail changes
  const getSubjectChartData = () => {
    if (!classDetail?.subject_averages) return null

    return {
      labels: classDetail.subject_averages.map(subject => subject.subject_name),
      datasets: [
        {
          label: 'Rata-rata Nilai',
          data: classDetail.subject_averages.map(subject => subject.average_score),
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          borderColor: 'rgb(53, 162, 235)',
          borderWidth: 1,
        },
      ],
    }
  }

  const getStudentChartData = () => {
    if (!classDetail?.student_ranks) return null

    return {
      labels: classDetail.student_ranks.map(student => student.name),
      datasets: [
        {
          label: 'Nilai Rata-rata',
          data: classDetail.student_ranks.map(student => student.average_score),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1,
        },
      ],
    }
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
      </div>
    )
  }

  return (
    <div className="container py-4">
      {!selectedClass ? (
        <>
          <h2 className="mb-4">Daftar Kelas</h2>
          <div className="row">
            {classes.map((classItem) => (
              <div key={classItem.id} className="col-md-4 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">Kelas {classItem.name}</h5>
                    <div className="mt-3">
                      <p className="mb-2">
                        <strong>Jumlah Siswa:</strong> {classItem.total_students}
                      </p>
                      <p className="mb-2">
                        <strong>Tingkat:</strong> {classItem.grade_level}
                      </p>
                    </div>
                    <button
                      className="btn btn-primary mt-2"
                      onClick={() => fetchClassDetail(classItem.id)}
                    >
                      Lihat Detail
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h3 className="mb-0">Detail Kelas</h3>
            <button
              className="btn btn-outline-secondary"
              onClick={handleCloseDetail}
            >
              Kembali
            </button>
          </div>
          <div className="card-body">
            {isLoadingDetail ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : classDetail && (
              <div>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <h4 className="card-title mb-3">Informasi Kelas {classDetail.class_name}</h4>
                        <div className="mb-2">
                          <strong>ID Kelas:</strong> {classDetail.class_id}
                        </div>
                        <div className="mb-2">
                          <strong>Tingkat:</strong> {classDetail.grade_level}
                        </div>
                        <div className="mb-2">
                          <strong>Jumlah Siswa:</strong> {classDetail.total_students}
                        </div>
                        <div className="mb-2">
                          <strong>Rata-rata Kelas:</strong> {classDetail.class_average}
                        </div>
                        <div className="mb-2">
                          <strong>Persentase Kehadiran:</strong> {classDetail.attendance_percentage}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="row mb-4">
                  {/* Subject Averages Chart */}
                  <div className="col-md-6 mb-4">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title mb-3">Grafik Rata-rata Mata Pelajaran</h5>
                        {getSubjectChartData() && (
                          <Bar options={subjectChartOptions} data={getSubjectChartData()} />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Student Rankings Chart */}
                  <div className="col-md-6 mb-4">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title mb-3">Grafik Peringkat Siswa</h5>
                        {getStudentChartData() && (
                          <Bar options={studentChartOptions} data={getStudentChartData()} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Existing tables section */}
                <div className="row">
                  {/* Student Ranks Table */}
                  <div className="col-md-6 mb-4">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title mb-3">Peringkat Siswa</h5>
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th>Nama Siswa</th>
                                <th>Rata-rata Nilai</th>
                              </tr>
                            </thead>
                            <tbody>
                              {classDetail.student_ranks?.map((student, index) => (
                                <tr key={student.id}>
                                  <td>{student.name}</td>
                                  <td>{student.average_score}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subject Averages Table */}
                  <div className="col-md-6 mb-4">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title mb-3">Rata-rata Mata Pelajaran</h5>
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th>Mata Pelajaran</th>
                                <th>Rata-rata</th>
                              </tr>
                            </thead>
                            <tbody>
                              {classDetail.subject_averages?.map((subject, index) => (
                                <tr key={subject.subject_id}>
                                  <td>{subject.subject_name}</td>
                                  <td>{subject.average_score}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentAssessment

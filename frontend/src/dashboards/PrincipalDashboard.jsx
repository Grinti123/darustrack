import React, { useState, useEffect } from 'react'
import AcademicPerformanceChart from '../components/AcademicPerformanceChart'
import AttendanceTrendChart from '../components/AttendanceTrendChart'
import GradeDistributionChart from '../components/GradeDistributionChart'

function PrincipalDashboard() {
  const [schoolData, setSchoolData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulating API call to get school data
    setTimeout(() => {
      setSchoolData({
        schoolAverage: 82.7,
        bestClass: { name: '4A', average: 89.2 },
        attendanceRate: 96,
        teacherPerformance: 4.2,
        classAverages: [
          { class: '1A', average: 83.4, students: 22 },
          { class: '1B', average: 81.7, students: 21 },
          { class: '2A', average: 84.5, students: 23 },
          { class: '2B', average: 82.8, students: 22 },
          { class: '3A', average: 85.6, students: 24 },
          { class: '3B', average: 83.1, students: 23 },
          { class: '4A', average: 89.2, students: 20 },
          { class: '4B', average: 86.5, students: 21 },
          { class: '5A', average: 80.9, students: 19 },
          { class: '5B', average: 79.5, students: 20 },
        ],
        teacherEvaluations: [
          { name: 'Teacher A', rating: 4.8, students: 23, subject: 'Mathematics' },
          { name: 'Teacher B', rating: 4.5, students: 22, subject: 'Science' },
          { name: 'Teacher C', rating: 4.6, students: 24, subject: 'Language' },
          { name: 'Teacher D', rating: 4.0, students: 21, subject: 'Social Studies' },
          { name: 'Teacher E', rating: 4.7, students: 20, subject: 'Physical Education' },
        ],
        attendanceTrend: [
          { month: 'Sep', attendance: 97.5 },
          { month: 'Oct', attendance: 96.8 },
          { month: 'Nov', attendance: 95.2 },
          { month: 'Dec', attendance: 94.5 },
          { month: 'Jan', attendance: 93.8 },
          { month: 'Feb', attendance: 95.6 },
          { month: 'Mar', attendance: 96.0 },
        ]
      })
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading || !schoolData) {
    return <div className="alert alert-info">Loading school data...</div>
  }

  return (
    <div>
      <div className="row">
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="card-title">School Average</h5>
                  <p className="display-4">{schoolData.schoolAverage}</p>
                  <p className="card-text">All classes</p>
                </div>
                <div className="bg-white rounded-circle p-2">
                  <i className="bi bi-bar-chart-line text-primary fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="card-title">Best Class</h5>
                  <p className="display-4">{schoolData.bestClass.name}</p>
                  <p className="card-text">Average: {schoolData.bestClass.average}</p>
                </div>
                <div className="bg-white rounded-circle p-2">
                  <i className="bi bi-trophy text-success fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="card-title">Attendance Rate</h5>
                  <p className="display-4">{schoolData.attendanceRate}%</p>
                  <p className="card-text">School average</p>
                </div>
                <div className="bg-white rounded-circle p-2">
                  <i className="bi bi-calendar-check text-info fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8 mb-4">
          <div className="card h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Academic Performance</h5>
              <div className="dropdown">
                <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" id="periodDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  Current Term
                </button>
                <ul className="dropdown-menu" aria-labelledby="periodDropdown">
                  <li><a className="dropdown-item" href="#">Current Term</a></li>
                  <li><a className="dropdown-item" href="#">Previous Term</a></li>
                  <li><a className="dropdown-item" href="#">Last Year</a></li>
                </ul>
              </div>
            </div>
            <div className="card-body">
              <AcademicPerformanceChart />
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">Attendance Trend</h5>
            </div>
            <div className="card-body">
              <AttendanceTrendChart attendanceData={schoolData.attendanceTrend} />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Class Averages</h5>
              <button className="btn btn-sm btn-outline-primary">View Details</button>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Class</th>
                      <th>Students</th>
                      <th>Average</th>
                      <th>Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schoolData.classAverages.map((cls) => (
                      <tr key={cls.class}>
                        <td><strong>{cls.class}</strong></td>
                        <td>{cls.students}</td>
                        <td>{cls.average}</td>
                        <td>
                          <div className="progress" style={{ height: '6px' }}>
                            <div
                              className={`progress-bar ${cls.average >= 85 ? 'bg-success' : cls.average >= 80 ? 'bg-primary' : 'bg-warning'}`}
                              role="progressbar"
                              style={{ width: `${cls.average}%` }}
                              aria-valuenow={cls.average}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">Teacher Evaluations</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Teacher</th>
                      <th>Subject</th>
                      <th>Rating</th>
                      <th>Students</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schoolData.teacherEvaluations.map((teacher, index) => (
                      <tr key={index}>
                        <td>{teacher.name}</td>
                        <td>{teacher.subject}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="me-2">{teacher.rating}</div>
                            <div>
                              {Array(5).fill(0).map((_, i) => (
                                <i key={i} className={`bi bi-star${i < Math.floor(teacher.rating) ? '-fill' : i < teacher.rating ? '-half' : ''} text-warning`}></i>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td>{teacher.students}</td>
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
  )
}

export default PrincipalDashboard

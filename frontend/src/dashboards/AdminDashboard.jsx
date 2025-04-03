import React, { useState, useEffect } from 'react'
import SchoolStatsChart from '../components/SchoolStatsChart'
import EnrollmentTrendChart from '../components/EnrollmentTrendChart'

function AdminDashboard() {
  const [schoolData, setSchoolData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulating API call to get school data
    setTimeout(() => {
      setSchoolData({
        totalStudents: 512,
        totalTeachers: 48,
        totalClasses: 24,
        totalParents: 486,
        recentEnrollments: 12,
        recentWithdrawals: 3,
        teacherAttendance: 96.5,
        studentAttendance: 93.2,
        classDistribution: [
          { grade: '1', count: 4, students: 84 },
          { grade: '2', count: 5, students: 112 },
          { grade: '3', count: 5, students: 103 },
          { grade: '4', count: 4, students: 96 },
          { grade: '5', count: 3, students: 65 },
          { grade: '6', count: 3, students: 52 },
        ],
        recentIncidents: [
          { id: 1, type: 'Facility', description: 'Water leak in Science Lab', status: 'pending', date: 'March 12, 2025' },
          { id: 2, type: 'Behavioral', description: 'Student conflict in Grade 4', status: 'resolved', date: 'March 10, 2025' },
          { id: 3, type: 'Technical', description: 'Computer lab network issue', status: 'in-progress', date: 'March 11, 2025' },
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
        <div className="col-md-6 col-lg-3 mb-4">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="card-title">Total Students</h5>
                  <p className="display-4">{schoolData.totalStudents}</p>
                </div>
                <div className="bg-white rounded-circle p-2">
                  <i className="bi bi-mortarboard text-primary fs-4"></i>
                </div>
              </div>
              <div className="mt-3 d-flex align-items-center">
                <span className={schoolData.recentEnrollments > schoolData.recentWithdrawals ? "text-success" : "text-danger"}>
                  <i className={`bi ${schoolData.recentEnrollments > schoolData.recentWithdrawals ? "bi-arrow-up" : "bi-arrow-down"}`}></i>
                  {Math.abs(schoolData.recentEnrollments - schoolData.recentWithdrawals)}
                </span>
                <span className="ms-2">since last month</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 mb-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="card-title">Total Teachers</h5>
                  <p className="display-4">{schoolData.totalTeachers}</p>
                </div>
                <div className="bg-white rounded-circle p-2">
                  <i className="bi bi-person-workspace text-success fs-4"></i>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-light">
                  {schoolData.teacherAttendance}% attendance rate
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 mb-4">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="card-title">Total Classes</h5>
                  <p className="display-4">{schoolData.totalClasses}</p>
                </div>
                <div className="bg-white rounded-circle p-2">
                  <i className="bi bi-house-door text-info fs-4"></i>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-light">
                  Avg {Math.round(schoolData.totalStudents / schoolData.totalClasses)} students per class
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 mb-4">
          <div className="card bg-warning text-dark">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="card-title">Total Parents</h5>
                  <p className="display-4">{schoolData.totalParents}</p>
                </div>
                <div className="bg-white rounded-circle p-2">
                  <i className="bi bi-people text-warning fs-4"></i>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-dark">
                  {Math.round((schoolData.totalParents / schoolData.totalStudents) * 100)}% student coverage
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8 mb-4">
          <div className="card h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Enrollment Trends</h5>
              <div className="btn-group" role="group">
                <button type="button" className="btn btn-sm btn-outline-secondary active">Week</button>
                <button type="button" className="btn btn-sm btn-outline-secondary">Month</button>
                <button type="button" className="btn btn-sm btn-outline-secondary">Year</button>
              </div>
            </div>
            <div className="card-body">
              <EnrollmentTrendChart />
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">Class Distribution</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Grade</th>
                      <th>Classes</th>
                      <th>Students</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schoolData.classDistribution.map((grade) => (
                      <tr key={grade.grade}>
                        <td>Grade {grade.grade}</td>
                        <td>{grade.count}</td>
                        <td>{grade.students}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">School Statistics</h5>
            </div>
            <div className="card-body">
              <SchoolStatsChart />
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">Recent Incidents</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schoolData.recentIncidents.map((incident) => (
                      <tr key={incident.id}>
                        <td>
                          <span className={`badge ${
                            incident.type === 'Facility' ? 'bg-info' :
                            incident.type === 'Behavioral' ? 'bg-warning' : 'bg-secondary'
                          }`}>
                            {incident.type}
                          </span>
                        </td>
                        <td>{incident.description}</td>
                        <td>{incident.date}</td>
                        <td>
                          <span className={`badge ${
                            incident.status === 'resolved' ? 'bg-success' :
                            incident.status === 'pending' ? 'bg-warning' : 'bg-primary'
                          }`}>
                            {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-grid mt-3">
                <button className="btn btn-outline-primary">View All Incidents</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

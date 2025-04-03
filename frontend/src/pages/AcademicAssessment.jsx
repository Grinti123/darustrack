import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AcademicAssessment = () => {
  const { userRole } = useAuth();
  const isTeacher = userRole === 'teacher';
  const isParent = userRole === 'parent';

  // Sample data for subjects and grades
  const [subjects, setSubjects] = useState([
    {
      id: 1,
      name: 'Matematika',
      icon: '🧮',
      color: '#e3f2fd',
      assessments: {
        quiz: { icon: '💬', color: '#e8f5e9', grades: [85, 90, 78] },
        tugas: { icon: '📚', color: '#e0f7fa', grades: [90, 85, 95] },
        uts: { icon: '📝', color: '#fff8e1', grades: [78] },
        uas: { icon: '📋', color: '#f3e5f5', grades: [88] }
      }
    },
    {
      id: 2,
      name: 'IPA (Ilmu Pengetahuan Alam)',
      icon: '🌱',
      color: '#e8f5e9',
      assessments: {
        quiz: { icon: '💬', color: '#e8f5e9', grades: [82, 75, 80] },
        tugas: { icon: '📚', color: '#e0f7fa', grades: [88, 90, 85] },
        uts: { icon: '📝', color: '#fff8e1', grades: [75] },
        uas: { icon: '📋', color: '#f3e5f5', grades: [80] }
      }
    },
    {
      id: 3,
      name: 'IPS (Ilmu Pengetahuan Sosial)',
      icon: '🌐',
      color: '#e0f2f1',
      assessments: {
        quiz: { icon: '💬', color: '#e8f5e9', grades: [78, 85, 80] },
        tugas: { icon: '📚', color: '#e0f7fa', grades: [85, 88, 82] },
        uts: { icon: '📝', color: '#fff8e1', grades: [80] },
        uas: { icon: '📋', color: '#f3e5f5', grades: [82] }
      }
    },
    {
      id: 4,
      name: 'PPKN (Pendidikan Pancasila dan Kewarganegaraan)',
      icon: '🦅',
      color: '#fff3e0',
      assessments: {
        quiz: { icon: '💬', color: '#e8f5e9', grades: [90, 85, 92] },
        tugas: { icon: '📚', color: '#e0f7fa', grades: [88, 90, 85] },
        uts: { icon: '📝', color: '#fff8e1', grades: [85] },
        uas: { icon: '📋', color: '#f3e5f5', grades: [92] }
      }
    },
    {
      id: 5,
      name: 'Bahasa Indonesia',
      icon: '📝',
      color: '#ffebee',
      assessments: {
        quiz: { icon: '💬', color: '#e8f5e9', grades: [88, 85, 90] },
        tugas: { icon: '📚', color: '#e0f7fa', grades: [90, 92, 88] },
        uts: { icon: '📝', color: '#fff8e1', grades: [85] },
        uas: { icon: '📋', color: '#f3e5f5', grades: [87] }
      }
    },
    {
      id: 6,
      name: 'Bahasa Inggris',
      icon: '🔤',
      color: '#e8eaf6',
      assessments: {
        quiz: { icon: '💬', color: '#e8f5e9', grades: [75, 78, 80] },
        tugas: { icon: '📚', color: '#e0f7fa', grades: [80, 85, 75] },
        uts: { icon: '📝', color: '#fff8e1', grades: [72] },
        uas: { icon: '📋', color: '#f3e5f5', grades: [78] }
      }
    },
  ]);

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [editingGrade, setEditingGrade] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Go back to all subjects
  const backToSubjects = () => {
    setSelectedSubject(null);
    setSelectedAssessment(null);
  };

  // Go back to subject assessments
  const backToAssessments = () => {
    setSelectedAssessment(null);
  };

  // Select a subject to view its assessments
  const viewSubject = (subjectId) => {
    setSelectedSubject(subjectId);
    setSelectedAssessment(null);
  };

  // Select an assessment to view its details
  const viewAssessment = (assessmentType) => {
    setSelectedAssessment(assessmentType);
  };

  // Function to determine grade color based on score
  const getGradeColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 80) return 'text-primary';
    if (score >= 70) return 'text-warning';
    return 'text-danger';
  };

  // Start editing a grade (for teachers only)
  const startEdit = (index, currentValue) => {
    if (!isTeacher) return;
    setEditingGrade(index);
    setEditValue(currentValue.toString());
  };

  // Save the edited grade
  const saveGrade = () => {
    if (editingGrade === null || !selectedSubject || !selectedAssessment) return;

    // Validate input
    const value = parseInt(editValue);
    if (isNaN(value) || value < 0 || value > 100) {
      alert("Please enter a valid grade (0-100)");
      return;
    }

    // Update the grade
    setSubjects(prevSubjects =>
      prevSubjects.map(subject => {
        if (subject.id === selectedSubject) {
          const newGrades = [...subject.assessments[selectedAssessment].grades];
          newGrades[editingGrade] = value;

          return {
            ...subject,
            assessments: {
              ...subject.assessments,
              [selectedAssessment]: {
                ...subject.assessments[selectedAssessment],
                grades: newGrades
              }
            }
          };
        }
        return subject;
      })
    );

    // Exit edit mode
    setEditingGrade(null);
    setEditValue("");

    // In a real app, you would make an API call here to save the changes
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingGrade(null);
    setEditValue("");
  };

  // Handle saving when Enter is pressed
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveGrade();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  // Calculate average grade for an assessment type
  const calculateAverage = (grades) => {
    if (!grades || grades.length === 0) return 0;
    const sum = grades.reduce((acc, grade) => acc + grade, 0);
    return Math.round(sum / grades.length);
  };

  // Get the currently selected subject object
  const currentSubject = selectedSubject ? subjects.find(s => s.id === selectedSubject) : null;

  // Get assessment translation
  const getAssessmentTitle = (type) => {
    switch (type) {
      case 'quiz': return 'Quiz';
      case 'tugas': return 'Tugas';
      case 'uts': return 'UTS (Ujian Tengah Semester)';
      case 'uas': return 'UAS (Ujian Akhir Semester)';
      default: return type;
    }
  };

  // Get assessment icons
  const getAssessmentIcon = (type) => {
    switch (type) {
      case 'quiz': return 'quiz';
      case 'tugas': return 'assignment';
      case 'uts': return 'description';
      case 'uas': return 'fact_check';
      default: return 'question_mark';
    }
  };

  return (
    <div className="container py-4">
      {/* Header with role indicators and dropdown */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          {selectedSubject && (
            <button
              className="btn btn-sm btn-outline-secondary me-3"
              onClick={selectedAssessment ? backToAssessments : backToSubjects}
            >
              <i className="bi bi-arrow-left"></i> {selectedAssessment ? 'Kembali ke Penilaian' : 'Semua Mata Pelajaran'}
            </button>
          )}
          <h2 className="m-0">
            {selectedAssessment && currentSubject
              ? `${getAssessmentTitle(selectedAssessment)} - ${currentSubject.name}`
              : selectedSubject && currentSubject
                ? `Penilaian Akademik - ${currentSubject.name}`
                : 'Penilaian Akademik'
            }
          </h2>
        </div>
        <div className="d-flex align-items-center">
          <div className="dropdown">
            <button
              className="btn btn-outline-primary dropdown-toggle"
              type="button"
              id="termSelect"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Semester Ganjil 2024/2025
            </button>
            <ul className="dropdown-menu" aria-labelledby="termSelect">
              <li><a className="dropdown-item" href="#">Semester Ganjil 2024/2025</a></li>
              <li><a className="dropdown-item" href="#">Semester Genap 2023/2024</a></li>
              <li><a className="dropdown-item" href="#">Semester Ganjil 2023/2024</a></li>
            </ul>
          </div>
        </div>
      </div>

      {isTeacher && selectedAssessment && (
        <div className="alert alert-info mb-4">
          <i className="bi bi-info-circle me-2"></i>
          Klik pada nilai untuk mengedit. Tekan Enter untuk menyimpan atau Escape untuk membatalkan.
        </div>
      )}

      {/* Main content area */}
      <div className="row">
        {/* Show subjects list */}
        {!selectedSubject && subjects.map((subject) => (
          <div className="col-12 mb-3" key={subject.id}>
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div
                      className="subject-icon me-3 p-2 rounded"
                      style={{
                        backgroundColor: subject.color,
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem'
                      }}
                    >
                      <span>{subject.icon}</span>
                    </div>
                    <h5 className="mb-0">{subject.name}</h5>
                  </div>

                  <div>
                    <button
                      className="btn btn-light btn-sm me-2"
                      onClick={() => viewSubject(subject.id)}
                    >
                      Detail
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Show assessment categories for a selected subject */}
        {selectedSubject && !selectedAssessment && currentSubject && (
          <>
            {Object.keys(currentSubject.assessments).map((assessmentType) => (
              <div className="col-12 mb-3" key={assessmentType}>
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <div
                          className="assessment-icon me-3 p-2 rounded"
                          style={{
                            backgroundColor: currentSubject.assessments[assessmentType].color,
                            width: '50px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem'
                          }}
                        >
                          <span>{currentSubject.assessments[assessmentType].icon}</span>
                        </div>
                        <h5 className="mb-0">{getAssessmentTitle(assessmentType)}</h5>
                      </div>

                      <div>
                        <button
                          className="btn btn-light btn-sm me-2"
                          onClick={() => viewAssessment(assessmentType)}
                        >
                          Detail
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Show detailed grades for a selected assessment */}
        {selectedSubject && selectedAssessment && currentSubject && (
          <>
            {/* Show average assessment grade */}
            <div className="col-12 mb-4">
              <div className="card bg-light">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <h4 className="card-title mb-0">Nilai Rata-rata: {getAssessmentTitle(selectedAssessment)}</h4>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center justify-content-end">
                        <h2 className={`mb-0 ${getGradeColor(calculateAverage(currentSubject.assessments[selectedAssessment].grades))}`}>
                          {calculateAverage(currentSubject.assessments[selectedAssessment].grades)}
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Show individual assessment grades */}
            <div className="col-12">
              <div className="card">
              <div className="card-header">
                  <h5 className="mb-0">Detail Nilai</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>No.</th>
                          <th>Tanggal</th>
                          <th>Judul</th>
                          <th>Nilai</th>
                          {isTeacher && <th>Aksi</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {currentSubject.assessments[selectedAssessment].grades.map((grade, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              {/* Placeholder dates - in a real app, you would store these with the grades */}
                              {new Date(2024, 0, 15 + (index * 7)).toLocaleDateString('id-ID')}
                            </td>
                            <td>{`${getAssessmentTitle(selectedAssessment)} ${index + 1}`}</td>
                            <td>
                              {editingGrade === index ? (
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onKeyDown={handleKeyDown}
                                  min="0"
                                  max="100"
                                  autoFocus
                                />
                              ) : (
                                <span
                                  className={`${getGradeColor(grade)} ${isTeacher ? 'editable-grade' : ''}`}
                                  onClick={() => startEdit(index, grade)}
                                  style={isTeacher ? { cursor: 'pointer' } : {}}
                                >
                                  {grade}
                                </span>
                              )}
                            </td>
                            {isTeacher && (
                              <td>
                                {editingGrade === index ? (
                                  <>
                                    <button className="btn btn-sm btn-success me-1" onClick={saveGrade}>
                                      <i className="bi bi-check"></i>
                                    </button>
                                    <button className="btn btn-sm btn-danger" onClick={cancelEdit}>
                                      <i className="bi bi-x"></i>
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => startEdit(index, grade)}
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </button>
                                )}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {isTeacher && (
                  <div className="card-footer">
                    <button className="btn btn-primary">
                      <i className="bi bi-plus"></i> Tambah Nilai Baru
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer area with summary information */}
      {selectedSubject && !selectedAssessment && currentSubject && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Ringkasan Nilai</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {Object.keys(currentSubject.assessments).map((assessmentType) => {
                    const average = calculateAverage(currentSubject.assessments[assessmentType].grades);
                    return (
                      <div className="col-md-3 mb-3" key={assessmentType}>
                        <div className="card h-100">
                          <div className="card-body text-center">
                            <h5 className="card-title">{getAssessmentTitle(assessmentType)}</h5>
                            <p className={`display-4 mb-0 ${getGradeColor(average)}`}>
                              {average}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Teacher controls */}
      {isTeacher && selectedSubject && selectedAssessment && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Catatan Guru</h5>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label>Catatan untuk siswa:</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Masukkan catatan atau saran untuk siswa..."
                  ></textarea>
                </div>
                <div className="form-check mt-3">
                  <input className="form-check-input" type="checkbox" id="notifyParents" />
                  <label className="form-check-label" htmlFor="notifyParents">
                    Kirim notifikasi ke orang tua
                  </label>
                </div>
                <button className="btn btn-primary mt-3">
                  Simpan Catatan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicAssessment;

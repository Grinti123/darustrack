import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { teachersAPI } from '../utils/api';
import { toast } from 'react-toastify';

const EvaluationNotes = () => {
  const { userRole } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [evaluations, setEvaluations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [viewingEvaluation, setViewingEvaluation] = useState(null);
  const [evaluationDetails, setEvaluationDetails] = useState(null);
  const [newNote, setNewNote] = useState({
    title: ''
  });
  // Add a new state to track the current view
  const [currentView, setCurrentView] = useState('list'); // 'list', 'details', 'student'

  const isWaliKelas = userRole === 'wali_kelas';

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    try {
      setLoading(true);
      const response = await teachersAPI.getEvaluations();
      console.log('Fetched evaluations:', response);
      setEvaluations(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error('Error fetching evaluations:', err);
      toast.error('Gagal mengambil data evaluasi');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleSaveNew = async (e) => {
    e.preventDefault();
    try {
      if (!newNote.title) {
        toast.error('Judul evaluasi harus diisi');
        return;
      }

      const response = await teachersAPI.createEvaluation(newNote);
      console.log('API Response:', response);
      setIsAdding(false);
      setNewNote({ title: '' });
      toast.success(response.message || 'Evaluasi berhasil ditambahkan');
      fetchEvaluations(); // Refresh the list
    } catch (err) {
      console.error('Error adding evaluation:', err);
      toast.error(err.message || 'Gagal menambahkan evaluasi');
    }
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewNote({ title: '' });
  };

  const handleEdit = (evaluation) => {
    setEditingId(evaluation.id);
    setEditTitle(evaluation.title);
  };

  const handleUpdate = async (id) => {
    try {
      if (!editTitle.trim()) {
        toast.error('Judul evaluasi harus diisi');
        return;
      }

      await teachersAPI.updateEvaluation(id, { title: editTitle });
      toast.success('Evaluasi berhasil diperbarui');
      setEditingId(null);
      fetchEvaluations();
    } catch (err) {
      console.error('Error updating evaluation:', err);
      toast.error(err.message || 'Gagal memperbarui evaluasi');
    }
  };

  const handleViewDetails = async (evaluation) => {
    try {
      setLoading(true);
      setViewingEvaluation(evaluation);
      const response = await teachersAPI.getEvaluationById(evaluation.id);
      console.log('Evaluation details:', response);
      setEvaluationDetails(response);
      // Change view to details page
      setCurrentView('details');
    } catch (err) {
      console.error('Error fetching evaluation details:', err);
      toast.error('Gagal mengambil detail evaluasi');
    } finally {
      setLoading(false);
    }
  };

  const handleEditStudentDescription = async (student, evaluationId) => {
    try {
      setLoading(true);
      // Get the latest student evaluation data
      const studentEval = await teachersAPI.getStudentEvaluation(
        evaluationId || selectedEvaluation?.id || evaluationDetails?.id,
        student.id || student.student_id
      );
      console.log('Student evaluation details:', studentEval);

      setEditingStudent(student);
      // Use the description from the API response if available
      setEditDescription(studentEval?.description || student.description || '');
      // Change to student edit view
      setCurrentView('student');
    } catch (err) {
      console.error('Error fetching student evaluation:', err);
      toast.error('Gagal mengambil data evaluasi siswa');
      // Fall back to using the description from the student object
      setEditingStudent(student);
      setEditDescription(student.description || '');
      setCurrentView('student');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStudentDescription = async (evaluationId, studentId) => {
    try {
      setLoading(true);
      console.log('Saving description for evaluation:', evaluationId, 'student:', studentId);
      if (!editDescription.trim()) {
        setEditDescription('');
      }

      if (!evaluationId) {
        toast.error('ID evaluasi tidak ditemukan');
        return;
      }

      await teachersAPI.updateStudentEvaluation(
        evaluationId,
        studentId,
        { description: editDescription }
      );

      toast.success('Deskripsi berhasil diperbarui');

      // Refresh evaluation details
      const updatedDetails = await teachersAPI.getEvaluationById(evaluationId);
      setEvaluationDetails(updatedDetails);

      // Return to details view
      setEditingStudent(null);
      setCurrentView('details');
    } catch (err) {
      console.error('Error updating student description:', err);
      toast.error('Gagal memperbarui deskripsi: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleViewStudents = async (evaluation) => {
    try {
      setLoading(true);
      setSelectedEvaluation(evaluation);
      const response = await teachersAPI.getStudentEvaluations(evaluation.id);
      setStudents(response || []);
      // For non-wali_kelas, we continue using the modal
      if (!isWaliKelas) {
        // The modal will be shown automatically since selectedEvaluation is set
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      toast.error('Gagal mengambil data siswa');
    } finally {
      setLoading(false);
    }
  };

  const handleEditDescription = (student) => {
    setEditingStudent(student);
    setEditDescription(student.description || '');
  };

  const handleUpdateDescription = async () => {
    try {
      setLoading(true);
      await teachersAPI.updateStudentEvaluation(
        selectedEvaluation.id,
        editingStudent.id,
        { description: editDescription }
      );
      toast.success('Deskripsi berhasil diperbarui');
      setEditingStudent(null);
      // Refresh student list
      handleViewStudents(selectedEvaluation);
    } catch (err) {
      console.error('Error updating description:', err);
      toast.error('Gagal memperbarui deskripsi');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus evaluasi ini?')) {
      try {
        setLoading(true);
        await teachersAPI.deleteEvaluation(id);
        toast.success('Evaluasi berhasil dihapus');
        // Return to list view if we were viewing the deleted evaluation
        if (viewingEvaluation?.id === id || selectedEvaluation?.id === id) {
          setViewingEvaluation(null);
          setSelectedEvaluation(null);
          setCurrentView('list');
        }
        fetchEvaluations();
      } catch (err) {
        console.error('Error deleting evaluation:', err);
        toast.error(err.message || 'Gagal menghapus evaluasi');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBackToList = () => {
    setViewingEvaluation(null);
    setEvaluationDetails(null);
    setSelectedEvaluation(null);
    setEditingStudent(null);
    setCurrentView('list');
  };

  const handleBackToDetails = () => {
    setEditingStudent(null);
    setCurrentView('details');
  };

  // Render evaluation list view
  const renderEvaluationList = () => {
    return (
      <>
        <div className="row mb-4">
          <div className="col">
            <h2> Catatan Evaluasi</h2>
          </div>
          {isWaliKelas && (
            <div className="col-auto">
              <button
                className="btn btn-primary"
                onClick={handleAddClick}
                disabled={isAdding}
              >
                <i className="bi bi-plus"></i> Tambah Catatan
              </button>
            </div>
          )}
        </div>

        {/* Add title form */}
        {isAdding && (
          <div className="card mb-4">
            <div className="card-body">
              <form onSubmit={handleSaveNew}>
                <div className="mb-3">
                  <label htmlFor="noteTitle" className="form-label">Judul Evaluasi</label>
                  <input
                    type="text"
                    className="form-control"
                    id="noteTitle"
                    value={newNote.title}
                    onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                    required
                    placeholder="Masukkan judul evaluasi"
                  />
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancelAdd}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Evaluations List */}
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : evaluations.length > 0 ? (
          <div className="row">
            {evaluations.map((evaluation) => (
              <div key={`eval-${evaluation.id}`} className="col-12 mb-3">
                <div className="card">
                  <div className="card-body">
                    {editingId === evaluation.id ? (
                      <div className="d-flex gap-2">
                        <input
                          type="text"
                          className="form-control"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Masukkan judul baru"
                        />
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleUpdate(evaluation.id)}
                        >
                          Simpan
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditingId(null)}
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <>
                        <h5 className="card-title">{evaluation.title}</h5>
                        <div className="d-flex justify-content-between align-items-center">
                          <p className="card-text text-muted mb-0">
                            ID: {evaluation.id}
                          </p>
                          <div className="btn-group">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => handleEdit(evaluation)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-outline-info btn-sm"
                              onClick={() => handleViewDetails(evaluation)}
                            >
                              Detail
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDelete(evaluation.id)}
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info">
            Belum ada evaluasi
          </div>
        )}

        {/* Student List Modal - Only shown for non-wali_kelas users */}
        {!isWaliKelas && selectedEvaluation && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Daftar Siswa - {selectedEvaluation.title}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setSelectedEvaluation(null);
                      setStudents([]);
                      setEditingStudent(null);
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  {students.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Nama Siswa</th>
                            <th>Deskripsi</th>
                            <th>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student) => (
                            <tr key={`list-${student.id}`}>
                              <td>{student.name}</td>
                              <td>
                                {editingStudent?.id === student.id ? (
                                  <div className="d-flex gap-2">
                                    <textarea
                                      className="form-control"
                                      value={editDescription}
                                      onChange={(e) => setEditDescription(e.target.value)}
                                      rows="2"
                                    />
                                    <div className="d-flex flex-column gap-1">
                                      <button
                                        className="btn btn-success btn-sm"
                                        onClick={handleUpdateDescription}
                                      >
                                        Simpan
                                      </button>
                                      <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => setEditingStudent(null)}
                                      >
                                        Batal
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  student.description || '-'
                                )}
                              </td>
                              <td>
                                {editingStudent?.id !== student.id && (
                                  <button
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() => handleEditDescription(student)}
                                  >
                                    Edit Deskripsi
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="alert alert-info">
                      Belum ada data siswa
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  // Render evaluation details view
  const renderEvaluationDetails = () => {
    if (!evaluationDetails) return null;

    return (
      <div className="container py-4">
        <div className="d-flex align-items-center mb-4">
          <button
            className="btn btn-link text-decoration-none p-0 me-3"
            onClick={handleBackToList}
            style={{ color: '#000', fontSize: '1rem' }}
          >
            ← Kembali ke Daftar Evaluasi
          </button>
          <h2 className="mb-0">Detail Evaluasi: {evaluationDetails.title}</h2>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-12 mb-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Daftar Siswa</h5>
                </div>
                <div className="card-body">
                  {evaluationDetails.students && Array.isArray(evaluationDetails.students) && evaluationDetails.students.length > 0 ? (
                    <div className="list-group">
                      {evaluationDetails.students.map((student) => (
                        <div key={`detail-${student.id || student.student_id}`} className="list-group-item d-flex justify-content-between align-items-center">
                          <div className="ms-2 me-auto">
                            <div className="fw-bold">{student.name || student.student_name}</div>
                            <small className="text-muted">{student.description ? `"${student.description}"` : "Belum ada deskripsi"}</small>
                          </div>
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              const evalId = evaluationDetails?.id;
                              console.log('Editing student with evalId:', evalId);
                              handleEditStudentDescription(student, evalId);
                            }}
                          >
                            Edit Deskripsi
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="alert alert-info">
                      Belum ada data siswa
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render student description edit view
  const renderStudentEdit = () => {
    if (!editingStudent) return null;

    return (
      <div className="container py-4">
        <div className="d-flex align-items-center mb-4">
          <button
            className="btn btn-link text-decoration-none p-0 me-3"
            onClick={handleBackToDetails}
            style={{ color: '#000', fontSize: '1rem' }}
          >
            ← Kembali ke Detail Evaluasi
          </button>
          <h2 className="mb-0">Edit Deskripsi Siswa</h2>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                {editingStudent.name || editingStudent.student_name}
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <label className="form-label">Deskripsi Evaluasi</label>
                <textarea
                  className="form-control"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows="6"
                  placeholder="Masukkan deskripsi evaluasi untuk siswa ini"
                ></textarea>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    const evalId = evaluationDetails?.id || viewingEvaluation?.id;
                    const studentId = editingStudent?.id || editingStudent?.student_id;
                    console.log('Saving with evalId:', evalId, 'studentId:', studentId);
                    handleSaveStudentDescription(evalId, studentId);
                  }}
                >
                  Simpan Deskripsi
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleBackToDetails}
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Main render logic based on current view
  if (isWaliKelas) {
    // For wali_kelas, use page-based navigation
    switch (currentView) {
      case 'details':
        return renderEvaluationDetails();
      case 'student':
        return renderStudentEdit();
      case 'list':
      default:
        return renderEvaluationList();
    }
  } else {
    // For other roles, keep using the original modal-based approach
    return (
      <div className="container py-4">
        {renderEvaluationList()}

        {/* Evaluation Details Modal */}
        {viewingEvaluation && evaluationDetails && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Detail Evaluasi</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setViewingEvaluation(null);
                      setEvaluationDetails(null);
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  {evaluationDetails.class_id && (
                    <div className="mb-3">
                      <label className="fw-bold">Kelas:</label>
                      <p>{evaluationDetails.class_id}</p>
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="fw-bold">Dibuat:</label>
                    <p>{new Date(evaluationDetails.createdAt).toLocaleString('id-ID')}</p>
                  </div>
                  <div className="mb-3">
                    <label className="fw-bold">Diperbarui:</label>
                    <p>{new Date(evaluationDetails.updatedAt).toLocaleString('id-ID')}</p>
                  </div>

                  {/* Students section */}
                  {evaluationDetails.students && Array.isArray(evaluationDetails.students) && evaluationDetails.students.length > 0 && (
                    <div className="mb-3">
                      {editingStudent ? (
                        <div className="card">
                          <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Edit Deskripsi Siswa</h5>
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => setEditingStudent(null)}
                            >
                              Kembali ke Daftar Siswa
                            </button>
                          </div>
                          <div className="card-body">
                            <div className="mb-3">
                              <label className="form-label">Nama Siswa</label>
                              <input
                                type="text"
                                className="form-control"
                                value={editingStudent.name || editingStudent.student_name}
                                disabled
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Deskripsi</label>
                              <textarea
                                className="form-control"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                rows="4"
                                placeholder="Masukkan deskripsi evaluasi untuk siswa ini"
                              />
                            </div>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-primary"
                                onClick={() => {
                                  const evalId = evaluationDetails?.id;
                                  const studentId = editingStudent?.id || editingStudent?.student_id;
                                  console.log('Saving with evalId:', evalId, 'studentId:', studentId);
                                  handleSaveStudentDescription(evalId, studentId);
                                }}
                              >
                                Simpan Deskripsi
                              </button>
                              <button
                                className="btn btn-secondary"
                                onClick={() => setEditingStudent(null)}
                              >
                                Batal
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="list-group">
                          {evaluationDetails.students.map((student) => (
                            <div key={`detail-${student.id || student.student_id}`} className="list-group-item d-flex justify-content-between align-items-center">
                              <div className="ms-2 me-auto">
                                <div className="fw-bold">{student.name || student.student_name}</div>
                              </div>
                              <button
                                className="btn btn-primary"
                                onClick={() => {
                                  const evalId = evaluationDetails?.id;
                                  console.log('Editing student with evalId:', evalId);
                                  handleEditStudentDescription(student, evalId);
                                }}
                              >
                                PILIH
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default EvaluationNotes;

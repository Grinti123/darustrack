import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { subjectsAPI } from '../utils/api'

function SubjectManagement() {
  const [subjects, setSubjects] = useState([])
  const [newSubject, setNewSubject] = useState({
    name: '',
    description: ''
  })
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    description: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { currentUser, userRole } = useAuth()
  const navigate = useNavigate()

  // Fetch subjects from API
  const fetchSubjects = async () => {
    try {
      setLoading(true)
      const response = await subjectsAPI.getAll()
      setSubjects(Array.isArray(response) ? response : [])
      setError(null)
    } catch (err) {
      setError('Failed to fetch subjects')
      console.error('Error fetching subjects:', err)
      setSubjects([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentUser) {
      fetchSubjects()
    }
  }, [currentUser])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewSubject(prev => ({ ...prev, [name]: value }))
  }

  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (userRole !== 'admin') {
      setError('Only administrators can add new subjects')
      return
    }

    try {
      setLoading(true)
      const response = await subjectsAPI.create(newSubject)
      if (response) {
        setSubjects(prev => [...prev, response])
        setNewSubject({ name: '', description: '' })
        setError(null)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create subject')
      console.error('Error creating subject:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (subject) => {
    setSelectedSubject(subject)
    setEditForm({
      name: subject.name,
      description: subject.description
    })
    setShowEditModal(true)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!selectedSubject || userRole !== 'admin') return

    try {
      setLoading(true)
      const response = await subjectsAPI.update(selectedSubject.id, editForm)
      if (response) {
        setSubjects(prev => prev.map(subject =>
          subject.id === selectedSubject.id ? { ...subject, ...response } : subject
        ))
        setShowEditModal(false)
        setSelectedSubject(null)
        setError(null)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update subject')
      console.error('Error updating subject:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (subject) => {
    setSelectedSubject(subject)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedSubject || userRole !== 'admin') return

    try {
      setLoading(true)
      await subjectsAPI.delete(selectedSubject.id)
      setSubjects(prev => prev.filter(subject => subject.id !== selectedSubject.id))
      setShowDeleteModal(false)
      setSelectedSubject(null)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete subject')
      console.error('Error deleting subject:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!currentUser) {
    return null
  }

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4">Kelola Mata Pelajaran</h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Daftar Mata Pelajaran</h5>
              </div>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Nama</th>
                        <th>Deskripsi</th>
                        <th>Tanggal Dibuat</th>
                        <th>Terakhir Diperbarui</th>
                        {userRole === 'admin' && <th>Aksi</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(subjects) && subjects.map((subject) => (
                        <tr key={subject.id}>
                          <td>{subject.name}</td>
                          <td>{subject.description}</td>
                          <td>{subject.createdAt}</td>
                          <td>{subject.updatedAt}</td>
                          {userRole === 'admin' && (
                            <td>
                              <div className="btn-group">
                                <button
                                  className="btn btn-sm btn-outline-primary me-1"
                                  onClick={() => handleEditClick(subject)}
                                  disabled={loading}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDeleteClick(subject)}
                                  disabled={loading}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {userRole === 'admin' && (
          <div className="col-md-4">
            <div className="card">
              <div className="card-header bg-white">
                <h5 className="card-title mb-0">Tambah Mata Pelajaran Baru</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nama Mata Pelajaran</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={newSubject.name}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Deskripsi</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      value={newSubject.description}
                      onChange={handleInputChange}
                      rows="3"
                      disabled={loading}
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Menambahkan...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-plus-lg me-2"></i>
                        Tambah Mata Pelajaran
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedSubject && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Mata Pelajaran</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowEditModal(false)
                    setSelectedSubject(null)
                  }}
                ></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="edit-name" className="form-label">Nama Mata Pelajaran</label>
                    <input
                      type="text"
                      className="form-control"
                      id="edit-name"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="edit-description" className="form-label">Deskripsi</label>
                    <textarea
                      className="form-control"
                      id="edit-description"
                      name="description"
                      value={editForm.description}
                      onChange={handleEditInputChange}
                      rows="3"
                      disabled={loading}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowEditModal(false)
                      setSelectedSubject(null)
                    }}
                    disabled={loading}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Menyimpan...
                      </>
                    ) : (
                      'Simpan Perubahan'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedSubject && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Konfirmasi Hapus</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowDeleteModal(false)
                    setSelectedSubject(null)
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>Anda yakin ingin menghapus mata pelajaran ini?</p>
                <div className="alert alert-warning">
                  <strong>Nama:</strong> {selectedSubject.name}<br />
                  <strong>Deskripsi:</strong> {selectedSubject.description}
                </div>
                <p className="text-danger mb-0">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Tindakan ini tidak dapat dibatalkan
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteConfirm}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Menghapus...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-trash me-2"></i>
                      Hapus
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowDeleteModal(false)
                    setSelectedSubject(null)
                  }}
                  disabled={loading}
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SubjectManagement

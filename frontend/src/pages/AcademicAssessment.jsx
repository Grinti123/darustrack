import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { teachersAPI } from '../utils/api';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import ParentGrades from '../components/ParentGrades';

// Subject icons mapping
const subjectIcons = {
  'Matematika': '/icons/math.png',
  'IPA (Ilmu Pengetahuan Alam)': '/icons/science.png',
  'IPS (Ilmu Pengetahuan Sosial)': '/icons/social.png',
  'PPKN (Pendidikan Pancasila dan Kewarganegaraan)': '/icons/civic.png',
  'Bahasa Indonesia': '/icons/indonesia.png',
  'Bahasa Inggris': '/icons/english.png'
};

const AcademicAssessment = () => {
  const { userRole } = useAuth();
  const isWaliKelas = userRole === 'wali_kelas';
  const isParent = userRole === 'orang_tua';

  // If user is a parent, render the parent-specific grades view
  if (isParent) {
    return <ParentGrades />;
  }

  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryDetails, setCategoryDetails] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [details, setDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [editingDetail, setEditingDetail] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [scoreInput, setScoreInput] = useState('');
  const [updatingScore, setUpdatingScore] = useState(false);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        console.log('Fetching grades...');
        const data = await teachersAPI.getGrades();
        console.log('Received grades:', data);
        setGrades(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching grades:', err);
        toast.error('Gagal memuat data nilai: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  const fetchCategories = async (subjectId) => {
    try {
      setLoadingCategories(true);
      const data = await teachersAPI.getCategories(subjectId);
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      toast.error('Gagal memuat kategori: ' + (err.message || 'Unknown error'));
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    if (selectedGrade) {
      fetchCategories(selectedGrade.subject_id);
    }
  }, [selectedGrade]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast.error('Nama kategori tidak boleh kosong');
      return;
    }

    try {
      await teachersAPI.createCategory(selectedGrade.subject_id, {
        name: newCategoryName.trim()
      });
      toast.success('Kategori berhasil ditambahkan');
      setNewCategoryName('');
      setIsAddingCategory(false);
      // Refresh the categories
      fetchCategories(selectedGrade.subject_id);
    } catch (err) {
      console.error('Error adding category:', err);
      toast.error('Gagal menambahkan kategori: ' + (err.message || 'Unknown error'));
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast.error('Nama kategori tidak boleh kosong');
      return;
    }

    try {
      await teachersAPI.updateCategory(editingCategory.id, {
        name: newCategoryName.trim()
      });
      toast.success('Kategori berhasil diperbarui');
      setNewCategoryName('');
      setEditingCategory(null);
      // Refresh the categories
      fetchCategories(selectedGrade.subject_id);
    } catch (err) {
      console.error('Error updating category:', err);
      toast.error('Gagal memperbarui kategori: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      return;
    }

    try {
      await teachersAPI.deleteCategory(categoryId);
      toast.success('Kategori berhasil dihapus');
      // Refresh the categories
      fetchCategories(selectedGrade.subject_id);
    } catch (err) {
      console.error('Error deleting category:', err);
      toast.error('Gagal menghapus kategori: ' + (err.message || 'Unknown error'));
    }
  };

  const fetchCategoryDetails = async (categoryId) => {
    try {
      setLoadingDetails(true);
      const data = await teachersAPI.getCategoryDetails(categoryId);
      console.log('Category Details Response:', data);
      setDetails(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching category details:', err);
      toast.error('Gagal memuat detail kategori: ' + (err.message || 'Unknown error'));
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchCategoryDetails(selectedCategory.id);
    }
  }, [selectedCategory]);

  const handleAddCategoryDetails = async (e) => {
    e.preventDefault();
    if (!categoryDetails.name.trim()) {
      toast.error('Nama detail kategori tidak boleh kosong');
      return;
    }

    try {
      const response = await teachersAPI.createCategoryDetails(selectedCategory.id, categoryDetails);
      console.log('Create Category Detail Response:', response);
      toast.success('Detail kategori berhasil ditambahkan');
      setCategoryDetails({
        name: '',
        date: new Date().toISOString().split('T')[0]
      });
      fetchCategoryDetails(selectedCategory.id);
    } catch (err) {
      console.error('Error adding category detail:', err);
      toast.error('Gagal menambahkan detail kategori: ' + (err.message || 'Unknown error'));
    }
  };

  const handleUpdateCategoryDetail = async (e) => {
    e.preventDefault();
    if (!categoryDetails.name.trim()) {
      toast.error('Nama detail kategori tidak boleh kosong');
      return;
    }

    try {
      const response = await teachersAPI.updateCategoryDetail(editingDetail.id, categoryDetails);
      console.log('Update Category Detail Response:', response);
      toast.success('Detail kategori berhasil diperbarui');
      setCategoryDetails({
        name: '',
        date: new Date().toISOString().split('T')[0]
      });
      setEditingDetail(null);
      fetchCategoryDetails(selectedCategory.id);
    } catch (err) {
      console.error('Error updating category detail:', err);
      toast.error('Gagal memperbarui detail kategori: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDeleteCategoryDetail = async (detailId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus detail kategori ini?')) {
      return;
    }

    try {
      const response = await teachersAPI.deleteCategoryDetail(detailId);
      console.log('Delete Category Detail Response:', response);
      toast.success('Detail kategori berhasil dihapus');
      fetchCategoryDetails(selectedCategory.id);
    } catch (err) {
      console.error('Error deleting category detail:', err);
      toast.error('Gagal menghapus detail kategori: ' + (err.message || 'Unknown error'));
    }
  };

  const fetchDetailStudents = async (detailId) => {
    try {
      setLoadingStudents(true);
      const data = await teachersAPI.getDetailStudents(detailId);
      console.log('Detail Students Response:', data);
      // Transform the data to get the students array
      const studentsData = data.map(item => ({
        id: item.students.id,
        name: item.students.name,
        score: item.score || null,
        gradeId: item.id // Store the grade ID for updating scores
      }));
      setStudents(studentsData);
    } catch (err) {
      console.error('Error fetching students:', err);
      toast.error('Gagal memuat data siswa: ' + (err.message || 'Unknown error'));
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    if (selectedDetail) {
      fetchDetailStudents(selectedDetail.id);
    }
  }, [selectedDetail]);

  const handleOpenScoreModal = (student) => {
    setEditingStudent(student);
    setScoreInput(student.score !== null ? student.score.toString() : '');
    setShowScoreModal(true);
  };

  const handleCloseScoreModal = () => {
    setShowScoreModal(false);
    setEditingStudent(null);
    setScoreInput('');
  };

  const handleUpdateScore = async () => {
    // Validate score is a number between 0 and 100
    const score = parseFloat(scoreInput);
    if (isNaN(score) || score < 0 || score > 100) {
      toast.error('Nilai harus berupa angka antara 0 dan 100');
      return;
    }

    try {
      setUpdatingScore(true);
      const response = await teachersAPI.updateStudentScore(editingStudent.gradeId, { score });
      console.log('Update Score Response:', response);
      toast.success('Nilai berhasil diperbarui');
      handleCloseScoreModal();

      // Update the score in the students array without refetching
      setStudents(prevStudents =>
        prevStudents.map(student =>
          student.id === editingStudent.id
            ? { ...student, score }
            : student
        )
      );
    } catch (err) {
      console.error('Error updating score:', err);
      toast.error('Gagal memperbarui nilai: ' + (err.message || 'Unknown error'));
    } finally {
      setUpdatingScore(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!grades || grades.length === 0) {
    return (
      <div className="alert alert-info" role="alert">
        Tidak ada data nilai yang tersedia.
      </div>
    );
  }

  // Student Scores view
  if (selectedDetail) {
    return (
      <div className="container-fluid py-4">
        <div className="d-flex align-items-center mb-4">
          <button
            className="btn btn-link text-decoration-none p-0 me-3"
            onClick={() => {
              setSelectedDetail(null);
              setStudents([]);
            }}
            style={{ color: '#000', fontSize: '1rem' }}
          >
            ← {selectedCategory.name}
          </button>
          <h2 className="mb-0">{selectedDetail.name}</h2>
        </div>

        <div className="mb-3">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="12/03/2025"
              style={{ maxWidth: '200px' }}
              readOnly
            />
            <span className="input-group-text bg-white">
              <i className="bi bi-calendar"></i>
            </span>
          </div>
        </div>

        {loadingStudents ? (
          <div className="text-center py-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : students.length > 0 ? (
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col" style={{ width: '50px' }}>No</th>
                      <th scope="col">Nama</th>
                      <th scope="col">Keterangan</th>
                      <th scope="col" className="text-end" style={{ width: '120px' }}>Nilai</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr key={student.id}>
                        <td>{index + 1}</td>
                        <td style={{ fontWeight: '500' }}>{student.name}</td>
                        <td>{selectedDetail.name}</td>
                        {isWaliKelas ? (
                          <td className="text-end">
                            {student.score !== null ? (
                              <button
                                className="btn btn-primary"
                                style={{
                                  width: '50px',
                                  padding: '4px 0',
                                  borderRadius: '4px',
                                  fontSize: '0.9rem'
                                }}
                                onClick={() => handleOpenScoreModal(student)}
                              >
                                {student.score}
                              </button>
                            ) : (
                              <button
                                className="btn btn-outline-primary"
                                style={{
                                  minWidth: '80px',
                                  padding: '4px 15px',
                                  borderRadius: '4px',
                                  fontSize: '0.9rem'
                                }}
                                onClick={() => handleOpenScoreModal(student)}
                              >
                                Edit
                              </button>
                            )}
                          </td>
                        ) : (
                          <td className="text-end">
                            {student.score !== null ? (
                              <span
                                className="btn btn-primary"
                                style={{
                                  width: '50px',
                                  padding: '4px 0',
                                  borderRadius: '4px',
                                  fontSize: '0.9rem',
                                  cursor: 'default'
                                }}
                              >
                                {student.score}
                              </span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="alert alert-info">
            Belum ada data siswa untuk detail kategori ini.
          </div>
        )}

        {isWaliKelas && students.length > 0 && (
          <div className="d-flex justify-content-end mt-3">
            <div className="d-flex gap-2">
              <select className="form-select" style={{ width: '150px' }}>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <button className="btn btn-outline-secondary">
                <i className="bi bi-chevron-left"></i>
              </button>
              <button className="btn btn-outline-primary">1</button>
              <button className="btn btn-outline-secondary">2</button>
              <button className="btn btn-outline-secondary">
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        )}

        {/* Score Input Modal */}
        <Modal
          show={showScoreModal}
          onHide={handleCloseScoreModal}
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {editingStudent?.score !== null ? 'Edit Nilai' : 'Input Nilai'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editingStudent && (
              <div>
                <p className="mb-3">
                  <strong>Nama Siswa:</strong> {editingStudent.name}
                </p>
                <p className="mb-3">
                  <strong>Penilaian:</strong> {selectedDetail.name}
                </p>
                <div className="mb-3">
                  <label htmlFor="scoreInput" className="form-label">Nilai (0-100)</label>
                  <input
                    type="number"
                    className="form-control"
                    id="scoreInput"
                    min="0"
                    max="100"
                    value={scoreInput}
                    onChange={(e) => setScoreInput(e.target.value)}
                    placeholder="Masukkan nilai"
                    autoFocus
                  />
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseScoreModal} disabled={updatingScore}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleUpdateScore} disabled={updatingScore}>
              {updatingScore ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Menyimpan...
                </>
              ) : (
                'Simpan'
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  // Category Details view
  if (selectedCategory) {
    return (
      <div className="container-fluid py-4">
        <div className="d-flex align-items-center mb-4">
          <button
            className="btn btn-link text-decoration-none p-0 me-3"
            onClick={() => {
              setSelectedCategory(null);
              setDetails([]);
              setEditingDetail(null);
              setCategoryDetails({
                name: '',
                date: new Date().toISOString().split('T')[0]
              });
            }}
            style={{ color: '#000', fontSize: '1rem' }}
          >
            ← {selectedGrade.subject_name}
          </button>
          <h2 className="mb-0">{selectedCategory.name}</h2>
        </div>

        {isWaliKelas && (
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h6 className="mb-3">
                {editingDetail ? 'Edit Detail Kategori' : 'Tambah Detail Kategori'}
              </h6>
              <form onSubmit={editingDetail ? handleUpdateCategoryDetail : handleAddCategoryDetails}>
                <div className="mb-3">
                  <label htmlFor="detailName" className="form-label">Nama</label>
                  <input
                    type="text"
                    className="form-control"
                    id="detailName"
                    value={categoryDetails.name}
                    onChange={(e) => setCategoryDetails(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Masukkan nama detail"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="detailDate" className="form-label">Tanggal</label>
                  <input
                    type="date"
                    className="form-control"
                    id="detailDate"
                    value={categoryDetails.date}
                    onChange={(e) => setCategoryDetails(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    {editingDetail ? 'Simpan Perubahan' : 'Simpan'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setCategoryDetails({
                        name: '',
                        date: new Date().toISOString().split('T')[0]
                      });
                      setEditingDetail(null);
                    }}
                  >
                    {editingDetail ? 'Batal' : 'Reset'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loadingDetails ? (
          <div className="text-center py-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : details.length > 0 ? (
          <div className="d-flex flex-column gap-3">
            {details.map((detail) => (
              <div
                key={detail.id}
                className="card border rounded-3"
                style={{ backgroundColor: '#fff' }}
              >
                <div className="card-body d-flex justify-content-between align-items-center p-3">
                  <div>
                    <h5 className="mb-0" style={{ fontSize: '1.1rem', color: '#0d6efd' }}>
                      {detail.name}
                    </h5>
                    <small className="text-muted">
                      {new Date(detail.date).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </small>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    {isWaliKelas && (
                      <>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => {
                            setEditingDetail(detail);
                            setCategoryDetails({
                              name: detail.name,
                              date: detail.date.split('T')[0]
                            });
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDeleteCategoryDetail(detail.id)}
                        >
                          Hapus
                        </button>
                      </>
                    )}
                    <button
                      className="btn btn-light"
                      style={{
                        backgroundColor: '#f8f9fa',
                        color: '#0d6efd',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '6px 16px',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}
                      onClick={() => setSelectedDetail(detail)}
                    >
                      Pilih
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info">
            Belum ada detail untuk kategori ini.
          </div>
        )}
      </div>
    );
  }

  // Categories view
  if (selectedGrade) {
    return (
      <div className="container-fluid py-4">
        <div className="d-flex align-items-center mb-4">
          <button
            className="btn btn-link text-decoration-none p-0 me-3"
            onClick={() => {
              setSelectedGrade(null);
              setIsAddingCategory(false);
              setEditingCategory(null);
              setCategories([]);
            }}
            style={{ color: '#000', fontSize: '1rem' }}
          >
            ← Penilaian Akademik
          </button>
          <h2 className="mb-0">{selectedGrade.subject_name}</h2>
        </div>

        {(isAddingCategory || editingCategory) ? (
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="mb-3">
                {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
              </h6>
              <form onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}>
                <div className="mb-3">
                  <label htmlFor="categoryName" className="form-label">Nama Kategori</label>
                  <input
                    type="text"
                    className="form-control"
                    id="categoryName"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Masukkan nama kategori"
                  />
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    {editingCategory ? 'Simpan Perubahan' : 'Simpan'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setNewCategoryName('');
                      setIsAddingCategory(false);
                      setEditingCategory(null);
                    }}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <>
            {isWaliKelas && (
              <div className="mb-4">
                <button
                  className="btn btn-primary"
                  onClick={() => setIsAddingCategory(true)}
                >
                  Tambah Kategori
                </button>
              </div>
            )}

            {loadingCategories ? (
              <div className="text-center py-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : categories.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="card border rounded-3"
                    style={{ backgroundColor: '#fff' }}
                  >
                    <div className="card-body d-flex justify-content-between align-items-center p-3">
                      <div>
                        <h5 className="mb-0" style={{ fontSize: '1.1rem', color: '#0d6efd' }}>
                          {category.name}
                        </h5>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        {isWaliKelas && (
                          <>
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => {
                                setEditingCategory(category);
                                setNewCategoryName(category.name);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              Hapus
                            </button>
                          </>
                        )}
                        <button
                          className="btn btn-light"
                          style={{
                            backgroundColor: '#f8f9fa',
                            color: '#0d6efd',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 16px',
                            fontSize: '0.9rem',
                            fontWeight: '500'
                          }}
                          onClick={() => setSelectedCategory(category)}
                        >
                          Pilih
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-info">
                Belum ada kategori penilaian untuk mata pelajaran ini.
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // Subjects list view (main page)
  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4">Penilaian Akademik</h2>

      <div className="d-flex flex-column gap-3">
        {grades.map((grade) => (
          <div
            key={grade.subject_id}
            className="card border rounded-3 shadow-sm"
            style={{ backgroundColor: '#fff' }}
          >
            <div className="card-body d-flex justify-content-between align-items-center p-3">
              <div className="d-flex align-items-center">
                <h5 className="mb-0" style={{ color: '#0d6efd', fontSize: '1.1rem' }}>
                  {grade.subject_name}
                </h5>
              </div>
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-light"
                  style={{
                    backgroundColor: '#f8f9fa',
                    color: '#0d6efd',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '6px 16px',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}
                  onClick={() => setSelectedGrade(grade)}
                >
                  Pilih
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcademicAssessment;

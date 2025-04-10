import React, { useState, useEffect } from 'react';
import { parentsAPI } from '../utils/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import id from 'date-fns/locale/id';

// Debug mode to show raw data structure
const DEBUG_MODE = false;

const ParentGrades = () => {
  const [gradesData, setGradesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchGradesData();
  }, []);

  const fetchGradesData = async () => {
    try {
      setLoading(true);
      const data = await parentsAPI.getGrades();
      console.log('Parent grades data:', data);

      // Add detailed structure logging
      if (Array.isArray(data)) {
        if (data.length > 0) {
          console.log('First item structure:', JSON.stringify(data[0], null, 2));
        } else {
          console.log('API returned an empty array');
        }
      } else {
        console.log('API returned a non-array:', typeof data);
      }

      // Transform the data to match our expected structure if needed
      let transformedData = data;

      // If the data doesn't have the expected format, try to extract what we need
      if (Array.isArray(data) && data.length > 0 && data[0].id && data[0].name) {
        // This is likely a different structure than expected, let's transform it
        transformedData = data.map(subject => ({
          subject_id: subject.id,
          subject_name: subject.name,
          // Include any other fields we might need
        }));
      }

      setGradesData(Array.isArray(transformedData) ? transformedData : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching grades data:', err);
      setError('Failed to load grades data');
      toast.error('Gagal memuat data nilai');
    } finally {
      setLoading(false);
    }
  };

  // Group grades by subject
  const getSubjects = () => {
    const subjects = {};
    gradesData.forEach(grade => {
      if (grade && grade.subject_id) {
        if (!subjects[grade.subject_id]) {
          subjects[grade.subject_id] = {
            id: grade.subject_id,
            name: grade.subject_name || 'Undefined Subject',
            grades: []
          };
        }
        subjects[grade.subject_id].grades.push(grade);
      }
    });
    return Object.values(subjects);
  };

  // Updated to fetch categories from API
  const fetchCategories = async (subjectId) => {
    try {
      setLoading(true);
      const data = await parentsAPI.getSubjectCategories(subjectId);
      console.log('Categories data:', data);

      // Log data structure for debugging
      if (Array.isArray(data) && data.length > 0) {
        console.log('First category structure:', JSON.stringify(data[0], null, 2));
      }

      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('Error fetching categories:', err);
      toast.error('Gagal memuat kategori nilai');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get categories for a selected subject (now using API data)
  const getCategories = () => {
    if (!selectedSubject || !selectedSubject.categories) return [];

    return selectedSubject.categories;
  };

  // Handle subject selection with API call
  const handleSelectSubject = async (subject) => {
    try {
      setLoading(true);
      const categories = await fetchCategories(subject.id);

      // Update the subject with categories
      setSelectedSubject({
        ...subject,
        categories: categories.map(category => ({
          id: category.id || category.category_id,
          name: category.name || category.category_name || 'Unnamed Category',
          details: Array.isArray(category.details) ? category.details : []
        }))
      });

      setSelectedCategory(null);
    } catch (err) {
      console.error('Error in handleSelectSubject:', err);
      toast.error('Gagal memuat data penilaian');
    } finally {
      setLoading(false);
    }
  };

  // Updated to fetch category details from API
  const fetchCategoryDetails = async (categoryId) => {
    try {
      setLoading(true);
      const data = await parentsAPI.getCategoryDetails(categoryId);
      console.log('Category details data:', data);

      // Log data structure for debugging
      if (Array.isArray(data) && data.length > 0) {
        console.log('First detail structure:', JSON.stringify(data[0], null, 2));
      }

      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('Error fetching category details:', err);
      toast.error('Gagal memuat detail kategori nilai');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Handle category selection with API call
  const handleSelectCategory = async (category) => {
    try {
      setLoading(true);
      const details = await fetchCategoryDetails(category.id);
      console.log('Category details with scores:', details);

      // Update the category with details that include student scores
      setSelectedCategory({
        ...category,
        details: Array.isArray(details) ? details.map(detail => ({
          id: detail.id || detail.detail_id,
          name: detail.title || detail.name || detail.detail_name || detail.assessment_name || 'Unnamed Detail',
          date: detail.date || detail.detail_date || detail.assessment_date,
          score: detail.score,
          studentName: detail.student_name,
          studentId: detail.student_id,
          day: detail.day
        })) : []
      });
    } catch (err) {
      console.error('Error in handleSelectCategory:', err);
      toast.error('Gagal memuat detail penilaian');
    } finally {
      setLoading(false);
    }
  };

  // Handle back button clicks
  const handleBack = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
    } else if (selectedSubject) {
      setSelectedSubject(null);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return format(date, 'EEEE, dd MMMM yyyy', { locale: id });
    } catch (error) {
      return dateString || '-';
    }
  };

  // Determine grade status and color
  const getScoreStatusAndColor = (score) => {
    if (score === null || score === undefined) return { status: 'Belum ada nilai', color: 'text-muted' };

    if (score >= 90) return { status: 'Sangat Baik', color: 'text-success' };
    if (score >= 75) return { status: 'Baik', color: 'text-primary' };
    if (score >= 60) return { status: 'Cukup', color: 'text-warning' };
    return { status: 'Perlu Perbaikan', color: 'text-danger' };
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

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle me-2"></i>
        {error}
        {DEBUG_MODE && (
          <div className="mt-3">
            <h6>Debugging Info:</h6>
            <pre className="bg-light p-2 mt-2 rounded" style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>
              {JSON.stringify(gradesData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  }

  if (!gradesData || gradesData.length === 0) {
    return (
      <div className="alert alert-info" role="alert">
        <i className="bi bi-info-circle me-2"></i>
        Belum ada data nilai yang tersedia.
        {DEBUG_MODE && (
          <div className="mt-3">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => fetchGradesData()}
            >
              Refresh Data
            </button>
          </div>
        )}
      </div>
    );
  }

  // Detail view for a category
  if (selectedCategory) {
    // No need to group since we're showing scores for one student
    const sortedDetails = [...selectedCategory.details].sort((a, b) => {
      // Sort by date (newest first)
      return new Date(b.date || '1970-01-01') - new Date(a.date || '1970-01-01');
    });

    return (
      <div className="container-fluid py-4">
        <div className="d-flex align-items-center mb-4">
          <button
            className="btn btn-link text-decoration-none p-0 me-3"
            onClick={handleBack}
            style={{ color: '#000', fontSize: '1rem' }}
          >
            ← {selectedSubject?.name || 'Back'}
          </button>
          <h2 className="mb-0">{selectedCategory?.name || 'Category Details'}</h2>
        </div>

        <h4 className="mt-2 mb-4">Nilai Penilaian</h4>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : sortedDetails.length > 0 ? (
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th scope="col" className="ps-4">Penilaian</th>
                      <th scope="col">Hari</th>
                      <th scope="col">Tanggal</th>
                      <th scope="col" className="text-center" style={{ width: '120px' }}>Nilai</th>
                      <th scope="col" style={{ width: '150px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedDetails.map((detail, index) => {
                      const { status, color } = getScoreStatusAndColor(detail.score);
                      return (
                        <tr key={detail.id || index}>
                          <td className="ps-4 fw-medium">{detail.name || 'Undefined'}</td>
                          <td>{detail.day || '-'}</td>
                          <td>{formatDate(detail.date)}</td>
                          <td className="text-center">
                            {detail.score !== null && detail.score !== undefined ? (
                              <span
                                className="badge bg-primary"
                                style={{
                                  width: '50px',
                                  padding: '6px 0',
                                  borderRadius: '4px',
                                  fontSize: '0.9rem'
                                }}
                              >
                                {detail.score}
                              </span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td className={color}>{status}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="alert alert-info">
            Belum ada detail penilaian untuk kategori ini.
          </div>
        )}
      </div>
    );
  }

  // Subject detail view
  if (selectedSubject) {
    const categories = getCategories();

    return (
      <div className="container-fluid py-4">
        <div className="d-flex align-items-center mb-4">
          <button
            className="btn btn-link text-decoration-none p-0 me-3"
            onClick={handleBack}
            style={{ color: '#000', fontSize: '1rem' }}
          >
            ← Penilaian Akademik
          </button>
          <h2 className="mb-0">{selectedSubject?.name || 'Subject Details'}</h2>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : categories.length > 0 ? (
          categories.map((category) => (
            <div
              key={category.id || `category-${Math.random()}`}
              className="card mb-3 border rounded-3"
            >
              <div className="card-body d-flex justify-content-between align-items-center p-3">
                <div>
                  <h5 className="mb-0" style={{ color: '#0d6efd' }}>{category.name || 'Undefined Category'}</h5>
                  <small className="text-muted">
                    {(category.details?.length || 0)} penilaian
                  </small>
                </div>
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
                  onClick={() => handleSelectCategory(category)}
                >
                  Pilih
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="alert alert-info">
            Belum ada kategori penilaian untuk mata pelajaran ini.
          </div>
        )}
      </div>
    );
  }

  // Main subjects view
  const subjects = getSubjects();

  return (
    <div className="container-fluid py-4">
      <h1 className="mb-4">Penilaian Akademik</h1>

      {DEBUG_MODE && (
        <div className="card mb-4 border-warning">
          <div className="card-header bg-warning text-white">
            Debug Mode - Raw API Response
          </div>
          <div className="card-body">
            <pre className="m-0" style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>
              {JSON.stringify(gradesData, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {subjects.length === 0 ? (
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          Belum ada data nilai tersedia. Data Anda mungkin sedang dimuat atau belum tersedia.
        </div>
      ) : (
        subjects.map((subject) => (
          <div key={subject.id} className="card mb-3 border rounded-3">
            <div className="card-body d-flex justify-content-between align-items-center p-3">
              <div>
                <h5 className="mb-0" style={{ color: '#0d6efd' }}>{subject.name}</h5>
              </div>
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
                onClick={() => handleSelectSubject(subject)}
              >
                Pilih
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ParentGrades;

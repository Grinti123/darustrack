import React, { useState, useEffect } from 'react';
import { parentsAPI } from '../utils/api';
import { toast } from 'react-toastify';

const ParentEvaluations = () => {
  const [loading, setLoading] = useState(true);
  const [evaluations, setEvaluations] = useState([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [evaluationDetails, setEvaluationDetails] = useState(null);
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'details'

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    try {
      setLoading(true);
      const response = await parentsAPI.getEvaluations();
      console.log('Fetched parent evaluations:', response);
      setEvaluations(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error('Error fetching evaluations:', err);
      toast.error('Gagal mengambil data evaluasi');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (evaluation) => {
    try {
      setLoading(true);
      setSelectedEvaluation(evaluation);

      console.log('Evaluation data:', evaluation);

      // If description is directly in the evaluation object
      if (evaluation.description || evaluation.notes || evaluation.catatan) {
        setEvaluationDetails({
          title: evaluation.title,
          description: evaluation.description || evaluation.notes || evaluation.catatan
        });
      } else {
        // Fetch additional details if needed
        const response = await parentsAPI.getEvaluationDetails(evaluation.id);
        console.log('Fetched evaluation details:', response);
        setEvaluationDetails(response);
      }

      setCurrentView('details');
    } catch (err) {
      console.error('Error handling evaluation details:', err);
      toast.error('Gagal mengambil detail evaluasi');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedEvaluation(null);
    setEvaluationDetails(null);
    setCurrentView('list');
  };

  // Render evaluation list view
  const renderEvaluationList = () => {
    return (
      <>
        <div className="row mb-4">
          <div className="col">
            <h2>Catatan Evaluasi Siswa</h2>
          </div>
          <div className="col-auto">
            <button
              className="btn btn-outline-primary"
              onClick={fetchEvaluations}
              disabled={loading}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>
              Refresh
            </button>
          </div>
        </div>

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
              <div key={`eval-${evaluation.id}`} className="col-md-6 col-xl-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{evaluation.title}</h5>
                    <p className="card-text text-muted mb-3">
                      <small>
                        Terakhir diperbarui: {new Date(evaluation.updatedAt).toLocaleDateString('id-ID')}
                      </small>
                    </p>
                    <div className="mt-auto text-end">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleViewDetails(evaluation)}
                      >
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info">
            Belum ada evaluasi yang tersedia
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
          <h2 className="mb-0">Detail Evaluasi</h2>
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
              <h5 className="mb-0">Catatan Evaluasi</h5>
            </div>
            <div className="card-body">
              <div className="p-3">
                <div className="p-3 bg-light rounded">
                  {evaluationDetails.description ? (
                    <p className="mb-0">{evaluationDetails.description}</p>
                  ) : (
                    <p className="mb-0 text-muted">Belum ada catatan evaluasi</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Main render logic based on current view
  switch (currentView) {
    case 'details':
      return renderEvaluationDetails();
    case 'list':
    default:
      return renderEvaluationList();
  }
};

export default ParentEvaluations;

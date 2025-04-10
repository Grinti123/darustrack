import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { curriculumsAPI } from '../utils/api';
import { toast } from 'react-toastify';

const Curriculum = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [curriculumData, setCurriculumData] = useState({
    name: '',
    description: '',  // Changed from curriculum to description to match API
    createdAt: null,
    updatedAt: null
  });

  const { userRole } = useAuth();
  const isAdmin = userRole === 'admin';

  useEffect(() => {
    fetchCurriculum();
  }, []);

  const fetchCurriculum = async () => {
    try {
      setLoading(true);
      const response = await curriculumsAPI.getAll();
      console.log('Raw API Response:', response);

      if (response && response.name && response.description) {
        const curriculum = response;
        setCurriculumData(prevData => ({
          ...prevData,
          name: curriculum.name,
          description: curriculum.description
        }));
      } else {
        console.warn('Received invalid or empty curriculum response:', response);
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to load curriculum');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const payload = {
        name: curriculumData.name,
        description: curriculumData.description  // Changed to match API
      };

      const response = await (curriculumData.id
        ? curriculumsAPI.update(curriculumData.id, payload)
        : curriculumsAPI.create(payload));

      if (response) {
        setCurriculumData({
          id: response.id,
          name: response.name,
          description: response.description
        });
        setIsEditing(false);
        toast.success('Curriculum updated successfully');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to update curriculum');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            {!isEditing ? (
              <h4 className="fw-bold mb-0">{curriculumData.name}</h4>
            ) : (
              <input
                type="text"
                className="form-control"
                value={curriculumData.name}
                onChange={(e) => setCurriculumData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Masukkan nama kurikulum"
                required
              />
            )}

            {isAdmin && (
              <div>
                {!isEditing ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    <i className="bi bi-pencil me-2"></i>Edit
                  </button>
                ) : (
                  <div className="btn-group">
                    <button
                      className="btn btn-success"
                      onClick={handleSave}
                      disabled={!curriculumData.name}
                    >
                      <i className="bi bi-check-lg me-2"></i>Simpan
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setIsEditing(false);
                        fetchCurriculum(); // Reset to original data
                      }}
                    >
                      <i className="bi bi-x-lg me-2"></i>Batal
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {!isEditing ? (
            <p className="mb-0">{curriculumData.description || 'No description available.'}</p>
          ) : (
            <textarea
              className="form-control"
              rows="10"
              value={curriculumData.description}
              onChange={(e) => setCurriculumData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter curriculum description"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Curriculum;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const EvaluationNotes = () => {
  const { currentUser, userRole } = useAuth();
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'Mengenai Perilaku Anak',
      content: 'Siswa menunjukkan perilaku yang baik di kelas. Aktif berpartisipasi dalam diskusi dan menghormati teman-temannya.',
      createdBy: 'Pak Budi',
      studentId: 1,
      studentName: 'Ahmad',
      date: '2023-10-15'
    },
    {
      id: 2,
      title: 'Hasil Evaluasi Belajar Siswa',
      content: 'Siswa telah menunjukkan kemajuan yang baik dalam mata pelajaran matematika. Namun, perlu perhatian lebih dalam pelajaran bahasa inggris.',
      createdBy: 'Bu Siti',
      studentId: 1,
      studentName: 'Ahmad',
      date: '2023-10-20'
    },
    {
      id: 3,
      title: 'Observasi Rutin Anak',
      content: 'Siswa sering mengantuk pada jam pelajaran pagi. Mohon perhatian orang tua untuk memastikan anak tidur lebih awal.',
      createdBy: 'Pak Dani',
      studentId: 1,
      studentName: 'Ahmad',
      date: '2023-10-25'
    }
  ]);

  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    studentId: '',
    studentName: ''
  });

  // Mock student data (would come from API in real app)
  const [students, setStudents] = useState([
    { id: 1, name: 'Ahmad' },
    { id: 2, name: 'Fatimah' },
    { id: 3, name: 'Ibrahim' },
    { id: 4, name: 'Zainab' }
  ]);

  const isTeacher = userRole === 'teacher';
  const isParent = userRole === 'parent';

  const handleDetailClick = (note) => {
    setSelectedNote(note);
  };

  const handleCloseDetail = () => {
    setSelectedNote(null);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    setNotes(notes.map(note =>
      note.id === selectedNote.id ? selectedNote : note
    ));
    setIsEditing(false);
  };

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleSaveNew = () => {
    const newId = Math.max(...notes.map(note => note.id)) + 1;
    const currentDate = new Date().toISOString().split('T')[0];

    const noteToAdd = {
      ...newNote,
      id: newId,
      createdBy: currentUser.name,
      date: currentDate
    };

    setNotes([...notes, noteToAdd]);
    setIsAdding(false);
    setNewNote({
      title: '',
      content: '',
      studentId: '',
      studentName: ''
    });
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewNote({
      title: '',
      content: '',
      studentId: '',
      studentName: ''
    });
  };

  const handleStudentChange = (e) => {
    const studentId = parseInt(e.target.value);
    const student = students.find(s => s.id === studentId);
    setNewNote({
      ...newNote,
      studentId,
      studentName: student?.name || ''
    });
  };

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col">
          <h2>Catatan Evaluasi Siswa</h2>
        </div>
        {isTeacher && (
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

      {/* Add note form */}
      {isAdding && (
        <div className="card mb-4">
          <div className="card-body">
            <h4 className="card-title">Tambah Catatan Baru</h4>
            <form>
              <div className="mb-3">
                <label htmlFor="studentSelect" className="form-label">Siswa</label>
                <select
                  className="form-select"
                  id="studentSelect"
                  value={newNote.studentId}
                  onChange={handleStudentChange}
                  required
                >
                  <option value="">Pilih Siswa</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>{student.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="noteTitle" className="form-label">Judul Catatan</label>
                <input
                  type="text"
                  className="form-control"
                  id="noteTitle"
                  value={newNote.title}
                  onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="noteContent" className="form-label">Isi Catatan</label>
                <textarea
                  className="form-control"
                  id="noteContent"
                  rows="5"
                  value={newNote.content}
                  onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                  required
                ></textarea>
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
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveNew}
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List of notes */}
      <div className="row">
        {notes.map((note) => (
          <div className="col-12 mb-3" key={note.id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-primary">{note.title}</h5>
                <p className="card-text text-muted">
                  Siswa: {note.studentName} | Dibuat oleh: {note.createdBy} | Tanggal: {note.date}
                </p>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => handleDetailClick(note)}
                >
                  Detail
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail modal */}
      {selectedNote && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                {!isEditing ? (
                  <h5 className="modal-title">{selectedNote.title}</h5>
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    value={selectedNote.title}
                    onChange={(e) => setSelectedNote({...selectedNote, title: e.target.value})}
                  />
                )}
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseDetail}
                ></button>
              </div>
              <div className="modal-body">
                <p className="text-muted mb-3">
                  Siswa: {selectedNote.studentName} | Dibuat oleh: {selectedNote.createdBy} | Tanggal: {selectedNote.date}
                </p>

                {!isEditing ? (
                  <p>{selectedNote.content}</p>
                ) : (
                  <textarea
                    className="form-control"
                    rows="6"
                    value={selectedNote.content}
                    onChange={(e) => setSelectedNote({...selectedNote, content: e.target.value})}
                  ></textarea>
                )}
              </div>
              <div className="modal-footer">
                {isTeacher && !isEditing && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleEditClick}
                  >
                    Edit
                  </button>
                )}
                {isTeacher && isEditing && (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleSaveEdit}
                  >
                    Simpan
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseDetail}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationNotes;

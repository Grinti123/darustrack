import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { classesAPI, usersAPI, subjectsAPI } from '../utils/api'

function ClassManagement() {
  const [classes, setClasses] = useState([])
  const [selectedLevel, setSelectedLevel] = useState('')
  const [teachers, setTeachers] = useState([])
  const [subjects, setSubjects] = useState([])
  const [parents, setParents] = useState([])
  const [newClass, setNewClass] = useState({
    name: '',
    grade_level: '',
    teacher_id: ''
  })
  const [selectedClass, setSelectedClass] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddStudentModal, setShowAddStudentModal] = useState(false)
  const [showEditStudentModal, setShowEditStudentModal] = useState(false)
  const [showDeleteStudentModal, setShowDeleteStudentModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    grade_level: '',
    teacher_id: ''
  })
  const [editStudentForm, setEditStudentForm] = useState({
    name: '',
    nisn: '',
    birth_date: '',
    parent_id: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { currentUser, userRole } = useAuth()
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [newStudent, setNewStudent] = useState({
    name: '',
    nisn: '',
    birth_date: '',
    parent_id: ''
  })
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false)
  const [showEditScheduleModal, setShowEditScheduleModal] = useState(false)
  const [showDeleteScheduleModal, setShowDeleteScheduleModal] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const [schedules, setSchedules] = useState([])
  const [newSchedule, setNewSchedule] = useState({
    subject_id: '',
    day: '',
    start_time: '',
    end_time: ''
  })
  const [editScheduleForm, setEditScheduleForm] = useState({
    subject_id: '',
    day: '',
    start_time: '',
    end_time: ''
  })

  // Fetch classes from API with optional level filter
  const fetchClasses = async (level = '') => {
    console.log(`[ClassManagement] Starting fetchClasses with level: "${level}"`);
    try {
      setLoading(true)
      const filters = level ? { grade_level: level } : {}
      console.log(`[ClassManagement] Fetching classes with filters:`, filters);

      const response = await classesAPI.getAll(filters)
      console.log(`[ClassManagement] Classes fetched successfully:`, response);

      const classesArray = Array.isArray(response) ? response : [];
      console.log(`[ClassManagement] Setting ${classesArray.length} classes to state`);
      setClasses(classesArray)
      setError(null)
    } catch (err) {
      console.error('[ClassManagement] Error fetching classes:', err);
      console.error('[ClassManagement] Error details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        responseData: err.response?.data
      });
      setError('Failed to fetch classes')
      setClasses([])
    } finally {
      console.log('[ClassManagement] Fetch classes operation completed');
      setLoading(false)
    }
  }

  // Fetch teachers from API
  const fetchTeachers = async () => {
    try {
      console.log('[ClassManagement] Fetching teachers...');
      const response = await usersAPI.getAll('wali_kelas');
      console.log('[ClassManagement] Teachers fetched:', response);
      setTeachers(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error('[ClassManagement] Error fetching teachers:', err);
      setError('Failed to fetch teachers');
    }
  }

  // Fetch subjects from API
  const fetchSubjects = async () => {
    try {
      console.log('[ClassManagement] Fetching subjects...');
      const response = await subjectsAPI.getAll();
      console.log('[ClassManagement] Subjects fetched:', response);
      setSubjects(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error('[ClassManagement] Error fetching subjects:', err);
      setError('Failed to fetch subjects');
    }
  }

  // Fetch parents from API
  const fetchParents = async () => {
    try {
      console.log('[ClassManagement] Fetching parents...');
      const response = await usersAPI.getAll('orang_tua');
      console.log('[ClassManagement] Parents fetched:', response);
      setParents(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error('[ClassManagement] Error fetching parents:', err);
      setError('Failed to fetch parents');
    }
  }

  // Add click event listener to close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const teacherDropdown = document.getElementById('teacherDropdown');
      const editTeacherDropdown = document.getElementById('editTeacherDropdown');
      const subjectDropdown = document.getElementById('subjectDropdown');
      const editSubjectDropdown = document.getElementById('editSubjectDropdown');
      const parentDropdown = document.getElementById('parentDropdown');
      const editParentDropdown = document.getElementById('editParentDropdown');

      // Close teacher dropdowns
      if (teacherDropdown && !event.target.closest('.dropdown') && teacherDropdown.classList.contains('show')) {
        teacherDropdown.classList.remove('show');
      }

      if (editTeacherDropdown && !event.target.closest('.dropdown') && editTeacherDropdown.classList.contains('show')) {
        editTeacherDropdown.classList.remove('show');
      }

      // Close subject dropdowns
      if (subjectDropdown && !event.target.closest('.dropdown') && subjectDropdown.classList.contains('show')) {
        subjectDropdown.classList.remove('show');
      }

      if (editSubjectDropdown && !event.target.closest('.dropdown') && editSubjectDropdown.classList.contains('show')) {
        editSubjectDropdown.classList.remove('show');
      }

      // Close parent dropdowns
      if (parentDropdown && !event.target.closest('.dropdown') && parentDropdown.classList.contains('show')) {
        parentDropdown.classList.remove('show');
      }

      if (editParentDropdown && !event.target.closest('.dropdown') && editParentDropdown.classList.contains('show')) {
        editParentDropdown.classList.remove('show');
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Fetch data when component mounts if admin
  useEffect(() => {
    if (currentUser && userRole === 'admin') {
      fetchTeachers();
      fetchSubjects();
      fetchParents();
    }
  }, [currentUser, userRole]);

  // Fetch classes when level changes
  useEffect(() => {
    if (currentUser) {
      fetchClasses(selectedLevel);
    }
  }, [currentUser, selectedLevel]);

  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewClass(prev => ({ ...prev, [name]: value }))
  }

  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (userRole !== 'admin') {
      setError('Only administrators can add new classes')
      return
    }

    // Validate required fields
    if (!newClass.name.trim() || !newClass.grade_level || !newClass.teacher_id) {
      setError('Nama kelas, tingkat, dan guru wajib diisi')
      return
    }

    try {
      setLoading(true)
      setError(null) // Clear any previous errors

      const classData = {
        name: newClass.name.trim(),
        grade_level: newClass.grade_level,
        teacher_id: newClass.teacher_id
      }

      const response = await classesAPI.create(classData)

      if (response) {
        setClasses(prev => [...prev, response])
        setNewClass({ name: '', grade_level: '', teacher_id: '' })
        setError(null)
      } else {
        throw new Error('Gagal membuat kelas: Tidak ada respons dari server')
      }
    } catch (err) {
      console.error('Error creating class:', err)
      setError(err.message || 'Gagal membuat kelas. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (classItem) => {
    setSelectedClass(classItem)
    setEditForm({
      name: classItem.name,
      description: classItem.description,
      grade_level: classItem.grade_level,
      teacher_id: classItem.teacher_id
    })
    setShowEditModal(true)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!selectedClass || userRole !== 'admin') return

    try {
      setLoading(true)
      const response = await classesAPI.update(selectedClass.id, editForm)
      if (response) {
        setClasses(prev => prev.map(classItem =>
          classItem.id === selectedClass.id ? { ...classItem, ...response } : classItem
        ))
        setShowEditModal(false)
        setSelectedClass(null)
        setError(null)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update class')
      console.error('Error updating class:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (classItem) => {
    setSelectedClass(classItem)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedClass || userRole !== 'admin') return

    try {
      setLoading(true)
      await classesAPI.delete(selectedClass.id)
      setClasses(prev => prev.filter(classItem => classItem.id !== selectedClass.id))
      setShowDeleteModal(false)
      setSelectedClass(null)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete class')
      console.error('Error deleting class:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddStudentClick = async (classItem) => {
    setSelectedClass(classItem)
    try {
      // Make sure parents are loaded
      if (parents.length === 0) {
        await fetchParents();
      }

      const response = await classesAPI.getStudents(classItem.id)
      setStudents(Array.isArray(response) ? response : [])
    } catch (err) {
      console.error('Error fetching students:', err)
      setError('Gagal mengambil data siswa')
    }
    setShowAddStudentModal(true)
  }

  const handleStudentInputChange = (e) => {
    const { name, value } = e.target
    setNewStudent(prev => ({ ...prev, [name]: value }))
  }

  const handleAddStudentSubmit = async (e) => {
    e.preventDefault()

    if (!selectedClass || userRole !== 'admin') {
      setError('Hanya admin yang dapat menambah siswa')
      return
    }

    // Validate required fields
    if (!newStudent.name.trim() || !newStudent.nisn || !newStudent.birth_date || !newStudent.parent_id) {
      setError('Semua field wajib diisi')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const studentData = {
        name: newStudent.name.trim(),
        nisn: newStudent.nisn,
        birth_date: newStudent.birth_date,
        parent_id: newStudent.parent_id
      }

      const response = await classesAPI.addStudent(selectedClass.id, studentData)

      if (response) {
        setStudents(prev => [...prev, response])
        setNewStudent({ name: '', nisn: '', birth_date: '', parent_id: '' })
        setError(null)
      } else {
        throw new Error('Gagal menambah siswa: Tidak ada respons dari server')
      }
    } catch (err) {
      console.error('Error adding student:', err)
      setError(err.message || 'Gagal menambah siswa. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleEditStudentClick = async (student) => {
    // Make sure parents are loaded
    if (parents.length === 0) {
      try {
        await fetchParents();
      } catch (err) {
        console.error('Error fetching parents:', err);
      }
    }

    setSelectedStudent(student)
    setEditStudentForm({
      name: student.name,
      nisn: student.nisn,
      birth_date: student.birth_date,
      parent_id: student.parent_id
    })
    setShowEditStudentModal(true)
  }

  const handleEditStudentSubmit = async (e) => {
    e.preventDefault()
    if (!selectedClass || !selectedStudent || userRole !== 'admin') return

    try {
      setLoading(true)
      const response = await classesAPI.updateStudent(
        selectedClass.id,
        selectedStudent.id,
        editStudentForm
      )

      if (response) {
        setStudents(prev => prev.map(student =>
          student.id === selectedStudent.id ? { ...student, ...response } : student
        ))
        setShowEditStudentModal(false)
        setSelectedStudent(null)
        setError(null)
      }
    } catch (err) {
      console.error('Error updating student:', err)
      setError(err.message || 'Gagal memperbarui data siswa')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteStudentClick = (student) => {
    setSelectedStudent(student)
    setShowDeleteStudentModal(true)
  }

  const handleDeleteStudentConfirm = async () => {
    if (!selectedClass || !selectedStudent || userRole !== 'admin') return

    try {
      setLoading(true)
      await classesAPI.deleteStudent(selectedClass.id, selectedStudent.id)
      setStudents(prev => prev.filter(student => student.id !== selectedStudent.id))
      setShowDeleteStudentModal(false)
      setSelectedStudent(null)
      setError(null)
    } catch (err) {
      console.error('Error deleting student:', err)
      setError(err.message || 'Gagal menghapus siswa')
    } finally {
      setLoading(false)
    }
  }

  const handleAddScheduleClick = async (classItem) => {
    setSelectedClass(classItem)
    try {
      // Make sure subjects are loaded
      if (subjects.length === 0) {
        await fetchSubjects();
      }

      const response = await classesAPI.getSchedule(classItem.id)
      setSchedules(Array.isArray(response) ? response : [])
    } catch (err) {
      console.error('Error fetching schedule:', err)
      setError('Gagal mengambil data jadwal')
    }
    setShowAddScheduleModal(true)
  }

  const handleScheduleInputChange = (e) => {
    const { name, value } = e.target
    setNewSchedule(prev => ({ ...prev, [name]: value }))
  }

  const handleAddScheduleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedClass || userRole !== 'admin') {
      setError('Hanya admin yang dapat menambah jadwal')
      return
    }

    // Validate required fields
    if (!newSchedule.subject_id || !newSchedule.day || !newSchedule.start_time || !newSchedule.end_time) {
      setError('Semua field wajib diisi')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const scheduleData = {
        subject_id: newSchedule.subject_id,
        day: newSchedule.day,
        start_time: newSchedule.start_time,
        end_time: newSchedule.end_time
      }

      const response = await classesAPI.addSchedule(selectedClass.id, scheduleData)

      if (response) {
        setSchedules(prev => [...prev, response])
        setNewSchedule({ subject_id: '', day: '', start_time: '', end_time: '' })
        setError(null)
      } else {
        throw new Error('Gagal menambah jadwal: Tidak ada respons dari server')
      }
    } catch (err) {
      console.error('Error adding schedule:', err)
      setError(err.message || 'Gagal menambah jadwal. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleEditScheduleClick = async (schedule) => {
    // Make sure subjects are loaded
    if (subjects.length === 0) {
      try {
        await fetchSubjects();
      } catch (err) {
        console.error('Error fetching subjects:', err);
      }
    }

    setSelectedSchedule(schedule)
    setEditScheduleForm({
      subject_id: schedule.subject_id,
      day: schedule.day,
      start_time: schedule.start_time,
      end_time: schedule.end_time
    })
    setShowEditScheduleModal(true)
  }

  const handleEditScheduleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedClass || !selectedSchedule || userRole !== 'admin') return

    try {
      setLoading(true)
      const response = await classesAPI.updateSchedule(
        selectedClass.id,
        selectedSchedule.id,
        editScheduleForm
      )

      if (response) {
        setSchedules(prev => prev.map(schedule =>
          schedule.id === selectedSchedule.id ? { ...schedule, ...response } : schedule
        ))
        setShowEditScheduleModal(false)
        setSelectedSchedule(null)
        setError(null)
      }
    } catch (err) {
      console.error('Error updating schedule:', err)
      setError(err.message || 'Gagal memperbarui jadwal')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteScheduleClick = (schedule) => {
    setSelectedSchedule(schedule)
    setShowDeleteScheduleModal(true)
  }

  const handleDeleteScheduleConfirm = async () => {
    if (!selectedClass || !selectedSchedule || userRole !== 'admin') return

    try {
      setLoading(true)
      await classesAPI.deleteSchedule(selectedClass.id, selectedSchedule.id)
      setSchedules(prev => prev.filter(schedule => schedule.id !== selectedSchedule.id))
      setShowDeleteScheduleModal(false)
      setSelectedSchedule(null)
      setError(null)
    } catch (err) {
      console.error('Error deleting schedule:', err)
      setError(err.message || 'Gagal menghapus jadwal')
    } finally {
      setLoading(false)
    }
  }

  // Helper function to handle teacher search and filtering
  const handleTeacherSearch = (e, dropdownId) => {
    const searchTerm = e.target.value.toLowerCase();
    const dropdownMenu = document.getElementById(dropdownId);

    if (!dropdownMenu) return;

    // Show dropdown when searching
    dropdownMenu.classList.add('show');

    // Filter visible items in dropdown
    const items = dropdownMenu.querySelectorAll('.dropdown-item');
    let hasVisibleItems = false;

    items.forEach(item => {
      if (item.classList.contains('disabled')) return;

      const teacherName = item.textContent.toLowerCase();
      if (teacherName.includes(searchTerm)) {
        item.style.display = 'block';
        hasVisibleItems = true;
      } else {
        item.style.display = 'none';
      }
    });

    // If no items match the search, show "No results found"
    const noResultsItem = dropdownMenu.querySelector('.no-results');
    if (!hasVisibleItems) {
      if (!noResultsItem) {
        const li = document.createElement('li');
        li.className = 'no-results';
        li.innerHTML = '<span class="dropdown-item disabled">Tidak ada hasil</span>';
        dropdownMenu.appendChild(li);
      } else {
        noResultsItem.style.display = 'block';
      }
    } else if (noResultsItem) {
      noResultsItem.style.display = 'none';
    }
  };

  // Function to select a teacher from dropdown
  const selectTeacher = (teacher, stateUpdater, dropdownId) => {
    stateUpdater(prev => ({ ...prev, teacher_id: teacher.id }));
    const dropdownMenu = document.getElementById(dropdownId);
    if (dropdownMenu) {
      dropdownMenu.classList.remove('show');
    }
  };

  // Helper function to handle subject search and filtering
  const handleSubjectSearch = (e, dropdownId) => {
    const searchTerm = e.target.value.toLowerCase();
    const dropdownMenu = document.getElementById(dropdownId);

    if (!dropdownMenu) return;

    // Show dropdown when searching
    dropdownMenu.classList.add('show');

    // Filter visible items in dropdown
    const items = dropdownMenu.querySelectorAll('.dropdown-item');
    let hasVisibleItems = false;

    items.forEach(item => {
      if (item.classList.contains('disabled')) return;

      const subjectName = item.textContent.toLowerCase();
      if (subjectName.includes(searchTerm)) {
        item.style.display = 'block';
        hasVisibleItems = true;
      } else {
        item.style.display = 'none';
      }
    });

    // If no items match the search, show "No results found"
    const noResultsItem = dropdownMenu.querySelector('.no-results');
    if (!hasVisibleItems) {
      if (!noResultsItem) {
        const li = document.createElement('li');
        li.className = 'no-results';
        li.innerHTML = '<span class="dropdown-item disabled">Tidak ada hasil</span>';
        dropdownMenu.appendChild(li);
      } else {
        noResultsItem.style.display = 'block';
      }
    } else if (noResultsItem) {
      noResultsItem.style.display = 'none';
    }
  };

  // Function to select a subject from dropdown
  const selectSubject = (subject, stateUpdater, dropdownId) => {
    stateUpdater(prev => ({ ...prev, subject_id: subject.id }));
    const dropdownMenu = document.getElementById(dropdownId);
    if (dropdownMenu) {
      dropdownMenu.classList.remove('show');
    }
  };

  // Get subject name by ID
  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : subjectId;
  }

  // Get parent name by ID
  const getParentName = (parentId) => {
    const parent = parents.find(p => p.id === parentId);
    return parent ? parent.name : parentId;
  }

  // Helper function to handle parent search and filtering
  const handleParentSearch = (e, dropdownId) => {
    const searchTerm = e.target.value.toLowerCase();
    const dropdownMenu = document.getElementById(dropdownId);

    if (!dropdownMenu) return;

    // Show dropdown when searching
    dropdownMenu.classList.add('show');

    // Filter visible items in dropdown
    const items = dropdownMenu.querySelectorAll('.dropdown-item');
    let hasVisibleItems = false;

    items.forEach(item => {
      if (item.classList.contains('disabled')) return;

      const parentName = item.textContent.toLowerCase();
      if (parentName.includes(searchTerm)) {
        item.style.display = 'block';
        hasVisibleItems = true;
      } else {
        item.style.display = 'none';
      }
    });

    // If no items match the search, show "No results found"
    const noResultsItem = dropdownMenu.querySelector('.no-results');
    if (!hasVisibleItems) {
      if (!noResultsItem) {
        const li = document.createElement('li');
        li.className = 'no-results';
        li.innerHTML = '<span class="dropdown-item disabled">Tidak ada hasil</span>';
        dropdownMenu.appendChild(li);
      } else {
        noResultsItem.style.display = 'block';
      }
    } else if (noResultsItem) {
      noResultsItem.style.display = 'none';
    }
  };

  // Function to select a parent from dropdown
  const selectParent = (parent, stateUpdater, dropdownId) => {
    stateUpdater(prev => ({ ...prev, parent_id: parent.id }));
    const dropdownMenu = document.getElementById(dropdownId);
    if (dropdownMenu) {
      dropdownMenu.classList.remove('show');
    }
  };

  if (!currentUser) {
    return null
  }

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4">Kelola Kelas</h2>

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
              <h5 className="card-title mb-0">Daftar Kelas</h5>
                <div className="d-flex align-items-center">
                  <label className="me-2 mb-0">Filter Tingkat:</label>
                  <select
                    className="form-select form-select-sm"
                    value={selectedLevel}
                    onChange={handleLevelChange}
                    style={{ width: 'auto' }}
                  >
                    <option value="">Semua Tingkat</option>
                    <option value="1">Tingkat 1</option>
                    <option value="2">Tingkat 2</option>
                    <option value="3">Tingkat 3</option>
                    <option value="4">Tingkat 4</option>
                    <option value="5">Tingkat 5</option>
                    <option value="6">Tingkat 6</option>
                  </select>
                </div>
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
                        <th width="5%">ID</th>
                        <th>Nama</th>
                        <th>Tingkat</th>
                        <th>Tanggal Dibuat</th>
                        <th>Terakhir Diperbarui</th>
                        {userRole === 'admin' && <th>Aksi</th>}
                    </tr>
                  </thead>
                  <tbody>
                      {Array.isArray(classes) && classes.map((classItem) => (
                      <tr key={classItem.id}>
                        <td>{classItem.id}</td>
                        <td>{classItem.name}</td>
                        <td>{classItem.grade_level}</td>
                        <td>{classItem.createdAt}</td>
                        <td>{classItem.updatedAt}</td>
                        {userRole === 'admin' && (
                            <td>
                              <div className="btn-group">
                                <button
                                  className="btn btn-sm btn-outline-primary me-1"
                                  onClick={() => handleEditClick(classItem)}
                                  disabled={loading}
                                >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-success me-1"
                            onClick={() => handleAddStudentClick(classItem)}
                            disabled={loading}
                          >
                            <i className="bi bi-person-plus"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-info me-1"
                            onClick={() => handleAddScheduleClick(classItem)}
                            disabled={loading}
                          >
                            <i className="bi bi-calendar-plus"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDeleteClick(classItem)}
                                  disabled={loading}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                              </div>
                        </td>
                          )}
                      </tr>
                    ))}
                      {classes.length === 0 && (
                        <tr>
                          <td colSpan={userRole === 'admin' ? 7 : 6} className="text-center">
                            Tidak ada kelas yang ditemukan
                          </td>
                        </tr>
                      )}
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
              <h5 className="card-title mb-0">Tambah Kelas Baru</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Nama Kelas</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={newClass.name}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="grade_level" className="form-label">Tingkat</label>
                  <select
                    className="form-select"
                    id="grade_level"
                    name="grade_level"
                    value={newClass.grade_level}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Pilih Tingkat</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="teacher_id" className="form-label">Guru</label>
                  <div className="dropdown">
                    <input
                      type="text"
                      className="form-control"
                      id="teacherSearchInput"
                      placeholder="Cari nama guru..."
                      aria-label="Cari guru"
                      onFocus={() => document.getElementById('teacherDropdown').classList.add('show')}
                      onClick={(e) => {
                        e.stopPropagation();
                        document.getElementById('teacherDropdown').classList.add('show');
                      }}
                      onChange={(e) => handleTeacherSearch(e, 'teacherDropdown')}
                      value={teachers.find(t => t.id === newClass.teacher_id)?.name || ''}
                    />
                    <ul
                      className="dropdown-menu w-100"
                      id="teacherDropdown"
                      style={{ maxHeight: '200px', overflowY: 'auto' }}
                    >
                      {teachers.length > 0 ? (
                        teachers.map(teacher => (
                          <li key={teacher.id}>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() => selectTeacher(teacher, setNewClass, 'teacherDropdown')}
                            >
                              {teacher.name} <small className="text-muted">({teacher.id})</small>
                            </button>
                          </li>
                        ))
                      ) : (
                        <li><span className="dropdown-item disabled">Tidak ada guru</span></li>
                      )}
                    </ul>
                  </div>
                  {newClass.teacher_id && (
                    <div className="form-text text-info">
                      ID Guru yang dipilih: <strong>{newClass.teacher_id}</strong>
                    </div>
                  )}
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
                      Tambah Kelas
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
      {showEditModal && selectedClass && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Kelas</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowEditModal(false)
                    setSelectedClass(null)
                  }}
                ></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                <div className="mb-3">
                    <label htmlFor="edit-name" className="form-label">Nama Kelas</label>
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
                    <label htmlFor="edit-level" className="form-label">Tingkat</label>
                    <select
                      className="form-select"
                      id="edit-level"
                      name="grade_level"
                      value={editForm.grade_level}
                      onChange={handleEditInputChange}
                      required
                      disabled={loading}
                    >
                      <option value="">Pilih Tingkat</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="edit-teacher" className="form-label">Guru</label>
                    <div className="dropdown">
                      <input
                        type="text"
                        className="form-control"
                        id="editTeacherSearchInput"
                        placeholder="Cari nama guru..."
                        aria-label="Cari guru"
                        onFocus={() => document.getElementById('editTeacherDropdown').classList.add('show')}
                        onClick={(e) => {
                          e.stopPropagation();
                          document.getElementById('editTeacherDropdown').classList.add('show');
                        }}
                        onChange={(e) => handleTeacherSearch(e, 'editTeacherDropdown')}
                        value={teachers.find(t => t.id === editForm.teacher_id)?.name || ''}
                      />
                      <ul
                        className="dropdown-menu w-100"
                        id="editTeacherDropdown"
                        style={{ maxHeight: '200px', overflowY: 'auto' }}
                      >
                        {teachers.length > 0 ? (
                          teachers.map(teacher => (
                            <li key={teacher.id}>
                              <button
                                type="button"
                                className="dropdown-item"
                                onClick={() => selectTeacher(teacher, setEditForm, 'editTeacherDropdown')}
                              >
                                {teacher.name} <small className="text-muted">({teacher.id})</small>
                              </button>
                            </li>
                          ))
                        ) : (
                          <li><span className="dropdown-item disabled">Tidak ada guru</span></li>
                        )}
                      </ul>
                    </div>
                    {editForm.teacher_id && (
                      <div className="form-text text-info">
                        ID Guru yang dipilih: <strong>{editForm.teacher_id}</strong>
                      </div>
                    )}
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
                      setSelectedClass(null)
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
      {showDeleteModal && selectedClass && (
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
                    setSelectedClass(null)
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>Anda yakin ingin menghapus kelas ini?</p>
                <div className="alert alert-warning">
                  <strong>Nama:</strong> {selectedClass.name}<br />
                  <strong>Tingkat:</strong> {selectedClass.grade_level}<br />
                  <strong>Deskripsi:</strong> {selectedClass.description}
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
                    setSelectedClass(null)
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

      {/* Student List Modal */}
      {showAddStudentModal && selectedClass && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Kelola Siswa - Kelas {selectedClass.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddStudentModal(false)}></button>
              </div>
              <div className="modal-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                {/* Student List Table */}
                <div className="table-responsive mb-3">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nama</th>
                        <th>NISN</th>
                        <th>Tanggal Lahir</th>
                        <th>Orang Tua</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id}>
                          <td>{student.id}</td>
                          <td>{student.name}</td>
                          <td>{student.nisn}</td>
                          <td>{new Date(student.birth_date).toLocaleDateString('id-ID')}</td>
                          <td>{getParentName(student.parent_id)}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary me-1"
                              onClick={() => handleEditStudentClick(student)}
                              disabled={loading}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteStudentClick(student)}
                              disabled={loading}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add Student Form */}
                <form onSubmit={handleAddStudentSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="name" className="form-label">Nama Siswa</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={newStudent.name}
                        onChange={handleStudentInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="nisn" className="form-label">NISN</label>
                      <input
                        type="text"
                        className="form-control"
                        id="nisn"
                        name="nisn"
                        value={newStudent.nisn}
                        onChange={handleStudentInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="birth_date" className="form-label">Tanggal Lahir</label>
                      <input
                        type="date"
                        className="form-control"
                        id="birth_date"
                        name="birth_date"
                        value={newStudent.birth_date}
                        onChange={handleStudentInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="parent_id" className="form-label">Orang Tua</label>
                      <div className="dropdown">
                        <input
                          type="text"
                          className="form-control"
                          id="parentSearchInput"
                          placeholder="Cari nama orang tua..."
                          aria-label="Cari orang tua"
                          onFocus={() => document.getElementById('parentDropdown').classList.add('show')}
                          onClick={(e) => {
                            e.stopPropagation();
                            document.getElementById('parentDropdown').classList.add('show');
                          }}
                          onChange={(e) => handleParentSearch(e, 'parentDropdown')}
                          value={parents.find(p => p.id === newStudent.parent_id)?.name || ''}
                        />
                        <ul
                          className="dropdown-menu w-100"
                          id="parentDropdown"
                          style={{ maxHeight: '200px', overflowY: 'auto' }}
                        >
                          {parents.length > 0 ? (
                            parents.map(parent => (
                              <li key={parent.id}>
                                <button
                                  type="button"
                                  className="dropdown-item"
                                  onClick={() => selectParent(parent, setNewStudent, 'parentDropdown')}
                                >
                                  {parent.name} <small className="text-muted">({parent.id})</small>
                                </button>
                              </li>
                            ))
                          ) : (
                            <li><span className="dropdown-item disabled">Tidak ada orang tua</span></li>
                          )}
                        </ul>
                      </div>
                      {newStudent.parent_id && (
                        <div className="form-text text-info">
                          ID Orang Tua yang dipilih: <strong>{newStudent.parent_id}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-end">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Menambahkan...' : 'Tambah Siswa'}
                    </button>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddStudentModal(false)}>
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditStudentModal && selectedStudent && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Siswa</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditStudentModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleEditStudentSubmit}>
                  <div className="mb-3">
                    <label className="form-label">ID Siswa</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedStudent.id}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="edit-name" className="form-label">Nama Siswa</label>
                    <input
                      type="text"
                      className="form-control"
                      id="edit-name"
                      name="name"
                      value={editStudentForm.name}
                      onChange={handleStudentInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="edit-nisn" className="form-label">NISN</label>
                    <input
                      type="text"
                      className="form-control"
                      id="edit-nisn"
                      name="nisn"
                      value={editStudentForm.nisn}
                      onChange={handleStudentInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="edit-birth-date" className="form-label">Tanggal Lahir</label>
                    <input
                      type="date"
                      className="form-control"
                      id="edit-birth-date"
                      name="birth_date"
                      value={editStudentForm.birth_date}
                      onChange={handleStudentInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="edit-parent-id" className="form-label">Orang Tua</label>
                    <div className="dropdown">
                      <input
                        type="text"
                        className="form-control"
                        id="editParentSearchInput"
                        placeholder="Cari nama orang tua..."
                        aria-label="Cari orang tua"
                        onFocus={() => document.getElementById('editParentDropdown').classList.add('show')}
                        onClick={(e) => {
                          e.stopPropagation();
                          document.getElementById('editParentDropdown').classList.add('show');
                        }}
                        onChange={(e) => handleParentSearch(e, 'editParentDropdown')}
                        value={parents.find(p => p.id === editStudentForm.parent_id)?.name || ''}
                      />
                      <ul
                        className="dropdown-menu w-100"
                        id="editParentDropdown"
                        style={{ maxHeight: '200px', overflowY: 'auto' }}
                      >
                        {parents.length > 0 ? (
                          parents.map(parent => (
                            <li key={parent.id}>
                              <button
                                type="button"
                                className="dropdown-item"
                                onClick={() => selectParent(parent, setEditStudentForm, 'editParentDropdown')}
                              >
                                {parent.name} <small className="text-muted">({parent.id})</small>
                              </button>
                            </li>
                          ))
                        ) : (
                          <li><span className="dropdown-item disabled">Tidak ada orang tua</span></li>
                        )}
                      </ul>
                    </div>
                    {editStudentForm.parent_id && (
                      <div className="form-text text-info">
                        ID Orang Tua yang dipilih: <strong>{editStudentForm.parent_id}</strong>
                      </div>
                    )}
                  </div>
                  <div className="text-end">
                    <button type="button" className="btn btn-secondary me-2" onClick={() => setShowEditStudentModal(false)}>
                      Batal
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Menyimpan...' : 'Simpan'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Student Modal */}
      {showDeleteStudentModal && selectedStudent && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Hapus Siswa</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowDeleteStudentModal(false)
                    setSelectedStudent(null)
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>Apakah Anda yakin ingin menghapus siswa ini?</p>
                <div className="alert alert-warning">
                  <strong>Nama:</strong> {selectedStudent.name}<br />
                  <strong>NISN:</strong> {selectedStudent.nisn}<br />
                  <strong>Orang Tua:</strong> {getParentName(selectedStudent.parent_id)}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowDeleteStudentModal(false)
                    setSelectedStudent(null)
                  }}
                  disabled={loading}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteStudentConfirm}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Menghapus...
                    </>
                  ) : (
                    'Hapus'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Schedule Modal */}
      {showAddScheduleModal && selectedClass && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Tambah Jadwal Kelas {selectedClass.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowAddScheduleModal(false)
                    setSelectedClass(null)
                    setNewSchedule({ subject_id: '', day: '', start_time: '', end_time: '' })
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAddScheduleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="schedule-subject" className="form-label">Mata Pelajaran</label>
                    <div className="dropdown">
                      <input
                        type="text"
                        className="form-control"
                        id="subjectSearchInput"
                        placeholder="Cari mata pelajaran..."
                        aria-label="Cari mata pelajaran"
                        onFocus={() => document.getElementById('subjectDropdown').classList.add('show')}
                        onClick={(e) => {
                          e.stopPropagation();
                          document.getElementById('subjectDropdown').classList.add('show');
                        }}
                        onChange={(e) => handleSubjectSearch(e, 'subjectDropdown')}
                        value={subjects.find(s => s.id === newSchedule.subject_id)?.name || ''}
                      />
                      <ul
                        className="dropdown-menu w-100"
                        id="subjectDropdown"
                        style={{ maxHeight: '200px', overflowY: 'auto' }}
                      >
                        {subjects.length > 0 ? (
                          subjects.map(subject => (
                            <li key={subject.id}>
                              <button
                                type="button"
                                className="dropdown-item"
                                onClick={() => selectSubject(subject, setNewSchedule, 'subjectDropdown')}
                              >
                                {subject.name} <small className="text-muted">({subject.id})</small>
                              </button>
                            </li>
                          ))
                        ) : (
                          <li><span className="dropdown-item disabled">Tidak ada mata pelajaran</span></li>
                        )}
                      </ul>
                    </div>
                    {newSchedule.subject_id && (
                      <div className="form-text text-info">
                        ID Mata Pelajaran yang dipilih: <strong>{newSchedule.subject_id}</strong>
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="schedule-day" className="form-label">Hari</label>
                    <select
                      className="form-select"
                      id="schedule-day"
                      name="day"
                      value={newSchedule.day}
                      onChange={handleScheduleInputChange}
                      required
                      disabled={loading}
                    >
                      <option value="">Pilih Hari</option>
                      <option value="Senin">Senin</option>
                      <option value="Selasa">Selasa</option>
                      <option value="Rabu">Rabu</option>
                      <option value="Kamis">Kamis</option>
                      <option value="Jumat">Jumat</option>
                      <option value="Sabtu">Sabtu</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="schedule-start-time" className="form-label">Waktu Mulai</label>
                    <input
                      type="time"
                      className="form-control"
                      id="schedule-start-time"
                      name="start_time"
                      value={newSchedule.start_time}
                      onChange={handleScheduleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="schedule-end-time" className="form-label">Waktu Selesai</label>
                    <input
                      type="time"
                      className="form-control"
                      id="schedule-end-time"
                      name="end_time"
                      value={newSchedule.end_time}
                      onChange={handleScheduleInputChange}
                      required
                      disabled={loading}
                    />
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
                        Tambah Jadwal
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-4">
                  <h6>Daftar Jadwal Kelas</h6>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Mata Pelajaran</th>
                          <th>Hari</th>
                          <th>Waktu Mulai</th>
                          <th>Waktu Selesai</th>
                          {userRole === 'admin' && <th>Aksi</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {schedules.map((schedule) => (
                          <tr key={schedule.id}>
                            <td>{getSubjectName(schedule.subject_id)}</td>
                            <td>{schedule.day}</td>
                            <td>{schedule.start_time}</td>
                            <td>{schedule.end_time}</td>
                            {userRole === 'admin' && (
                              <td>
                                <div className="btn-group">
                                  <button
                                    className="btn btn-sm btn-outline-primary me-1"
                                    onClick={() => handleEditScheduleClick(schedule)}
                                    disabled={loading}
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDeleteScheduleClick(schedule)}
                                    disabled={loading}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))}
                        {schedules.length === 0 && (
                          <tr>
                            <td colSpan={userRole === 'admin' ? 5 : 4} className="text-center">
                              Belum ada jadwal dalam kelas ini
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Schedule Modal */}
      {showEditScheduleModal && selectedSchedule && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Jadwal</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowEditScheduleModal(false)
                    setSelectedSchedule(null)
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleEditScheduleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="edit-schedule-subject" className="form-label">Mata Pelajaran</label>
                    <div className="dropdown">
                      <input
                        type="text"
                        className="form-control"
                        id="editSubjectSearchInput"
                        placeholder="Cari mata pelajaran..."
                        aria-label="Cari mata pelajaran"
                        onFocus={() => document.getElementById('editSubjectDropdown').classList.add('show')}
                        onClick={(e) => {
                          e.stopPropagation();
                          document.getElementById('editSubjectDropdown').classList.add('show');
                        }}
                        onChange={(e) => handleSubjectSearch(e, 'editSubjectDropdown')}
                        value={subjects.find(s => s.id === editScheduleForm.subject_id)?.name || ''}
                      />
                      <ul
                        className="dropdown-menu w-100"
                        id="editSubjectDropdown"
                        style={{ maxHeight: '200px', overflowY: 'auto' }}
                      >
                        {subjects.length > 0 ? (
                          subjects.map(subject => (
                            <li key={subject.id}>
                              <button
                                type="button"
                                className="dropdown-item"
                                onClick={() => selectSubject(subject, setEditScheduleForm, 'editSubjectDropdown')}
                              >
                                {subject.name} <small className="text-muted">({subject.id})</small>
                              </button>
                            </li>
                          ))
                        ) : (
                          <li><span className="dropdown-item disabled">Tidak ada mata pelajaran</span></li>
                        )}
                      </ul>
                    </div>
                    {editScheduleForm.subject_id && (
                      <div className="form-text text-info">
                        ID Mata Pelajaran yang dipilih: <strong>{editScheduleForm.subject_id}</strong>
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="edit-schedule-day" className="form-label">Hari</label>
                    <select
                      className="form-select"
                      id="edit-schedule-day"
                      name="day"
                      value={editScheduleForm.day}
                      onChange={(e) => setEditScheduleForm(prev => ({ ...prev, day: e.target.value }))}
                      required
                      disabled={loading}
                    >
                      <option value="">Pilih Hari</option>
                      <option value="Senin">Senin</option>
                      <option value="Selasa">Selasa</option>
                      <option value="Rabu">Rabu</option>
                      <option value="Kamis">Kamis</option>
                      <option value="Jumat">Jumat</option>
                      <option value="Sabtu">Sabtu</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="edit-schedule-start-time" className="form-label">Waktu Mulai</label>
                    <input
                      type="time"
                      className="form-control"
                      id="edit-schedule-start-time"
                      name="start_time"
                      value={editScheduleForm.start_time}
                      onChange={(e) => setEditScheduleForm(prev => ({ ...prev, start_time: e.target.value }))}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="edit-schedule-end-time" className="form-label">Waktu Selesai</label>
                    <input
                      type="time"
                      className="form-control"
                      id="edit-schedule-end-time"
                      name="end_time"
                      value={editScheduleForm.end_time}
                      onChange={(e) => setEditScheduleForm(prev => ({ ...prev, end_time: e.target.value }))}
                      required
                      disabled={loading}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
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
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Schedule Modal */}
      {showDeleteScheduleModal && selectedSchedule && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Hapus Jadwal</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowDeleteScheduleModal(false)
                    setSelectedSchedule(null)
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>Apakah Anda yakin ingin menghapus jadwal ini?</p>
                <div className="alert alert-warning">
                  <strong>Mata Pelajaran:</strong> {getSubjectName(selectedSchedule.subject_id)}<br />
                  <strong>Hari:</strong> {selectedSchedule.day}<br />
                  <strong>Waktu:</strong> {selectedSchedule.start_time} - {selectedSchedule.end_time}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowDeleteScheduleModal(false)
                    setSelectedSchedule(null)
                  }}
                  disabled={loading}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteScheduleConfirm}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Menghapus...
                    </>
                  ) : (
                    'Hapus'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClassManagement

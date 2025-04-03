const API_BASE_URL = 'https://darustrack-backend-production.up.railway.app';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to get headers with auth token
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json'
  };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

// Auth API
export const authAPI = {
  login: (credentials) =>
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials)
    }).then(handleResponse),

  logout: () =>
    fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    }).then(handleResponse),

  register: (userData) =>
    fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }).then(handleResponse)
};

// Users API
export const usersAPI = {
  getAll: (role) => {
    const url = role
      ? `${API_BASE_URL}/users?role=${role}`
      : `${API_BASE_URL}/users`;

    return fetch(url, {
      headers: getHeaders(),
      credentials: 'include'
    }).then(handleResponse)
  },

  getById: (id) =>
    fetch(`${API_BASE_URL}/users/${id}`, {
      headers: getHeaders(),
      credentials: 'include'
    }).then(handleResponse),

  create: (userData) =>
    fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(userData)
    }).then(handleResponse),

  update: (id, userData) =>
    fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(userData)
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include'
    }).then(handleResponse)
};

// Teachers API
export const teachersAPI = {
  getAll: () =>
    fetch(`${API_BASE_URL}/teachers`, {
      credentials: 'include'
    }).then(handleResponse),

  getById: (id) =>
    fetch(`${API_BASE_URL}/teachers/${id}`, {
      credentials: 'include'
    }).then(handleResponse),

  create: (teacherData) =>
    fetch(`${API_BASE_URL}/teachers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(teacherData)
    }).then(handleResponse),

  update: (id, teacherData) =>
    fetch(`${API_BASE_URL}/teachers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(teacherData)
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${API_BASE_URL}/teachers/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    }).then(handleResponse),

  // Attendance endpoints
  getAttendance: (date) =>
    fetch(`${API_BASE_URL}/teachers/attendances?date=${date}`, {
      headers: getHeaders(),
      credentials: 'include'
    }).then(handleResponse),

  saveAttendance: (date, attendanceData) =>
    fetch(`${API_BASE_URL}/teachers/attendances`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ date, attendances: attendanceData })
    }).then(handleResponse),

  updateAttendance: (id, attendanceData) =>
    fetch(`${API_BASE_URL}/teachers/attendances/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(attendanceData)
    }).then(handleResponse),

  getAttendanceHistory: (studentId) =>
    fetch(`${API_BASE_URL}/teachers/attendances/history/${studentId}`, {
      headers: getHeaders(),
      credentials: 'include'
    }).then(handleResponse)
};

// Parents API
export const parentsAPI = {
  getAll: () =>
    fetch(`${API_BASE_URL}/parents`, {
      credentials: 'include'
    }).then(handleResponse),

  getById: (id) =>
    fetch(`${API_BASE_URL}/parents/${id}`, {
      credentials: 'include'
    }).then(handleResponse),

  create: (parentData) =>
    fetch(`${API_BASE_URL}/parents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(parentData)
    }).then(handleResponse),

  update: (id, parentData) =>
    fetch(`${API_BASE_URL}/parents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(parentData)
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${API_BASE_URL}/parents/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    }).then(handleResponse)
};

// Classes API
export const classesAPI = {
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams()
    if (filters.level) {
      queryParams.append('level', filters.level)
    }
    const url = `${API_BASE_URL}/classes${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    const response = await fetch(url, {
      headers: getHeaders(),
      credentials: 'include'
    }).then(handleResponse)
    return response
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/classes/${id}`, {
      headers: getHeaders(),
      credentials: 'include'
    }).then(handleResponse)
    return response
  },

  create: async (classData) => {
    const response = await fetch(`${API_BASE_URL}/classes`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(classData)
    }).then(handleResponse)
    return response
  },

  update: async (id, classData) => {
    const response = await fetch(`${API_BASE_URL}/classes/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(classData)
    }).then(handleResponse)
    return response
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/classes/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include'
    }).then(handleResponse)
    return response
  },

  // Add student to class
  addStudent: async (classId, studentData) => {
    const response = await fetch(`${API_BASE_URL}/classes/${classId}/students`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(studentData)
    }).then(handleResponse)
    return response
  },

  // Get students in a class
  getStudents: async (classId) => {
    const response = await fetch(`${API_BASE_URL}/classes/${classId}/students`, {
      headers: getHeaders(),
      credentials: 'include'
    }).then(handleResponse)
    return response
  },

  // Update student in class
  updateStudent: async (classId, studentId, studentData) => {
    const response = await fetch(`${API_BASE_URL}/classes/${classId}/students/${studentId}`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(studentData)
    }).then(handleResponse)
    return response
  },

  // Delete student from class
  deleteStudent: async (classId, studentId) => {
    const response = await fetch(`${API_BASE_URL}/classes/${classId}/students/${studentId}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include'
    }).then(handleResponse)
    return response
  },

  // Get class schedule
  getSchedule: async (classId) => {
    const response = await fetch(`${API_BASE_URL}/classes/${classId}/schedule`, {
      headers: getHeaders(),
      credentials: 'include'
    }).then(handleResponse)
    return response
  },

  // Add schedule to class
  addSchedule: async (classId, scheduleData) => {
    const response = await fetch(`${API_BASE_URL}/classes/${classId}/schedule`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(scheduleData)
    }).then(handleResponse)
    return response
  },

  // Update schedule in class
  updateSchedule: async (classId, scheduleId, scheduleData) => {
    const response = await fetch(`${API_BASE_URL}/classes/${classId}/schedule/${scheduleId}`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(scheduleData)
    }).then(handleResponse)
    return response
  },

  // Delete schedule from class
  deleteSchedule: async (classId, scheduleId) => {
    const response = await fetch(`${API_BASE_URL}/classes/${classId}/schedule/${scheduleId}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include'
    }).then(handleResponse)
    return response
  }
};

// Curriculums API
export const curriculumsAPI = {
  getAll: () =>
    fetch(`${API_BASE_URL}/curriculums`, {
      credentials: 'include'
    }).then(handleResponse),

  getById: (id) =>
    fetch(`${API_BASE_URL}/curriculums/${id}`, {
      credentials: 'include'
    }).then(handleResponse),

  create: (curriculumData) =>
    fetch(`${API_BASE_URL}/curriculums`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(curriculumData)
    }).then(handleResponse),

  update: (id, curriculumData) =>
    fetch(`${API_BASE_URL}/curriculums/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(curriculumData)
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${API_BASE_URL}/curriculums/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    }).then(handleResponse)
};

// Subjects API
export const subjectsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/subjects`, {
      headers: getHeaders(),
      credentials: 'include'
    }).then(handleResponse)
    return response
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
      headers: getHeaders(),
      credentials: 'include'
    }).then(handleResponse)
    return response
  },

  create: async (subjectData) => {
    const response = await fetch(`${API_BASE_URL}/subjects`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(subjectData)
    }).then(handleResponse)
    return response
  },

  update: async (id, subjectData) => {
    const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(subjectData)
    }).then(handleResponse)
    return response
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include'
    }).then(handleResponse)
    return response
  }
};

// Academic Calendar API
export const academicCalendarAPI = {
  getAll: () =>
    fetch(`${API_BASE_URL}/academic-calendar`, {
      credentials: 'include'
    }).then(handleResponse),

  getById: (id) =>
    fetch(`${API_BASE_URL}/academic-calendar/${id}`, {
      credentials: 'include'
    }).then(handleResponse),

  create: (eventData) =>
    fetch(`${API_BASE_URL}/academic-calendar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(eventData)
    }).then(handleResponse),

  update: (id, eventData) =>
    fetch(`${API_BASE_URL}/academic-calendar/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(eventData)
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${API_BASE_URL}/academic-calendar/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    }).then(handleResponse)
};

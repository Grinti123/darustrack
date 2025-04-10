const API_BASE_URL = 'https://darustrack-backend-production.up.railway.app';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to get headers with auth token
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
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
    const error = await response.json().catch(() => ({
      message: 'Something went wrong'
    }));
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

// Common fetch options
const getCommonOptions = () => ({
  credentials: 'include',
  mode: 'cors',
  headers: {
    'Access-Control-Allow-Credentials': 'true'
  }
});

// Auth API
export const authAPI = {
  login: (credentials) =>
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      ...getCommonOptions(),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
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
    }).then(handleResponse),

  getProfile: () =>
    fetch(`${API_BASE_URL}/auth/profile`, {
      ...getCommonOptions(),
      headers: getHeaders()
    }).then(handleResponse),

  updateProfile: (profileData) =>
    fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      ...getCommonOptions(),
      headers: getHeaders(),
      body: JSON.stringify({
        password: profileData.password
      })
    }).then(handleResponse),

  changePassword: (passwordData) =>
    fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      ...getCommonOptions(),
      headers: getHeaders(),
      body: JSON.stringify(passwordData)
    }).then(handleResponse),

  refreshToken: () =>
    fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      ...getCommonOptions(),
      headers: getHeaders()
    }).then(handleResponse)
};

// Users API
export const usersAPI = {
  getAll: (role) => {
    const url = role
      ? `${API_BASE_URL}/users?role=${role}`
      : `${API_BASE_URL}/users`;

    return fetch(url, {
      ...getCommonOptions(),
      headers: getHeaders()
    }).then(handleResponse);
  },

  getById: (id) =>
    fetch(`${API_BASE_URL}/users/${id}`, {
      ...getCommonOptions(),
      headers: getHeaders()
    }).then(handleResponse),

  create: (userData) =>
    fetch(`${API_BASE_URL}/users`, {
      ...getCommonOptions(),
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    }).then(handleResponse),

  update: (id, userData) =>
    fetch(`${API_BASE_URL}/users/${id}`, {
      ...getCommonOptions(),
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${API_BASE_URL}/users/${id}`, {
      ...getCommonOptions(),
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse)
};

// Teachers API
export const teachersAPI = {
  getMyClass: () =>
    fetch(`${API_BASE_URL}/teachers/my-class`, {
      ...getCommonOptions(),
      headers: getHeaders()
    }).then(handleResponse),

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
    fetch(`${API_BASE_URL}/teachers/attendances/${date}`, {
      ...getCommonOptions(),
      headers: getHeaders()
    }).then(handleResponse),

  saveAttendance: (date) =>
    fetch(`${API_BASE_URL}/teachers/attendances`, {
      method: 'POST',
      ...getCommonOptions(),
      headers: getHeaders(),
      body: JSON.stringify({
        date: date
      })
    }).then(handleResponse),

  updateAttendance: (date, attendances) =>
    fetch(`${API_BASE_URL}/teachers/attendances/${date}`, {
      method: 'PUT',
      headers: getHeaders(),
      ...getCommonOptions(),
      body: JSON.stringify({ attendances })
    }).then(handleResponse),

  getAttendanceHistory: (studentId) =>
    fetch(`${API_BASE_URL}/teachers/attendances/history/${studentId}`, {
      headers: getHeaders(),
      credentials: 'include'
    }).then(handleResponse),

  // Schedule endpoints
  getSchedule: (day) =>
    fetch(`${API_BASE_URL}/teachers/schedule?day=${day}`, {
      ...getCommonOptions(),
      headers: getHeaders()
    }).then(handleResponse),

  // Evaluation endpoints
  getEvaluations: () =>
    fetch(`${API_BASE_URL}/teachers/evaluations`, {
      ...getCommonOptions(),
      headers: getHeaders()
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) throw new Error(data.error);
      return data;
    }),

  createEvaluation: (data) =>
    fetch(`${API_BASE_URL}/teachers/evaluations`, {
      method: 'POST',
      ...getCommonOptions(),
      headers: getHeaders(),
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) throw new Error(data.error);
      return data;
    }),

  updateEvaluation: (id, data) =>
    fetch(`${API_BASE_URL}/teachers/evaluations/${id}`, {
      method: 'PUT',
      ...getCommonOptions(),
      headers: getHeaders(),
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) throw new Error(data.error);
      return data;
    }),

  deleteEvaluation: (id) =>
    fetch(`${API_BASE_URL}/teachers/evaluations/${id}`, {
      method: 'DELETE',
      ...getCommonOptions(),
      headers: getHeaders()
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) throw new Error(data.error);
      return data;
    }),

  getStudentEvaluations: (evaluationId) =>
    fetch(`${API_BASE_URL}/teachers/evaluations/${evaluationId}/students`, {
      ...getCommonOptions(),
      headers: getHeaders()
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) throw new Error(data.error);
      return data;
    }),

  getStudentEvaluation: (evaluationId, studentId) =>
    fetch(`${API_BASE_URL}/teachers/evaluations/${evaluationId}/students/${studentId}`, {
      ...getCommonOptions(),
      headers: getHeaders()
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) throw new Error(data.error);
      return data;
    }),

  updateStudentEvaluation: (evaluationId, studentId, data) =>
    fetch(`${API_BASE_URL}/teachers/evaluations/${evaluationId}/students/${studentId}`, {
      method: 'PUT',
      ...getCommonOptions(),
      headers: getHeaders(),
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) throw new Error(data.error);
      return data;
    }),

  getEvaluationById: (id) =>
    fetch(`${API_BASE_URL}/teachers/evaluations/${id}`, {
      ...getCommonOptions(),
      headers: getHeaders()
    })
      .then(handleResponse)
      .catch((err) => {
        console.error('Error getting evaluation:', err);
        throw err;
      }),

  getGrades: () =>
    fetch(`${API_BASE_URL}/teachers/grades`, {
      ...getCommonOptions(),
      headers: getHeaders()
    }).then(handleResponse),

  getCategories: (subjectId) =>
    fetch(`${API_BASE_URL}/teachers/grades/${subjectId}/categories`, {
      ...getCommonOptions(),
      headers: getHeaders()
    }).then(handleResponse),

  createCategory: (subjectId, categoryData) =>
    fetch(`${API_BASE_URL}/teachers/grades/${subjectId}/categories`, {
      method: 'POST',
      ...getCommonOptions(),
      headers: getHeaders(),
      body: JSON.stringify(categoryData)
    }).then(handleResponse),

  updateCategory: (categoryId, categoryData) =>
    fetch(`${API_BASE_URL}/teachers/grades/categories/${categoryId}`, {
      method: 'PUT',
      ...getCommonOptions(),
      headers: getHeaders(),
      body: JSON.stringify(categoryData)
    }).then(handleResponse),

  deleteCategory: (categoryId) =>
    fetch(`${API_BASE_URL}/teachers/grades/categories/${categoryId}`, {
      method: 'DELETE',
      ...getCommonOptions(),
      headers: getHeaders()
    }).then(handleResponse),

  createCategoryDetails: (categoryId, detailsData) =>
    fetch(`${API_BASE_URL}/teachers/grades/categories/${categoryId}/details`, {
      method: 'POST',
      ...getCommonOptions(),
      headers: getHeaders(),
      body: JSON.stringify(detailsData)
    }).then(handleResponse),

  getCategoryDetails: (categoryId) =>
    fetch(`${API_BASE_URL}/teachers/grades/categories/${categoryId}/details`, {
      ...getCommonOptions(),
      headers: getHeaders()
    }).then(handleResponse),

  updateCategoryDetail: (detailId, detailData) =>
    fetch(`${API_BASE_URL}/teachers/grades/details/${detailId}`, {
      method: 'PUT',
      ...getCommonOptions(),
      headers: getHeaders(),
      body: JSON.stringify(detailData)
    }).then(handleResponse),

  deleteCategoryDetail: (detailId) =>
    fetch(`${API_BASE_URL}/teachers/grades/details/${detailId}`, {
      method: 'DELETE',
      ...getCommonOptions(),
      headers: getHeaders()
    }).then(handleResponse),

  getDetailStudents: (detailId) => {
    return fetch(`${API_BASE_URL}/teachers/grades/details/${detailId}/students`, {
      ...getCommonOptions(),
      headers: getHeaders()
    }).then(handleResponse);
  },

  updateStudentScore: (studentGradeId, data) => {
    return fetch(`${API_BASE_URL}/teachers/grades/students/${studentGradeId}`, {
      ...getCommonOptions(),
      method: 'PUT',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(handleResponse);
  }
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
    }).then(handleResponse),

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/parents/profile`, {
      ...getCommonOptions(),
      headers: getHeaders()
    }).then(handleResponse);
    return response;
  },

  getChildDetail: (childId) =>
    fetch(`${API_BASE_URL}/parents/children/${childId}`, {
      ...getCommonOptions(),
      headers: getHeaders()
    }).then(handleResponse),

  getAttendance: async (params) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/parents/attendance${queryString ? `?${queryString}` : ''}`, {
        ...getCommonOptions(),
        headers: getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch attendance data');
      }

      return response.json();
    } catch (error) {
      console.error('Attendance API error:', error);
      throw error;
    }
  },

  getGrades: async () => {
    const response = await fetch(`${API_BASE_URL}/parents/grades`, {
      ...getCommonOptions(),
      headers: getHeaders()
    }).then(handleResponse);
    return response;
  },

  getSubjectCategories: (subjectId) =>
    fetch(`${API_BASE_URL}/parents/grades/${subjectId}`, {
      ...getCommonOptions(),
      headers: getHeaders()
    }).then(handleResponse),

  getCategoryDetails: (categoryId) =>
    fetch(`${API_BASE_URL}/parents/grades/category/${categoryId}/details`, {
      ...getCommonOptions(),
      headers: getHeaders()
    }).then(handleResponse),

  getSchedule: async (day) => {
    try {
      const response = await fetch(`${API_BASE_URL}/parents/schedule?day=${day}`, {
        ...getCommonOptions(),
        headers: getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch schedule');
      }

      return response.json();
    } catch (error) {
      throw new Error(error.message || 'Network error while fetching schedule');
    }
  },

  getEvaluations: async () => {
    const response = await fetch(`${API_BASE_URL}/parents/evaluations`, {
      ...getCommonOptions(),
      headers: getHeaders()
    }).then(handleResponse);
    return response;
  },

  getEvaluationDetails: async (evaluationId) => {
    const response = await fetch(`${API_BASE_URL}/parents/evaluations/${evaluationId}`, {
      ...getCommonOptions(),
      headers: getHeaders()
    }).then(handleResponse);
    return response;
  }
};

// Students API
export const studentsAPI = {
  getSchedule: (day) =>
    fetch(`${API_BASE_URL}/students/schedule?day=${day}`, {
      ...getCommonOptions(),
      headers: getHeaders()
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
      ...getCommonOptions(),
      headers: getHeaders()
    }).then(handleResponse),

  getById: (id) =>
    fetch(`${API_BASE_URL}/curriculums/${id}`, {
      ...getCommonOptions(),
      headers: getHeaders()
    }).then(handleResponse),

  create: (curriculumData) =>
    fetch(`${API_BASE_URL}/curriculums`, {
      method: 'POST',
      ...getCommonOptions(),
      headers: getHeaders(),
      body: JSON.stringify(curriculumData)
    }).then(handleResponse),

  update: (id, curriculumData) =>
    fetch(`${API_BASE_URL}/curriculums/${id}`, {
      method: 'PUT',
      ...getCommonOptions(),
      headers: getHeaders(),
      body: JSON.stringify(curriculumData)
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${API_BASE_URL}/curriculums/${id}`, {
      method: 'DELETE',
      ...getCommonOptions(),
      headers: getHeaders()
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

const API_BASE_URL = 'https://darustrack-backend-production.up.railway.app';

// Store for any pending requests during token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

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

// Common fetch options
const getCommonOptions = () => ({
  credentials: 'include',
  mode: 'cors',
  headers: {
    'Access-Control-Allow-Credentials': 'true'
  }
});

// Helper function to handle API responses
const handleResponse = async (response) => {
  console.log(`[handleResponse] Processing response: ${response.url}, status: ${response.status}`);

  if (!response.ok) {
    console.error('API Error Response Status:', response.status, response.statusText);

    // Handle 401 Unauthorized errors (expired token)
    if (response.status === 401) {
      const originalRequest = response.url;

      // If we're already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            // Retry the request with new token
            return fetch(originalRequest, {
              ...getCommonOptions(),
              headers: getHeaders()
            }).then(handleResponse);
          })
          .catch(err => {
            throw err;
          });
      }

      isRefreshing = true;

      // Try to refresh the token
      try {
        // Check if we're not already on the refresh-token endpoint to avoid loops
        if (!originalRequest.includes('/auth/refresh-token')) {
          const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
            method: 'POST',
            ...getCommonOptions(),
            headers: getHeaders()
          }).then(res => {
            if (!res.ok) {
              throw new Error('Failed to refresh token');
            }
            return res.json();
          });

          if (refreshResponse && refreshResponse.accessToken) {
            localStorage.setItem('token', refreshResponse.accessToken);
            isRefreshing = false;
            processQueue(null, refreshResponse.accessToken);

            // Retry the original request that failed
            return fetch(originalRequest, {
              ...getCommonOptions(),
              headers: getHeaders()
            }).then(handleResponse);
          }
        } else {
          // If we're already trying to refresh the token and got 401, token is invalid
          // Use window.toast to avoid circular dependency
          if (window?.Toastify) {
            window.Toastify({
              text: 'Your session has expired. Please log in again.',
              duration: 3000,
              close: true,
              gravity: 'top',
              position: 'right',
              backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
              stopOnFocus: true
            }).showToast();
          }

          // Clear local storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');

          // Redirect to login after a short delay
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        }
      } catch (error) {
        // Display error notification via a custom event
        const event = new CustomEvent('auth:error', {
          detail: { message: 'Authentication failed. Please log in again.' }
        });
        window.dispatchEvent(event);

        isRefreshing = false;
        processQueue(error, null);

        // Clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);

        throw error;
      }
    }

    let errorBody = 'Could not read error body';
    try {
      errorBody = await response.text();
      console.error('API Error Response Body:', errorBody);
      const errorJson = JSON.parse(errorBody);
      throw new Error(errorJson.message || errorBody || 'Something went wrong');
    } catch (e) {
      throw new Error(errorBody || 'Something went wrong');
    }
  }
  try {
    console.log(`[handleResponse] Parsing JSON response for: ${response.url}`);
    const jsonData = await response.json();

    // Log detailed information about classes data
    if (response.url.includes('/classes')) {
      console.log(`[handleResponse] Classes data:`, {
        url: response.url,
        dataType: Array.isArray(jsonData) ? 'array' : typeof jsonData,
        length: Array.isArray(jsonData) ? jsonData.length : 'not an array',
        data: jsonData
      });
    }

    return jsonData;
  } catch (e) {
    if (response.status === 204) {
      console.log(`[handleResponse] No content response (204) for: ${response.url}`);
      return null;
    }
    console.error(`[handleResponse] Failed to parse response for: ${response.url}`, e);
    throw new Error('Received invalid response format from server');
  }
};

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
    console.log('[API] classesAPI.getAll called with filters:', filters);

    const queryParams = new URLSearchParams()
    if (filters.grade_level) {
      queryParams.append('grade_level', filters.grade_level)
      console.log(`[API] Added grade_level filter: ${filters.grade_level}`);
    }

    const url = `${API_BASE_URL}/classes${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    console.log(`[API] Making request to URL: ${url}`);

    try {
      console.log('[API] Sending fetch request with headers:', getHeaders());
      const response = await fetch(url, {
        headers: getHeaders(),
        credentials: 'include'
      });

      console.log(`[API] Received response with status: ${response.status}`);

      if (!response.ok) {
        console.error(`[API] Error response: ${response.status} ${response.statusText}`);
        // Let handleResponse handle the error
      }

      const data = await handleResponse(response);
      console.log('[API] Parsed response data:', data);
      return data;
    } catch (error) {
      console.error('[API] Exception in classesAPI.getAll:', error);
      throw error;
    }
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
    fetch(`${API_BASE_URL}/curriculums/0`, {
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

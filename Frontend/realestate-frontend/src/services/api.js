import axios from 'axios'

const BASE_URL = '/api'

// create axios instance
const api = axios.create({ baseURL: BASE_URL })

// attach token automatically to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('re_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ═══════════════════════════════════════
// AUTH
// ═══════════════════════════════════════
export const authAPI = {
  register: (formData) => api.post('/auth/register', formData),          // formData (multipart)
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/change-password', data),
}

// ═══════════════════════════════════════
// USERS (Admin)
// ═══════════════════════════════════════
export const userAPI = {
  getAll: (params) => api.get('/user/users', { params }),                // ?role=&city=&isActive=
  getById: (id) => api.get(`/user/${id}`),
  update: (id, formData) => api.put(`/user/${id}`, formData),
  toggleStatus: (id) => api.patch(`/user/toggle/${id}`),
  changeRole: (id, role) => api.patch(`/user/role/${id}`, { role }),
  delete: (id) => api.delete(`/user/${id}`),
}

// ═══════════════════════════════════════
// PROPERTIES
// ═══════════════════════════════════════
export const propertyAPI = {
  add: (formData) => api.post('/property/add', formData),               // formData (multipart, images)
  getAll: (params) => api.get('/property/all', { params }),             // public + filters
  getAllAdmin: (params) => api.get('/property/admin/all', { params }),  // admin all
  getMy: () => api.get('/property/my'),
  getById: (id) => api.get(`/property/${id}`),
  searchByCity: (city) => api.get(`/property/city/${city}`),
  update: (id, formData) => api.put(`/property/${id}`, formData),
  updateApproval: (id, status) => api.patch(`/property/approval/${id}`, { approvalStatus: status }),
  delete: (id) => api.delete(`/property/${id}`),
}

// ═══════════════════════════════════════
// INQUIRIES
// ═══════════════════════════════════════
export const inquiryAPI = {
  create: (data) => api.post('/inquiry/add', data),
  getMy: () => api.get('/inquiry/my'),
  getAll: () => api.get('/inquiry/all'),
  getByProperty: (propertyId) => api.get(`/inquiry/property/${propertyId}`),
  updateStatus: (id, status) => api.patch(`/inquiry/${id}`, { status }),
  delete: (id) => api.delete(`/inquiry/${id}`),
}

// ═══════════════════════════════════════
// VISITS
// ═══════════════════════════════════════
export const visitAPI = {
  schedule: (data) => api.post('/visit/schedule', data),
  getMy: () => api.get('/visit/my'),
  getAll: () => api.get('/visit/all'),
  getByProperty: (propertyId) => api.get(`/visit/property/${propertyId}`),
  updateStatus: (id, status) => api.patch(`/visit/${id}`, { status }),
}

// ═══════════════════════════════════════
// FAVORITES
// ═══════════════════════════════════════
export const favoriteAPI = {
  add: (propertyId) => api.post('/favorite/add', { propertyId }),
  getMy: () => api.get('/favorite/my'),
  remove: (propertyId) => api.delete(`/favorite/${propertyId}`),
}

// ═══════════════════════════════════════
// REVIEWS
// ═══════════════════════════════════════
export const reviewAPI = {
  add: (data) => api.post('/review/add', data),
  getByProperty: (propertyId) => api.get(`/review/property/${propertyId}`),
  getAll: () => api.get('/review/all'),
  delete: (id) => api.delete(`/review/${id}`),
}

// ═══════════════════════════════════════
// PAYMENTS
// ═══════════════════════════════════════
export const paymentAPI = {
  create: (data) => api.post('/payment/create', data),
  getMy: () => api.get('/payment/my'),
  getAll: (params) => api.get('/payment/all', { params }),
  updateStatus: (id, status) => api.patch(`/payment/${id}`, { status }),
}

// ═══════════════════════════════════════
// SUPPORT TICKETS
// ═══════════════════════════════════════
export const supportAPI = {
  create: (data) => api.post('/support/create', data),
  getMy: () => api.get('/support/my'),
  getAll: (params) => api.get('/support/all', { params }),
  respond: (id, data) => api.patch(`/support/${id}`, data),
  delete: (id) => api.delete(`/support/${id}`),
}

export default api

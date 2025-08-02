import axios from 'axios';

//integrate Clerk's getToken() method here.
let clerkToken: string | null = null;
export const setClerkToken = (token: string) => {
    clerkToken = token;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    if (clerkToken) {
      config.headers.Authorization = `Bearer ${clerkToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Admin Endpoints
export const getAdminBookings = () => api.get('/api/admin/bookings');
export const approveBooking = (id: number) => api.put(`/api/admin/bookings/${id}/approve`);
export const completeBooking = (id: number) => api.put(`/api/admin/bookings/${id}/complete`);
export const createClassroom = (data: any) => api.post('/api/admin/classrooms', data);
export const createMentor = (data: any) => api.post('/api/admin/mentors', data);

// Student Endpoints
export const createBooking = (data: any) => api.post('/api/student/bookings', data);
export const getStudentDashboard = () => api.get('/api/student/dashboard');

// Public Endpoints
export const getAllClasses = () => api.get('/api/student/classrooms');
export const getMentorProfile = (id: string) => api.get(`/api/mentors/${id}`);

export default api;
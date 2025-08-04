import axios from 'axios';
import type { CreateClassroomRequest, CreateMentorRequest, CreateBookingRequest } from './types';

let getClerkToken: () => Promise<string | null>;

export const setAuthTokenFunction = (tokenFetcher: () => Promise<string | null>) => {
  getClerkToken = tokenFetcher;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(
  async (config) => {
    if (getClerkToken) {
      const token = await getClerkToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ADMIN
export const createClassroom = (data: CreateClassroomRequest) => api.post('/admin/classrooms', data);
export const createMentor = (data: CreateMentorRequest) => api.post('/admin/mentors', data);
export const getAdminBookings = (page: number, searchTerm: string) => 
  api.get(`/admin/bookings?page=${page}&size=10&searchTerm=${searchTerm}`);
export const approveBooking = (id: number) => api.put(`/admin/bookings/${id}/approve`);
export const completeBooking = (id: number) => api.put(`/admin/bookings/${id}/complete`);
export const getAdminDashboardStats = () => api.get('/admin/dashboard/stats');
export const getDailyBookings = () => api.get('/admin/dashboard/daily-bookings');


// STUDENT
export const getStudentDashboard = () => api.get('/student/dashboard');
export const createBooking = (data: CreateBookingRequest) => api.post('/student/bookings', data);
export const getAllClassesForStudent = () => api.get('/student/classrooms');

// MENTOR / PUBLIC
export const getAllMentors = () => api.get('/mentors');
export const getMentorProfile = (id: number) => api.get(`/mentors/${id}`);

// FILE UPLOAD
export const uploadFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export default api;
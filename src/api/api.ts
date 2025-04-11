import axios, { AxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/authStore';
import {
  UserCreate,
  UserRead,
  UserLogin,
  Token,
  HTTPValidationError,
  TournamentCreate,
  TournamentRead,
  TournamentReadWithDetails,
  TournamentUpdate,
  TournamentCategoryCreate,
  TournamentCategoryRead,
  TournamentCategoryUpdate,
  RegistrationCreate,
  RegistrationRead,
  RegistrationReadWithDetails,
  RegistrationStatusUpdate,
  UserUpdate,
  TournamentStatus,
} from './type';

// const BASE_URL = 'http://85.202.192.67:8001';
const BASE_URL = 'http://localhost:3001'; // Локальный фейковый сервер

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

export const apiClient = {
  // Authentication
  register: (data: UserCreate, config?: AxiosRequestConfig) =>
    api.post<UserRead>('/api/auth/register', data, config),

  login: (data: UserLogin, config?: AxiosRequestConfig) =>
    api.post<Token>('/api/auth/login', data, config),

  createUserType: (userType: string, config?: AxiosRequestConfig) =>
    api.post<any>('/api/auth/create_user_type', undefined, {
      params: { user_type: userType },
      ...config,
    }),

  getMe: (config?: AxiosRequestConfig) => api.get<UserRead>('/api/auth/me', config),

  updateMe: (data: UserUpdate, config?: AxiosRequestConfig) =>
    api.put<UserRead>('/api/auth/me', data, config),

  // Admin Tournaments
  createTournament: (data: TournamentCreate, config?: AxiosRequestConfig) =>
    api.post<TournamentRead>('/api/admin/tournaments/', data, config),

  getTournaments: (
    skip = 0,
    limit = 100,
    status?: TournamentStatus | null,
    config?: AxiosRequestConfig,
  ) =>
    api.get<TournamentRead[]>('/api/admin/tournaments/', {
      params: { skip, limit, status },
      ...config,
    }),

  getTournament: (tournamentId: number, config?: AxiosRequestConfig) =>
    api.get<TournamentReadWithDetails>(`/api/admin/tournaments/${tournamentId}`, config),

  updateTournament: (tournamentId: number, data: TournamentUpdate, config?: AxiosRequestConfig) =>
    api.put<TournamentRead>(`/api/admin/tournaments/${tournamentId}`, data, config),

  deleteTournament: (tournamentId: number, config?: AxiosRequestConfig) =>
    api.delete<void>(`/api/admin/tournaments/${tournamentId}`, config),

  // Admin Categories
  createTournamentCategory: (
    tournamentId: number,
    data: TournamentCategoryCreate,
    config?: AxiosRequestConfig,
  ) => api.post<TournamentCategoryRead>(`/api/admin/tournaments/${tournamentId}/categories`, data, config),

  getTournamentCategories: (
    tournamentId: number,
    skip = 0,
    limit = 100,
    config?: AxiosRequestConfig,
  ) =>
    api.get<TournamentCategoryRead[]>(`/api/admin/tournaments/${tournamentId}/categories`, {
      params: { skip, limit },
      ...config,
    }),

  updateTournamentCategory: (categoryId: number, data: TournamentCategoryUpdate, config?: AxiosRequestConfig) =>
    api.put<TournamentCategoryRead>(`/api/admin/categories/${categoryId}`, data, config),

  deleteTournamentCategory: (categoryId: number, config?: AxiosRequestConfig) =>
    api.delete<void>(`/api/admin/categories/${categoryId}`, config),

  // Admin Registrations
  getTournamentRegistrations: (
    tournamentId: number,
    skip = 0,
    limit = 100,
    config?: AxiosRequestConfig,
  ) =>
    api.get<RegistrationReadWithDetails[]>(`/api/admin/tournaments/${tournamentId}/registrations`, {
      params: { skip, limit },
      ...config,
    }),

  updateRegistrationStatus: (
    registrationId: number,
    data: RegistrationStatusUpdate,
    config?: AxiosRequestConfig,
  ) => api.put<RegistrationRead>(`/api/admin/registrations/${registrationId}`, data, config),

  // Public Tournaments
  getAvailableTournaments: (
    skip = 0,
    limit = 100,
    status?: TournamentStatus | null,
    config?: AxiosRequestConfig,
  ) =>
    api.get<TournamentRead[]>('/api/tournaments/', {
      params: { skip, limit, status },
      ...config,
    }),

  getPublicTournamentDetails: (tournamentId: number, config?: AxiosRequestConfig) =>
    api.get<TournamentReadWithDetails>(`/api/tournaments/${tournamentId}`, config),

  getPublicTournamentCategories: (
    tournamentId: number,
    skip = 0,
    limit = 100,
    config?: AxiosRequestConfig,
  ) =>
    api.get<TournamentCategoryRead[]>(`/api/tournaments/${tournamentId}/categories`, {
      params: { skip, limit },
      ...config,
    }),

  // Registrations
  createRegistration: (data: RegistrationCreate, config?: AxiosRequestConfig) =>
    api.post<RegistrationRead>('/api/registrations/', data, config),

  getMyRegistrations: (skip = 0, limit = 100, config?: AxiosRequestConfig) =>
    api.get<RegistrationReadWithDetails[]>('/api/registrations/', {
      params: { skip, limit },
      ...config,
    }),

  getMyRegistration: (registrationId: number, config?: AxiosRequestConfig) =>
    api.get<RegistrationReadWithDetails>(`/api/registrations/${registrationId}`, config),

  cancelMyRegistration: (registrationId: number, config?: AxiosRequestConfig) =>
    api.delete<void>(`/api/registrations/${registrationId}`, config),

  // Athlete Profile
  getAthleteProfile: (config?: AxiosRequestConfig) => api.get<UserRead>('/api/athlete/profile', config),

  updateAthleteProfile: (data: UserUpdate, config?: AxiosRequestConfig) =>
    api.put<UserRead>('/api/athlete/profile', data, config),
};

// Тип для ответа с ошибками 
export type ApiError = {
  response: {
    status: number;
    data: HTTPValidationError;
  };
};
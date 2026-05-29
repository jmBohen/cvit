import apiClient from './client'

export interface LoginPayload {
  email: string
  password: string
}
export interface RegisterPayload {
  email: string
  password: string
  firstName: string
}
export interface AuthResponse {
  accessToken: string
}

export const login = (data: LoginPayload) =>
  apiClient.post<AuthResponse>('/auth/login', data).then((r) => r.data)

export const register = (data: RegisterPayload) =>
  apiClient.post('/users', data).then((r) => r.data)

import { client } from './client'

export interface RegisterData {
    username: string
    password: string
    email: string
    name: string
    surname: string
}

export interface LoginData {
    username: string
    password: string
}

export interface AuthResponse {
    token: string
}

export const register = (data: RegisterData) =>
    client.post<AuthResponse>('api/auth/register', data)

export const login = (data: LoginData) =>
    client.post<AuthResponse>('api/auth/login', data)

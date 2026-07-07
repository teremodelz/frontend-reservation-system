import { client } from './client'
import type { UserDTO } from '../types/admin'

export interface EditUserPayload {
    name?: string
    surname?: string
    email?: string
    password?: string
}

export interface EditTutorPayload extends EditUserPayload {
    hourlyRate?: number
    description?: string
}

export const UserApi = {
    getMe: () => client.get<UserDTO>('api/users/me'),
    editMe: (data: EditUserPayload) => client.patch<UserDTO>('api/users/me', data),
}

export const TutorProfileApi = {
    editMe: (data: EditTutorPayload) => client.patch<UserDTO>('api/tutors/me', data),
}

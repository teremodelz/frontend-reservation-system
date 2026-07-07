import { client } from './client'
import type { UserDTO, LessonDTO, TutorApplicationDTO } from '../types/admin'

export interface AdminEditUserPayload {
    name?: string
    surname?: string
    email?: string
    username?: string
    password?: string
}

export const AdminApi = {
    getAllUsers: () => client.get<UserDTO[]>('api/admin/users'),
    getUser: (id: number) => client.get<UserDTO>(`api/admin/users/${id}`),
    editUser: (id: number, payload: AdminEditUserPayload) => client.patch<UserDTO>(`api/admin/users/${id}`, payload),
    deleteUser: (id: number) => client.delete<string>(`api/admin/users/${id}`),
    getAllLessons: () => client.get<LessonDTO[]>('api/admin/users/lessons'),
    getAllApplications: () => client.get<TutorApplicationDTO[]>('api/admin/tutor-applications'),
    rejectApplication: (id: number) => client.patch<TutorApplicationDTO>(`api/admin/tutor-applications/${id}/reject`),
    approveApplication: (id: number) => client.patch<TutorApplicationDTO>(`api/admin/tutor-applications/${id}/approve`),
    addAvailability: (tutorId: number, payload: { dayOfWeek: string; startTime: string; endTime: string }) =>
        client.post<string>(`api/admin/users/${tutorId}/availability`, payload),
    addLesson: (payload: { tutorId: number; studentId: number; startDateTime: string; durationMinutes: number }) =>
        client.post(`api/admin/lessons`, payload),
}

export const TutorApplicationApi = {
    submit: (data: { name: string; surname: string; email: string; phone: string; subjectsWanted: string }) =>
        client.post<TutorApplicationDTO>('api/tutor-applications', data),
}

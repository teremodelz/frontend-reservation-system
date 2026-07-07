import type { LessonStatus } from './api'

export interface RoleDTO {
    id: number
    name: string
}

export interface UserDTO {
    id: number
    username: string
    email: string
    name: string
    surname: string
    roles: RoleDTO[]
}

export interface LessonDTO {
    id: number
    tutorId: number
    tutorName: string
    studentId: number
    studentName: string
    lessonStatus: LessonStatus
    startDateTime: string
    durationMinutes: number
}

export type TutorApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface TutorApplicationDTO {
    id: number
    name: string
    surname: string
    email: string
    phone: string
    subjectsWanted: string
    status: TutorApplicationStatus
    createdAt: string
}

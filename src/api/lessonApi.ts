import {client} from './client'
import type { GetLessonDTO, CreateLessonDTO } from '../types/api'

export const LessonApi = {
    getAll : () => client.get<GetLessonDTO[]>('api/lessons'),
    getById : (id: number) => client.get<GetLessonDTO>(`/api/lessons/${id}`),
    create : (data: CreateLessonDTO) => client.post<GetLessonDTO>(`api/lessons/booking`, data),
    cancel : (id: number) => client.patch<string>(`api/lessons/${id}/cancel`),
    accept : (id: number) => client.patch<string>(`api/lessons/${id}/accept`),
    complete : (id: number) => client.patch<string>(`api/lessons/${id}/complete`),
}

import {client} from './client'
import type {TutorDTO, AvailabilityDTO, SubjectDTO, DayOfWeek} from '../types/tutor'

export interface PostAvailabilityPayload {
    dayOfWeek: DayOfWeek
    startTime: string  // "HH:mm:ss"
    endTime: string
}

export const TutorApi = {
    getAll : () => client.get<TutorDTO[]>('api/tutors'),
    getById : (id : number) => client.get<TutorDTO>(`api/tutors/${id}`),
    getAvailabilityOfTutor: (id : number) => client.get<AvailabilityDTO[]>(`api/tutors/${id}/availability`),
    getSubjectsOfTutor: (id : number) => client.get<SubjectDTO[]>(`api/${id}/subjects`),
}

export const AvailabilityApi = {
    addSlot: (payload: PostAvailabilityPayload) => client.post<string>('api/availability', payload),
    deleteSlot: (id: number) => client.delete<string>(`api/availability/${id}`),
    deleteAll: () => client.delete<string>('api/availability'),
}

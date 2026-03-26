import {client} from './client'
import type {TutorDTO, AvailabilityDTO, SubjectDTO} from '../types/tutor'

export const TutorApi = {
    getAll : () => client.get<TutorDTO[]>('api/tutors'),
    getById : (id : number) => client.get<TutorDTO>(`api/tutors/${id}`),
    getAvailabilityOfTutor: (id : number) => client.get<AvailabilityDTO[]>(`api/tutors/${id}/availability`),
    getSubjectsOfTutor: (id : number) => client.get<SubjectDTO[]>(`api/${id}/subjects`)
}

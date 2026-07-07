import { client } from './client'
import type { SubjectDTO } from '../types/tutor'

export const SubjectApi = {
    getAll: () => client.get<SubjectDTO[]>('api/subjects'),
}

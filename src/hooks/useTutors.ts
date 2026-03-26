import { useQuery } from '@tanstack/react-query'
import { TutorApi } from '../api/tutorApi'

export const useTutors = () => {
    return useQuery({
        queryKey: ['tutors'],
        queryFn: () => TutorApi.getAll(),
    })
}

export const useTutor = (id : number) => {
    return useQuery({
        queryKey: ['tutors', id],
        queryFn: () => TutorApi.getById(id),
        enabled: !!id,
    })
}

export const useTutorAvailability = (id: number) => {
    return useQuery({
        queryKey: ['tutors', id, 'availability'],
        queryFn: () => TutorApi.getAvailabilityOfTutor(id),
        enabled: !!id,
    })
}


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { LessonApi } from '../api/lessonApi'

export const useLessons = () =>
    useQuery({
        queryKey: ['lessons'],
        queryFn: () => LessonApi.getAll(),
    })

export const useCancelLesson = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => LessonApi.cancel(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lessons'] }),
    })
}

export const useAcceptLesson = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => LessonApi.accept(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lessons'] }),
    })
}

export const useCompleteLesson = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => LessonApi.complete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lessons'] }),
    })
}

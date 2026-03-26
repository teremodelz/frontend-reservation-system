export type LessonStatus = 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'PENDING'
export type PaymentMethod = 'CARD' | 'CASH' | 'TRANSFER'
export type PaymentStatus = 'UNPAID' | 'FAILED' | 'PAID' | 'REFUNDED' | 'PENDING'
export type StudentLevel = 'BEGINNER' |'PREINTERMEDIATE' |'INTERMEDIATE' | 'UPPERINTERMEDIATE' | 'ADVANCED'


export interface GetLessonDTO {
    tutorName : string
    tutorSurname : string
    studentName : string
    studentSurname : string
    lessonStatus : LessonStatus
    startDateTime : string
    durationMinutes : number
}

export interface CreateLessonDTO{
    tutorID : number
    studentID : number
    startDateTime : string
    durationMinutes : number
}
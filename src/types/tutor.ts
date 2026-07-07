export type DayOfWeek = 
  'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 
  'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'

  
  export interface SubjectDTO{
    name : string
  }

  export interface AvailabilityDTO{
    id: number
    dayOfWeek : DayOfWeek
    startTime : string
    endTime : string
  }


  export interface TutorDTO {
    userId : number
    email : string
    name : string
    surname : string
    subjects : SubjectDTO[]
    hourlyRate : number
    availabilityList : AvailabilityDTO[]
    description : string
  }
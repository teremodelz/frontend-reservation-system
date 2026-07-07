import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { LessonApi } from '../api/lessonApi'
import { getUser, isLoggedIn } from '../api/tokenService'
import type { TutorDTO, DayOfWeek } from '../types/tutor'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const DAY_JS_TO_BACKEND: Record<number, DayOfWeek> = {
  1: 'MONDAY',
  2: 'TUESDAY',
  3: 'WEDNESDAY',
  4: 'THURSDAY',
  5: 'FRIDAY',
  6: 'SATURDAY',
  0: 'SUNDAY',
}

const DAY_PL: Record<DayOfWeek, string> = {
  MONDAY:    'Pon',
  TUESDAY:   'Wt',
  WEDNESDAY: 'Śr',
  THURSDAY:  'Czw',
  FRIDAY:    'Pt',
  SATURDAY:  'Sob',
  SUNDAY:    'Nd',
}

function getNext14Days(availability: TutorDTO['availabilityList']) {
  const availableDays = new Set(availability.map(a => a.dayOfWeek))
  const dates: Date[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const backendDay = DAY_JS_TO_BACKEND[d.getDay()]
    if (availableDays.has(backendDay)) dates.push(d)
  }
  return dates
}

function toLocalDatetimeString(date: Date, time: string) {
  const [h, m] = time.split(':')
  const d = new Date(date)
  d.setHours(Number(h), Number(m), 0, 0)
  // format: YYYY-MM-DDTHH:mm:ss
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`
}

interface Props {
  tutor: TutorDTO
  onClose: () => void
}

export function BookingModal({ tutor, onClose }: Props) {
  const navigate = useNavigate()
  const user = getUser()
  const loggedIn = isLoggedIn()

  const availableDates = getNext14Days(tutor.availabilityList)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState('')
  const [duration, setDuration] = useState(60)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const slotsForDate = selectedDate
    ? tutor.availabilityList.filter(
        a => a.dayOfWeek === DAY_JS_TO_BACKEND[selectedDate.getDay()]
      )
    : []

  const mutation = useMutation({
    mutationFn: () =>
      LessonApi.create({
        tutorID: tutor.userId,
        studentID: user!.userId,
        startDateTime: toLocalDatetimeString(selectedDate!, selectedTime),
        durationMinutes: duration,
      }),
    onSuccess: () => setSuccess(true),
    onError: (e: Error) => setError(e.message),
  })

  if (!loggedIn) {
    return (
      <Overlay onClose={onClose}>
        <p className="text-center mb-4">Musisz być zalogowany, aby zarezerwować lekcję.</p>
        <Button className="w-full" onClick={() => navigate('/login')}>Zaloguj się</Button>
      </Overlay>
    )
  }

  if (user?.roles.includes('ROLE_TUTOR')) {
    return (
      <Overlay onClose={onClose}>
        <p className="text-center text-muted-foreground">Korepetytorzy nie mogą rezerwować lekcji.</p>
      </Overlay>
    )
  }

  if (success) {
    return (
      <Overlay onClose={onClose}>
        <div className="text-center flex flex-col gap-4">
          <div className="text-4xl">✓</div>
          <p className="text-lg font-semibold">Lekcja zarezerwowana!</p>
          <p className="text-muted-foreground text-sm">Czekaj na potwierdzenie od korepetytora.</p>
          <Button onClick={() => { onClose(); navigate('/dashboard') }}>
            Przejdź do panelu
          </Button>
        </div>
      </Overlay>
    )
  }

  const canSubmit = selectedDate && selectedTime && !mutation.isPending

  return (
    <Overlay onClose={onClose}>
      <h2 className="text-xl font-bold mb-1">Zarezerwuj lekcję</h2>
      <p className="text-muted-foreground text-sm mb-5">
        u {tutor.name} {tutor.surname} · {tutor.hourlyRate} zł/h
      </p>

      {/* Wybór daty */}
      <p className="text-sm font-medium mb-2">Wybierz dzień</p>
      <div className="flex flex-wrap gap-2 mb-5">
        {availableDates.length === 0 && (
          <p className="text-muted-foreground text-sm">Brak dostępnych terminów w ciągu 14 dni.</p>
        )}
        {availableDates.map((d, i) => {
          const backendDay = DAY_JS_TO_BACKEND[d.getDay()]
          const label = `${DAY_PL[backendDay]} ${d.getDate().toString().padStart(2,'0')}.${(d.getMonth()+1).toString().padStart(2,'0')}`
          const isSelected = selectedDate?.toDateString() === d.toDateString()
          return (
            <button
              key={i}
              onClick={() => { setSelectedDate(d); setSelectedTime('') }}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                isSelected
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border hover:bg-accent'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Wybór godziny */}
      {selectedDate && (
        <>
          <p className="text-sm font-medium mb-2">Godzina rozpoczęcia</p>
          {slotsForDate.map((slot, i) => (
            <p key={i} className="text-xs text-muted-foreground mb-1">
              Dostępność: {slot.startTime.slice(0,5)} – {slot.endTime.slice(0,5)}
            </p>
          ))}
          <input
            type="time"
            value={selectedTime}
            onChange={e => setSelectedTime(e.target.value)}
            min={slotsForDate[0]?.startTime.slice(0,5)}
            max={slotsForDate[slotsForDate.length-1]?.endTime.slice(0,5)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm mb-5"
          />
        </>
      )}

      {/* Czas trwania */}
      <p className="text-sm font-medium mb-2">Czas trwania</p>
      <div className="flex gap-2 mb-5">
        {[30, 60, 90].map(d => (
          <button
            key={d}
            onClick={() => setDuration(d)}
            className={`px-4 py-1.5 rounded-lg text-sm border transition-colors ${
              duration === d
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border hover:bg-accent'
            }`}
          >
            {d} min
          </button>
        ))}
      </div>

      {/* Podsumowanie ceny */}
      {selectedTime && (
        <div className="rounded-lg bg-muted/30 border border-border px-4 py-3 mb-5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Szacowany koszt</span>
            <span className="font-semibold">{Math.round(tutor.hourlyRate * duration / 60)} zł</span>
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onClose}>
          Anuluj
        </Button>
        <Button
          className="flex-1"
          disabled={!canSubmit}
          onClick={() => { setError(null); mutation.mutate() }}
        >
          {mutation.isPending ? 'Rezerwowanie...' : 'Zarezerwuj'}
        </Button>
      </div>
    </Overlay>
  )
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

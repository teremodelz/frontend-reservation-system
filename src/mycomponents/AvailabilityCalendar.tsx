import type { AvailabilityDTO, DayOfWeek } from '../types/tutor'

const DAY_PL: Record<DayOfWeek, string> = {
  MONDAY:    'Poniedziałek',
  TUESDAY:   'Wtorek',
  WEDNESDAY: 'Środa',
  THURSDAY:  'Czwartek',
  FRIDAY:    'Piątek',
  SATURDAY:  'Sobota',
  SUNDAY:    'Niedziela',
}

const DAY_ORDER: DayOfWeek[] = [
  'MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY',
]

function formatTime(t: string) {
  return t.slice(0, 5)
}

export function AvailabilityCalendar({ availability }: { availability: AvailabilityDTO[] }) {
  if (!availability || availability.length === 0) {
    return <p className="text-muted-foreground text-sm">Brak dostępnych terminów.</p>
  }

  const byDay: Partial<Record<DayOfWeek, AvailabilityDTO[]>> = {}
  for (const slot of availability) {
    if (!byDay[slot.dayOfWeek]) byDay[slot.dayOfWeek] = []
    byDay[slot.dayOfWeek]!.push(slot)
  }

  return (
    <div className="flex flex-col gap-2">
      {DAY_ORDER.filter(d => byDay[d]).map(day => (
        <div key={day} className="flex items-start gap-4 py-2 border-b border-border last:border-0">
          <span className="w-36 text-sm font-medium text-foreground shrink-0">
            {DAY_PL[day]}
          </span>
          <div className="flex flex-wrap gap-2">
            {byDay[day]!.map((slot, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
              >
                {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

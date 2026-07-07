import { useState } from 'react'
import type { ComponentType } from 'react'
import { NavigationBarFull } from '../mycomponents/NavBar'
import { Footer } from '../mycomponents/Footer'
import { getUser } from '../api/tokenService'
import { useLessons, useCancelLesson, useAcceptLesson, useCompleteLesson } from '../hooks/useLessons'
import type { GetLessonDTO, LessonStatus } from '../types/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '../context/ToastContext'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { TutorApi, AvailabilityApi } from '../api/tutorApi'
import type { AvailabilityDTO, DayOfWeek } from '../types/tutor'
import { X, Plus } from 'lucide-react'

// ─── Status helpers ──────────────────────────────────────────────────────────

const STATUS_LABELS: Record<LessonStatus, string> = {
    PENDING: 'Oczekująca',
    CONFIRMED: 'Potwierdzona',
    COMPLETED: 'Zakończona',
    CANCELLED: 'Anulowana',
}

const STATUS_COLORS: Record<LessonStatus, string> = {
    PENDING: 'bg-yellow-500/20 text-yellow-700',
    CONFIRMED: 'bg-blue-500/20 text-blue-700',
    COMPLETED: 'bg-green-500/20 text-green-700',
    CANCELLED: 'bg-red-500/20 text-red-700',
}

function StatusBadge({ status }: { status: LessonStatus }) {
    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[status]}`}>
            {STATUS_LABELS[status]}
        </span>
    )
}

function formatDateTime(dt: string) {
    return new Date(dt).toLocaleString('pl-PL', { dateStyle: 'medium', timeStyle: 'short' })
}

// ─── Lesson rows ─────────────────────────────────────────────────────────────

function TutorLessonRow({ lesson }: { lesson: GetLessonDTO }) {
    const { toast } = useToast()
    const cancel = useCancelLesson()
    const accept = useAcceptLesson()
    const complete = useCompleteLesson()

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-border bg-card/50">
            <div className="flex flex-col gap-1">
                <span className="font-medium text-black">{lesson.studentName} {lesson.studentSurname}</span>
                <span className="text-sm text-muted-foreground">{formatDateTime(lesson.startDateTime)} · {lesson.durationMinutes} min</span>
                <StatusBadge status={lesson.lessonStatus} />
            </div>
            <div className="flex gap-2 flex-wrap">
                {lesson.lessonStatus === 'PENDING' && (
                    <Button size="sm"
                        onClick={() => accept.mutate(lesson.lessonId, {
                            onSuccess: () => toast('Lekcja potwierdzona.', 'success'),
                            onError: (e: Error) => toast(e.message, 'error'),
                        })}
                        disabled={accept.isPending}>
                        Potwierdź
                    </Button>
                )}
                {lesson.lessonStatus === 'CONFIRMED' && (
                    <Button size="sm"
                        onClick={() => complete.mutate(lesson.lessonId, {
                            onSuccess: () => toast('Lekcja oznaczona jako zakończona.', 'success'),
                            onError: (e: Error) => toast(e.message, 'error'),
                        })}
                        disabled={complete.isPending}>
                        Oznacz jako zakończoną
                    </Button>
                )}
                {(lesson.lessonStatus === 'PENDING' || lesson.lessonStatus === 'CONFIRMED') && (
                    <Button size="sm" variant="destructive"
                        onClick={() => cancel.mutate(lesson.lessonId, {
                            onSuccess: () => toast('Lekcja anulowana.', 'info'),
                            onError: (e: Error) => toast(e.message, 'error'),
                        })}
                        disabled={cancel.isPending}>
                        Anuluj
                    </Button>
                )}
            </div>
        </div>
    )
}

function StudentLessonRow({ lesson }: { lesson: GetLessonDTO }) {
    const { toast } = useToast()
    const cancel = useCancelLesson()

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-border bg-card/50">
            <div className="flex flex-col gap-1">
                <span className="font-medium text-black">{lesson.tutorName} {lesson.tutorSurname}</span>
                <span className="text-sm text-muted-foreground">{formatDateTime(lesson.startDateTime)} · {lesson.durationMinutes} min</span>
                <StatusBadge status={lesson.lessonStatus} />
            </div>
            {(lesson.lessonStatus === 'PENDING' || lesson.lessonStatus === 'CONFIRMED') && (
                <Button size="sm" variant="destructive"
                    onClick={() => cancel.mutate(lesson.lessonId, {
                        onSuccess: () => toast('Lekcja anulowana.', 'info'),
                        onError: (e: Error) => toast(e.message, 'error'),
                    })}
                    disabled={cancel.isPending}>
                    Anuluj
                </Button>
            )}
        </div>
    )
}

// ─── Section ─────────────────────────────────────────────────────────────────

function Section({
    title, lessons, RowComponent, emptyText,
}: {
    title: string
    lessons: GetLessonDTO[]
    RowComponent: ComponentType<{ lesson: GetLessonDTO }>
    emptyText: string
}) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-xl">{title}</CardTitle>
                {lessons.length === 0 && <CardDescription>{emptyText}</CardDescription>}
            </CardHeader>
            {lessons.length > 0 && (
                <CardContent className="flex flex-col gap-3">
                    {lessons.map(lesson => (
                        <RowComponent key={lesson.lessonId} lesson={lesson} />
                    ))}
                </CardContent>
            )}
        </Card>
    )
}

// ─── Tutor lesson dashboard ───────────────────────────────────────────────────

function TutorDashboard({ lessons }: { lessons: GetLessonDTO[] }) {
    const pending = lessons.filter(l => l.lessonStatus === 'PENDING')
    const upcoming = lessons.filter(l => l.lessonStatus === 'CONFIRMED')
    const past = lessons.filter(l => l.lessonStatus === 'COMPLETED' || l.lessonStatus === 'CANCELLED')

    return (
        <div className="flex flex-col gap-6">
            <Section title="Oczekujące na potwierdzenie" lessons={pending} RowComponent={TutorLessonRow} emptyText="Brak lekcji oczekujących." />
            <Section title="Nadchodzące lekcje" lessons={upcoming} RowComponent={TutorLessonRow} emptyText="Brak nadchodzących lekcji." />
            <Section title="Historia" lessons={past} RowComponent={TutorLessonRow} emptyText="Brak zakończonych lekcji." />
        </div>
    )
}

// ─── Student lesson dashboard ─────────────────────────────────────────────────

function StudentDashboard({ lessons }: { lessons: GetLessonDTO[] }) {
    const active = lessons.filter(l => l.lessonStatus === 'PENDING' || l.lessonStatus === 'CONFIRMED')
    const past = lessons.filter(l => l.lessonStatus === 'COMPLETED' || l.lessonStatus === 'CANCELLED')

    return (
        <div className="flex flex-col gap-6">
            <Section title="Moje lekcje" lessons={active} RowComponent={StudentLessonRow} emptyText="Brak aktywnych lekcji. Znajdź korepetytora!" />
            <Section title="Historia" lessons={past} RowComponent={StudentLessonRow} emptyText="Brak zakończonych lekcji." />
        </div>
    )
}

// ─── Tutor calendar ───────────────────────────────────────────────────────────

const CAL_DAY_NAMES = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd']
const CAL_DAY_KEYS: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

// java.time.DayOfWeek serializes as number (1=Mon..7=Sun) without JSR310 config
function normalizeDayOfWeek(dow: DayOfWeek | number): DayOfWeek {
    if (typeof dow === 'number') return CAL_DAY_KEYS[dow - 1]
    return dow
}

function formatSlotTime(t: string | number[]): string {
    if (Array.isArray(t)) return `${String(t[0]).padStart(2, '0')}:${String(t[1]).padStart(2, '0')}`
    return t.slice(0, 5)
}

function getDayIndex(dt: string): number {
    const js = new Date(dt).getDay()
    return js === 0 ? 6 : js - 1
}

function TutorCalendar({ lessons, tutorId }: { lessons: GetLessonDTO[], tutorId: number }) {
    const active = lessons.filter(l => l.lessonStatus === 'PENDING' || l.lessonStatus === 'CONFIRMED')
    const { toast } = useToast()
    const qc = useQueryClient()

    const { data: availability } = useQuery({
        queryKey: ['availability', tutorId],
        queryFn: () => TutorApi.getAvailabilityOfTutor(tutorId),
    })

    const deleteSlot = useMutation({
        mutationFn: (id: number) => AvailabilityApi.deleteSlot(id),
        onSuccess: () => {
            toast('Slot usunięty.', 'info')
            qc.invalidateQueries({ queryKey: ['availability', tutorId] })
        },
        onError: (e: Error) => toast(e.message, 'error'),
    })

    const availByDay: Partial<Record<DayOfWeek, AvailabilityDTO[]>> = {}
    for (const slot of (availability ?? [])) {
        const key = normalizeDayOfWeek(slot.dayOfWeek as DayOfWeek | number)
        if (!availByDay[key]) availByDay[key] = []
        availByDay[key]!.push(slot)
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-xl">Kalendarz tygodniowy</CardTitle>
                <CardDescription>Twoje nadchodzące lekcje i dyspozycyjność według dni tygodnia</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-7 gap-2">
                    {CAL_DAY_NAMES.map((name, i) => {
                        const dayKey = CAL_DAY_KEYS[i]
                        const dayLessons = active.filter(l => getDayIndex(l.startDateTime) === i)
                        const daySlots = availByDay[dayKey] ?? []
                        const isEmpty = dayLessons.length === 0 && daySlots.length === 0

                        type CalItem =
                            | { kind: 'slot'; slot: AvailabilityDTO; sortKey: string }
                            | { kind: 'lesson'; lesson: GetLessonDTO; sortKey: string }

                        const items: CalItem[] = [
                            ...daySlots.map(slot => ({
                                kind: 'slot' as const,
                                slot,
                                sortKey: formatSlotTime(slot.startTime as string | number[]),
                            })),
                            ...dayLessons.map(lesson => ({
                                kind: 'lesson' as const,
                                lesson,
                                sortKey: new Date(lesson.startDateTime).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
                            })),
                        ].sort((a, b) => a.sortKey.localeCompare(b.sortKey))

                        return (
                            <div key={name} className="flex flex-col gap-1">
                                <div className="text-center text-xs font-semibold text-muted-foreground pb-1 border-b border-border">
                                    {name}
                                </div>

                                {isEmpty && (
                                    <div className="text-center text-xs text-muted-foreground py-4 opacity-40">—</div>
                                )}

                                {items.map(item => item.kind === 'slot' ? (
                                    <div key={`slot-${item.slot.id}`}
                                        className="group relative rounded p-1.5 pr-6 text-xs bg-green-500/15 border border-green-500/30 text-green-300 overflow-hidden">
                                        <div className="font-medium">
                                            {formatSlotTime(item.slot.startTime as string | number[])} – {formatSlotTime(item.slot.endTime as string | number[])}
                                        </div>
                                        <div className="text-[10px] opacity-60">dostępny</div>
                                        <button
                                            onClick={() => deleteSlot.mutate(item.slot.id)}
                                            className="absolute top-0.5 right-0.5 hidden group-hover:flex items-center justify-center w-4 h-4 rounded-full bg-red-500/80 hover:bg-red-500 text-white"
                                        >
                                            <X className="w-2.5 h-2.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div key={`lesson-${item.lesson.lessonId}`}
                                        className={`rounded p-1.5 text-xs ${item.lesson.lessonStatus === 'PENDING' ? 'bg-yellow-500/15 border border-yellow-500/30 text-yellow-300' : 'bg-blue-500/15 border border-blue-500/30 text-blue-300'}`}>
                                        <div className="font-medium">
                                            {new Date(item.lesson.startDateTime).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="truncate text-white/70">{item.lesson.studentName}</div>
                                        <div className="text-[10px] opacity-60">{item.lesson.durationMinutes} min</div>
                                    </div>
                                ))}
                            </div>
                        )
                    })}
                </div>
                <div className="flex gap-4 mt-4 pt-3 border-t border-border">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="w-3 h-3 rounded bg-green-500/30 border border-green-500/50" />
                        Dyspozycyjność
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="w-3 h-3 rounded bg-yellow-500/30 border border-yellow-500/50" />
                        Oczekująca
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="w-3 h-3 rounded bg-blue-500/30 border border-blue-500/50" />
                        Potwierdzona
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// ─── Add availability modal ───────────────────────────────────────────────────

const DAY_OPTIONS: { value: DayOfWeek; label: string }[] = [
    { value: 'MONDAY',    label: 'Poniedziałek' },
    { value: 'TUESDAY',   label: 'Wtorek' },
    { value: 'WEDNESDAY', label: 'Środa' },
    { value: 'THURSDAY',  label: 'Czwartek' },
    { value: 'FRIDAY',    label: 'Piątek' },
    { value: 'SATURDAY',  label: 'Sobota' },
    { value: 'SUNDAY',    label: 'Niedziela' },
]

function timeToMinutes(t: string) {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
}

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number) {
    return aStart < bEnd && aEnd > bStart
}

function AddAvailabilityModal({
    open, onClose, tutorId, existing,
}: {
    open: boolean
    onClose: () => void
    tutorId: number
    existing: AvailabilityDTO[]
}) {
    const { toast } = useToast()
    const qc = useQueryClient()
    const [form, setForm] = useState({ dayOfWeek: 'MONDAY' as DayOfWeek, startTime: '08:00', endTime: '10:00' })

    const addMutation = useMutation({
        mutationFn: () => AvailabilityApi.addSlot({
            dayOfWeek: form.dayOfWeek,
            startTime: `${form.startTime}:00`,
            endTime: `${form.endTime}:00`,
        }),
        onSuccess: () => {
            toast('Dyspozycyjność dodana pomyślnie.', 'success')
            qc.invalidateQueries({ queryKey: ['availability', tutorId] })
            onClose()
        },
        onError: (e: Error) => toast(e.message, 'error'),
    })

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const newStart = timeToMinutes(form.startTime)
        const newEnd = timeToMinutes(form.endTime)

        if (newEnd <= newStart) {
            toast('Godzina zakończenia musi być późniejsza niż rozpoczęcia.', 'error')
            return
        }

        const conflict = existing.find(slot => {
            const key = normalizeDayOfWeek(slot.dayOfWeek as DayOfWeek | number)
            if (key !== form.dayOfWeek) return false
            const slotStart = timeToMinutes(formatSlotTime(slot.startTime as string | number[]))
            const slotEnd = timeToMinutes(formatSlotTime(slot.endTime as string | number[]))
            return overlaps(newStart, newEnd, slotStart, slotEnd)
        })

        if (conflict) {
            toast(`Konflikt z istniejącym slotem: ${formatSlotTime(conflict.startTime as string | number[])} – ${formatSlotTime(conflict.endTime as string | number[])}.`, 'error')
            return
        }

        addMutation.mutate()
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-semibold text-foreground">Dodaj dyspozycyjność</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-foreground">Dzień tygodnia</label>
                        <select
                            value={form.dayOfWeek}
                            onChange={e => setForm(f => ({ ...f, dayOfWeek: e.target.value as DayOfWeek }))}
                            className="h-10 rounded-lg border border-input bg-transparent px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            {DAY_OPTIONS.map(d => (
                                <option key={d.value} value={d.value}>{d.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-foreground">Od</label>
                            <input
                                type="time"
                                value={form.startTime}
                                onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))}
                                className="h-10 rounded-lg border border-input bg-transparent px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-foreground">Do</label>
                            <input
                                type="time"
                                value={form.endTime}
                                onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))}
                                className="h-10 rounded-lg border border-input bg-transparent px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full mt-1" disabled={addMutation.isPending}>
                        {addMutation.isPending ? 'Dodawanie...' : 'Dodaj slot'}
                    </Button>
                </form>
            </div>
        </div>
    )
}

// ─── Availability tab ─────────────────────────────────────────────────────────

const DAY_LABELS: Record<DayOfWeek, string> = {
    MONDAY: 'Poniedziałek', TUESDAY: 'Wtorek', WEDNESDAY: 'Środa',
    THURSDAY: 'Czwartek', FRIDAY: 'Piątek', SATURDAY: 'Sobota', SUNDAY: 'Niedziela',
}
const DAY_ORDER: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

function AvailabilityTab({ slots, tutorId }: { slots: AvailabilityDTO[]; tutorId: number }) {
    const { toast } = useToast()
    const qc = useQueryClient()

    const deleteMutation = useMutation({
        mutationFn: (id: number) => AvailabilityApi.deleteSlot(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['availability', tutorId] })
            toast({ type: 'success', message: 'Slot usunięty.' })
        },
        onError: () => toast({ type: 'error', message: 'Nie udało się usunąć slotu.' }),
    })

    const grouped = DAY_ORDER.reduce<Record<DayOfWeek, AvailabilityDTO[]>>((acc, day) => {
        acc[day] = slots.filter(s => normalizeDayOfWeek(s.dayOfWeek) === day)
            .sort((a, b) => formatSlotTime(a.startTime).localeCompare(formatSlotTime(b.startTime)))
        return acc
    }, {} as Record<DayOfWeek, AvailabilityDTO[]>)

    const activeDays = DAY_ORDER.filter(d => grouped[d].length > 0)

    return (
        <div className="flex flex-col gap-6">
            {activeDays.length === 0 ? (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xl">Dyspozycyjność</CardTitle>
                        <CardDescription>Nie masz jeszcze żadnych slotów. Dodaj dyspozycyjność klikając przycisk powyżej.</CardDescription>
                    </CardHeader>
                </Card>
            ) : (
                activeDays.map(day => (
                    <Card key={day}>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-xl">{DAY_LABELS[day]}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            {grouped[day].map(slot => (
                                <div key={slot.id} className="flex items-center justify-between p-3 rounded-lg border bg-green-50 border-green-200">
                                    <span className="font-medium text-green-800">
                                        {formatSlotTime(slot.startTime)} – {formatSlotTime(slot.endTime)}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                                        onClick={() => deleteMutation.mutate(slot.id)}
                                        disabled={deleteMutation.isPending}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function DashboardPage() {
    const navigate = useNavigate()
    const user = getUser()
    const { data: lessons, isLoading, error } = useLessons()
    const isTutor = user?.roles.includes('ROLE_TUTOR') ?? false
    const isAdmin = user?.roles.includes('ROLE_ADMIN') ?? false
    const [activeTab, setActiveTab] = useState('lessons')
    const [modalOpen, setModalOpen] = useState(false)

    const { data: availability } = useQuery({
        queryKey: ['availability', user?.userId],
        queryFn: () => TutorApi.getAvailabilityOfTutor(user!.userId),
        enabled: isTutor && !!user,
    })

    if (isAdmin) {
        navigate('/admin')
        return null
    }

    return (
        <div className="min-h-screen bg-[oklch(21%_0.006_285.885)] flex flex-col">
            <NavigationBarFull />
            <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            Witaj, {user?.name} {user?.surname}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            {isTutor ? 'Panel korepetytora' : 'Panel ucznia'}
                        </p>
                    </div>
                    {(activeTab === 'calendar' || activeTab === 'availability') && isTutor ? (
                        <Button variant="outline" size="sm" onClick={() => setModalOpen(true)}>
                            <Plus className="w-4 h-4 mr-1.5" />
                            Dodaj dyspozycyjność
                        </Button>
                    ) : (
                        <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
                            Edytuj profil
                        </Button>
                    )}
                </div>

                {isLoading && <p className="text-muted-foreground">Ładowanie lekcji...</p>}
                {error && <p className="text-red-500">Błąd: {(error as Error).message}</p>}

                {isTutor && (
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="w-full h-11 mb-6">
                            <TabsTrigger value="lessons" className="flex-1">Lekcje</TabsTrigger>
                            <TabsTrigger value="calendar" className="flex-1">Kalendarz</TabsTrigger>
                            <TabsTrigger value="availability" className="flex-1">Dyspozycyjność</TabsTrigger>
                        </TabsList>
                        <TabsContent value="lessons">
                            {lessons && <TutorDashboard lessons={lessons} />}
                        </TabsContent>
                        <TabsContent value="calendar">
                            {lessons && user && <TutorCalendar lessons={lessons} tutorId={user.userId} />}
                        </TabsContent>
                        <TabsContent value="availability">
                            {user && <AvailabilityTab slots={availability ?? []} tutorId={user.userId} />}
                        </TabsContent>
                    </Tabs>
                )}

                {!isTutor && !isAdmin && lessons && <StudentDashboard lessons={lessons} />}
            </div>
            <Footer />

            {isTutor && user && (
                <AddAvailabilityModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    tutorId={user.userId}
                    existing={availability ?? []}
                />
            )}
        </div>
    )
}

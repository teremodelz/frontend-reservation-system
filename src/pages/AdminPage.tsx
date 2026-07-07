import { useEffect, useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { NavigationBarFull } from "../mycomponents/NavBar"
import { Footer } from "../mycomponents/Footer"
import { AdminApi } from "../api/adminApi"
import type { AdminEditUserPayload } from "../api/adminApi"
import { getUser, isLoggedIn } from "../api/tokenService"
import { useToast } from "../context/ToastContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Plus } from "lucide-react"
import type { TutorApplicationStatus, UserDTO, LessonDTO } from "../types/admin"
import { TutorApi } from "../api/tutorApi"
import type { AvailabilityDTO, DayOfWeek } from "../types/tutor"

const APP_STATUS_LABEL: Record<TutorApplicationStatus, string> = {
    PENDING: 'Oczekujące',
    APPROVED: 'Zaakceptowane',
    REJECTED: 'Odrzucone',
}
const APP_STATUS_COLOR: Record<TutorApplicationStatus, string> = {
    PENDING: 'bg-yellow-500/20 text-yellow-400',
    APPROVED: 'bg-green-500/20 text-green-600',
    REJECTED: 'bg-red-500/20 text-red-400',
}

function formatDateTime(dt: string) {
    return new Date(dt).toLocaleString('pl-PL', { dateStyle: 'medium', timeStyle: 'short' })
}

// ─── Add availability modal ───────────────────────────────────────────────────

const DAYS: { value: DayOfWeek; label: string }[] = [
    { value: 'MONDAY', label: 'Poniedziałek' },
    { value: 'TUESDAY', label: 'Wtorek' },
    { value: 'WEDNESDAY', label: 'Środa' },
    { value: 'THURSDAY', label: 'Czwartek' },
    { value: 'FRIDAY', label: 'Piątek' },
    { value: 'SATURDAY', label: 'Sobota' },
    { value: 'SUNDAY', label: 'Niedziela' },
]

function AddAvailabilityModal({ tutorId, onClose }: { tutorId: number; onClose: () => void }) {
    const { toast } = useToast()
    const qc = useQueryClient()
    const [form, setForm] = useState({ dayOfWeek: 'MONDAY' as DayOfWeek, startTime: '', endTime: '' })

    const mutation = useMutation({
        mutationFn: () => AdminApi.addAvailability(tutorId, {
            dayOfWeek: form.dayOfWeek,
            startTime: form.startTime + ':00',
            endTime: form.endTime + ':00',
        }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin-availability', tutorId] })
            toast('Dyspozycyjność dodana.', 'success')
            onClose()
        },
        onError: (e: Error) => toast(e.message, 'error'),
    })

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
            <div className="bg-background rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6" onMouseDown={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                    <p className="font-semibold text-foreground">Dodaj dyspozycyjność</p>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
                </div>
                <form onSubmit={e => { e.preventDefault(); mutation.mutate() }} className="flex flex-col gap-4">
                    <div className="grid gap-1.5">
                        <Label>Dzień tygodnia</Label>
                        <select
                            value={form.dayOfWeek}
                            onChange={e => setForm(f => ({ ...f, dayOfWeek: e.target.value as DayOfWeek }))}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                            {DAYS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-1.5">
                            <Label>Od</Label>
                            <Input type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} required />
                        </div>
                        <div className="grid gap-1.5">
                            <Label>Do</Label>
                            <Input type="time" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} required />
                        </div>
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                        <Button type="button" variant="outline" onClick={onClose}>Anuluj</Button>
                        <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Dodawanie...' : 'Dodaj'}</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ─── Add lesson modal ──────────────────────────────────────────────────────────

function AddLessonModal({ defaultTutorId, defaultStudentId, onClose }: { defaultTutorId?: number; defaultStudentId?: number; onClose: () => void }) {
    const { toast } = useToast()
    const qc = useQueryClient()

    const { data: allUsers } = useQuery({ queryKey: ['admin-users'], queryFn: () => AdminApi.getAllUsers() })
    const tutors = useMemo(() => allUsers?.filter(u => u.roles.some(r => r.name === 'ROLE_TUTOR')) ?? [], [allUsers])
    const students = useMemo(() => allUsers?.filter(u => u.roles.some(r => r.name === 'ROLE_STUDENT')) ?? [], [allUsers])

    const [form, setForm] = useState({
        tutorId: defaultTutorId ?? '',
        studentId: defaultStudentId ?? '',
        date: '',
        time: '',
        durationMinutes: 60,
    })

    const mutation = useMutation({
        mutationFn: () => AdminApi.addLesson({
            tutorId: Number(form.tutorId),
            studentId: Number(form.studentId),
            startDateTime: `${form.date}T${form.time}:00`,
            durationMinutes: form.durationMinutes,
        }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin-lessons'] })
            toast('Lekcja dodana.', 'success')
            onClose()
        },
        onError: (e: Error) => toast(e.message, 'error'),
    })

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
            <div className="bg-background rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6" onMouseDown={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                    <p className="font-semibold text-foreground">Dodaj lekcję</p>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
                </div>
                <form onSubmit={e => { e.preventDefault(); mutation.mutate() }} className="flex flex-col gap-4">
                    <div className="grid gap-1.5">
                        <Label>Korepetytor</Label>
                        <select
                            value={form.tutorId}
                            onChange={e => setForm(f => ({ ...f, tutorId: e.target.value }))}
                            required
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                            <option value="">Wybierz...</option>
                            {tutors.map(u => <option key={u.id} value={u.id}>{u.name} {u.surname}</option>)}
                        </select>
                    </div>
                    <div className="grid gap-1.5">
                        <Label>Uczeń</Label>
                        <select
                            value={form.studentId}
                            onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))}
                            required
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                            <option value="">Wybierz...</option>
                            {students.map(u => <option key={u.id} value={u.id}>{u.name} {u.surname}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-1.5">
                            <Label>Data</Label>
                            <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
                        </div>
                        <div className="grid gap-1.5">
                            <Label>Godzina</Label>
                            <Input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} required />
                        </div>
                    </div>
                    <div className="grid gap-1.5">
                        <Label>Długość (minuty)</Label>
                        <Input type="number" min={15} step={15} value={form.durationMinutes} onChange={e => setForm(f => ({ ...f, durationMinutes: Number(e.target.value) }))} required />
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                        <Button type="button" variant="outline" onClick={onClose}>Anuluj</Button>
                        <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Dodawanie...' : 'Dodaj'}</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ─── Admin user calendar ──────────────────────────────────────────────────────

const CAL_DAY_NAMES = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd']
const CAL_DAY_KEYS: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

function normalizeDOW(dow: DayOfWeek | number): DayOfWeek {
    if (typeof dow === 'number') return CAL_DAY_KEYS[dow - 1]
    return dow
}
function fmtSlot(t: string | number[]): string {
    if (Array.isArray(t)) return `${String(t[0]).padStart(2, '0')}:${String(t[1]).padStart(2, '0')}`
    return t.slice(0, 5)
}
function getDayIdx(dt: string): number {
    const js = new Date(dt).getDay()
    return js === 0 ? 6 : js - 1
}

function AdminUserCalendar({ user }: { user: UserDTO }) {
    const isTutor = user.roles.some(r => r.name === 'ROLE_TUTOR')
    const isStudent = user.roles.some(r => r.name === 'ROLE_STUDENT')
    const [showAddAvail, setShowAddAvail] = useState(false)
    const [showAddLesson, setShowAddLesson] = useState(false)

    const { data: availability, isLoading: loadingAvail } = useQuery({
        queryKey: ['admin-availability', user.id],
        queryFn: () => TutorApi.getAvailabilityOfTutor(user.id),
        enabled: isTutor,
    })

    const { data: allLessons, isLoading: loadingLessons } = useQuery({
        queryKey: ['admin-lessons'],
        queryFn: () => AdminApi.getAllLessons(),
    })

    const userLessons = (allLessons ?? []).filter(l =>
        (l.tutorId === user.id || l.studentId === user.id) &&
        (l.lessonStatus === 'PENDING' || l.lessonStatus === 'CONFIRMED')
    )

    const availByDay: Partial<Record<DayOfWeek, AvailabilityDTO[]>> = {}
    for (const slot of (availability ?? [])) {
        const key = normalizeDOW(slot.dayOfWeek as DayOfWeek | number)
        if (!availByDay[key]) availByDay[key] = []
        availByDay[key]!.push(slot)
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2 justify-end">
                {isTutor && (
                    <Button size="sm" variant="outline" onClick={() => setShowAddAvail(true)}>
                        <Plus className="w-4 h-4 mr-1.5" />
                        Dodaj dyspozycyjność
                    </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => setShowAddLesson(true)}>
                    <Plus className="w-4 h-4 mr-1.5" />
                    Dodaj lekcję
                </Button>
            </div>
            {showAddAvail && <AddAvailabilityModal tutorId={user.id} onClose={() => setShowAddAvail(false)} />}
            {showAddLesson && (
                <AddLessonModal
                    defaultTutorId={isTutor ? user.id : undefined}
                    defaultStudentId={isStudent ? user.id : undefined}
                    onClose={() => setShowAddLesson(false)}
                />
            )}

            {(loadingAvail || loadingLessons) ? (
                <p className="text-muted-foreground text-sm">Ładowanie...</p>
            ) : (
                <>
                    <div className="grid grid-cols-7 gap-2">
                        {CAL_DAY_NAMES.map((name, i) => {
                            const dayKey = CAL_DAY_KEYS[i]
                            const daySlots = isTutor ? (availByDay[dayKey] ?? []) : []
                            const dayLessons = userLessons.filter(l => getDayIdx(l.startDateTime) === i)
                            const isEmpty = daySlots.length === 0 && dayLessons.length === 0

                            type Item =
                                | { kind: 'slot'; slot: AvailabilityDTO; sortKey: string }
                                | { kind: 'lesson'; lesson: LessonDTO; sortKey: string }

                            const items: Item[] = [
                                ...daySlots.map(slot => ({ kind: 'slot' as const, slot, sortKey: fmtSlot(slot.startTime as string | number[]) })),
                                ...dayLessons.map(lesson => ({ kind: 'lesson' as const, lesson, sortKey: new Date(lesson.startDateTime).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }) })),
                            ].sort((a, b) => a.sortKey.localeCompare(b.sortKey))

                            return (
                                <div key={name} className="flex flex-col gap-1">
                                    <div className="text-center text-xs font-semibold text-muted-foreground pb-1 border-b border-border">{name}</div>
                                    {isEmpty && <div className="text-center text-xs text-muted-foreground py-4 opacity-40">—</div>}
                                    {items.map(item => item.kind === 'slot' ? (
                                        <div key={`slot-${item.slot.id}`} className="rounded p-1.5 text-xs bg-green-500/15 border border-green-500/30 text-green-300">
                                            <div className="font-medium">{fmtSlot(item.slot.startTime as string | number[])} – {fmtSlot(item.slot.endTime as string | number[])}</div>
                                            <div className="text-[10px] opacity-60">dostępny</div>
                                        </div>
                                    ) : (
                                        <div key={`lesson-${item.lesson.id}`} className={`rounded p-1.5 text-xs ${item.lesson.lessonStatus === 'PENDING' ? 'bg-yellow-500/15 border border-yellow-500/30 text-yellow-300' : 'bg-blue-500/15 border border-blue-500/30 text-blue-300'}`}>
                                            <div className="font-medium">{new Date(item.lesson.startDateTime).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</div>
                                            <div className="truncate text-white/70">{isTutor ? item.lesson.studentName : item.lesson.tutorName}</div>
                                            <div className="text-[10px] opacity-60">{item.lesson.durationMinutes} min</div>
                                        </div>
                                    ))}
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex gap-4 pt-3 border-t border-border">
                        {isTutor && <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><div className="w-3 h-3 rounded bg-green-500/30 border border-green-500/50" />Dyspozycyjność</div>}
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><div className="w-3 h-3 rounded bg-yellow-500/30 border border-yellow-500/50" />Oczekująca</div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><div className="w-3 h-3 rounded bg-blue-500/30 border border-blue-500/50" />Potwierdzona</div>
                    </div>
                </>
            )}
        </div>
    )
}

// ─── User overlay ─────────────────────────────────────────────────────────────

function UserOverlay({ user, onClose }: { user: UserDTO; onClose: () => void }) {
    const { toast } = useToast()
    const qc = useQueryClient()

    const [form, setForm] = useState<AdminEditUserPayload>({
        name: user.name ?? '',
        surname: user.surname ?? '',
        email: user.email ?? '',
        username: user.username ?? '',
        password: '',
    })

    function set(field: keyof AdminEditUserPayload, value: string) {
        setForm(f => ({ ...f, [field]: value }))
    }

    const editMutation = useMutation({
        mutationFn: () => {
            const payload: AdminEditUserPayload = {}
            if (form.name) payload.name = form.name
            if (form.surname) payload.surname = form.surname
            if (form.email) payload.email = form.email
            if (form.username) payload.username = form.username
            if (form.password) payload.password = form.password
            return AdminApi.editUser(user.id, payload)
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin-users'] })
            toast('Dane użytkownika zaktualizowane.', 'success')
        },
        onError: (e: Error) => toast(e.message, 'error'),
    })

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}
        >
            <div className="bg-background rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden" onMouseDown={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div>
                        <p className="font-semibold text-foreground">{user.name} {user.surname}</p>
                        <p className="text-xs text-muted-foreground">@{user.username}</p>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="dane" className="w-full">
                    <TabsList className="w-full rounded-none border-b border-border h-11">
                        <TabsTrigger value="dane" className="flex-1">Dane</TabsTrigger>
                        <TabsTrigger value="kalendarz" className="flex-1">Kalendarz</TabsTrigger>
                    </TabsList>

                    <TabsContent value="dane" className="p-6">
                        <form
                            onSubmit={e => { e.preventDefault(); editMutation.mutate() }}
                            className="flex flex-col gap-4"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-1.5">
                                    <Label htmlFor="name">Imię</Label>
                                    <Input id="name" value={form.name} onChange={e => set('name', e.target.value)} />
                                </div>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="surname">Nazwisko</Label>
                                    <Input id="surname" value={form.surname} onChange={e => set('surname', e.target.value)} />
                                </div>
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="email">E-mail</Label>
                                <Input id="email" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="username">Login</Label>
                                <Input id="username" value={form.username} onChange={e => set('username', e.target.value)} />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="password">Nowe hasło <span className="text-muted-foreground text-xs">(zostaw puste aby nie zmieniać)</span></Label>
                                <Input id="password" type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min. 8 znaków" />
                            </div>
                            <div className="flex gap-2 justify-end pt-2">
                                <Button type="button" variant="outline" onClick={onClose}>Anuluj</Button>
                                <Button type="submit" disabled={editMutation.isPending}>
                                    {editMutation.isPending ? 'Zapisywanie...' : 'Zapisz'}
                                </Button>
                            </div>
                        </form>
                    </TabsContent>

                    <TabsContent value="kalendarz" className="p-6">
                        <AdminUserCalendar user={user} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export function AdminPage() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { toast } = useToast()
    const [mounted, setMounted] = useState(false)
    const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null)
    const user = getUser()
    const logged = isLoggedIn()

    useEffect(() => {
        const id = requestAnimationFrame(() => setMounted(true))
        return () => cancelAnimationFrame(id)
    }, [])

    const { data: users } = useQuery({ queryKey: ['admin-users'], queryFn: () => AdminApi.getAllUsers() })
    const { data: lessons } = useQuery({ queryKey: ['admin-lessons'], queryFn: () => AdminApi.getAllLessons() })
    const { data: applications } = useQuery({ queryKey: ['admin-applications'], queryFn: () => AdminApi.getAllApplications() })

    const deleteUser = useMutation({
        mutationFn: (id: number) => AdminApi.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] })
            toast('Użytkownik usunięty.', 'success')
        },
        onError: (e: Error) => toast(e.message, 'error'),
    })
    const reject = useMutation({
        mutationFn: (id: number) => AdminApi.rejectApplication(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-applications'] })
            toast('Zgłoszenie odrzucone.', 'success')
        },
        onError: (e: Error) => toast(e.message, 'error'),
    })
    const approve = useMutation({
        mutationFn: (id: number) => AdminApi.approveApplication(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-applications'] })
            toast('Konto korepetytora zostało utworzone.', 'success')
        },
        onError: (e: Error) => toast(e.message, 'error'),
    })

    if (!logged || !user?.roles.includes('ROLE_ADMIN')) {
        return (
            <div className="min-h-screen bg-[oklch(21%_0.006_285.885)] flex flex-col">
                <NavigationBarFull />
                <div className="flex-1 flex items-center justify-center flex-col gap-4">
                    <p className="text-white text-lg">Brak dostępu.</p>
                    <Button onClick={() => navigate('/')}>Strona główna</Button>
                </div>
                <Footer />
            </div>
        )
    }

    const pendingCount = applications?.filter(a => a.status === 'PENDING').length ?? 0

    return (
        <div className="min-h-screen bg-[oklch(21%_0.006_285.885)] flex flex-col">
            <NavigationBarFull />

            <div
                className="flex-1 max-w-6xl mx-auto w-full px-6 py-10"
                style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(40px)',
                    transition: 'opacity 500ms ease, transform 500ms ease',
                }}
            >
                <h1 className="text-3xl font-bold text-white mb-8">Panel administratora</h1>

                <Tabs defaultValue="applications">
                    <TabsList className="w-full h-12 mb-6">
                        <TabsTrigger value="applications" className="flex-1 h-full">
                            Zgłoszenia {pendingCount > 0 && <span className="ml-2 rounded-full bg-yellow-500/30 text-yellow-300 text-xs px-2 py-0.5">{pendingCount}</span>}
                        </TabsTrigger>
                        <TabsTrigger value="users" className="flex-1 h-full">Użytkownicy</TabsTrigger>
                    
                    </TabsList>

                    {/* ZGŁOSZENIA */}
                    <TabsContent value="applications">
                        <div className="flex flex-col gap-2">
                            {!applications?.length && <p className="text-muted-foreground">Brak zgłoszeń.</p>}
                            {applications?.map(app => (
                                <Card key={app.id} className="border-border">
                                    <CardContent className="px-5 py-4 flex items-center justify-between gap-4">
                                        <div className="flex flex-col gap-0.5 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-foreground">{app.name} {app.surname}</span>
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium shrink-0 ${APP_STATUS_COLOR[app.status]}`}>
                                                    {APP_STATUS_LABEL[app.status]}
                                                </span>
                                            </div>
                                            <p className="text-sm text-zinc-400">{app.email} · {app.phone}</p>
                                            <p className="text-sm text-zinc-400"><span className="text-zinc-500">Przedmioty: </span>{app.subjectsWanted}</p>
                                            <p className="text-xs text-zinc-500 mt-0.5">{formatDateTime(app.createdAt)}</p>
                                        </div>
                                        {app.status === 'PENDING' && (
                                            <div className="flex gap-2 shrink-0">
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => approve.mutate(app.id)} disabled={approve.isPending}>
                                                    Akceptuj
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => reject.mutate(app.id)} disabled={reject.isPending}>
                                                    Odrzuć
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* UŻYTKOWNICY */}
                    <TabsContent value="users">
                        <div className="flex flex-col gap-2">
                            {!users?.length && <p className="text-muted-foreground">Brak użytkowników.</p>}
                            {users?.filter(u => u.roles.some(r => r.name === 'ROLE_TUTOR' || r.name === 'ROLE_STUDENT')).map(u => (
                                <Card key={u.id} className="border-border">
                                    <CardContent className="px-5 py-4 flex items-center justify-between gap-4">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-medium text-foreground">{u.name} {u.surname}</span>
                                            <span className="text-sm text-muted-foreground">{u.email} · @{u.username}</span>
                                            <div className="flex gap-1 mt-1 flex-wrap">
                                                {u.roles.map(r => (
                                                    <span key={r.id} className="px-2 py-0.5 rounded bg-zinc-700 text-xs text-zinc-300">
                                                        {r.name.replace('ROLE_', '')}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <Button size="sm" variant="outline" onClick={() => setSelectedUser(u)}>
                                                Przeglądaj
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => {
                                                    if (confirm(`Usuń użytkownika ${u.name} ${u.surname}?`))
                                                        deleteUser.mutate(u.id)
                                                }}
                                                disabled={deleteUser.isPending}
                                            >
                                                Usuń
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

               
                </Tabs>
            </div>

            <Footer />

            {selectedUser && <UserOverlay user={selectedUser} onClose={() => setSelectedUser(null)} />}
        </div>
    )
}

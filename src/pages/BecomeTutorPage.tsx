import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation, useQuery } from "@tanstack/react-query"
import { NavigationBarFull } from "../mycomponents/NavBar"
import { Footer } from "../mycomponents/Footer"
import { TutorApplicationApi } from "../api/adminApi"
import { SubjectApi } from "../api/subjectApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function BecomeTutorPage() {
    const navigate = useNavigate()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const id = requestAnimationFrame(() => setMounted(true))
        return () => cancelAnimationFrame(id)
    }, [])

    const { data: subjects } = useQuery({
        queryKey: ['subjects'],
        queryFn: () => SubjectApi.getAll(),
    })

    const [form, setForm] = useState({
        name: '',
        surname: '',
        email: '',
        phone: '',
        subjectsWanted: '',
    })
    const [phoneError, setPhoneError] = useState('')
    const [success, setSuccess] = useState(false)

    function validatePhone(value: string) {
        const digits = value.replace(/\D/g, '')
        if (digits.length < 9) return 'Numer telefonu musi mieć co najmniej 9 cyfr.'
        if (digits.length > 15) return 'Numer telefonu jest za długi.'
        return ''
    }

    const mutation = useMutation({
        mutationFn: () => {
            const err = validatePhone(form.phone)
            if (err) throw new Error(err)
            return TutorApplicationApi.submit(form)
        },
        onSuccess: () => setSuccess(true),
    })

    function handleChange(field: keyof typeof form, value: string) {
        setForm(f => ({ ...f, [field]: value }))
    }

    function toggleSubject(name: string) {
        const current = form.subjectsWanted
            ? form.subjectsWanted.split(',').map(s => s.trim()).filter(Boolean)
            : []
        const updated = current.includes(name)
            ? current.filter(s => s !== name)
            : [...current, name]
        setForm(f => ({ ...f, subjectsWanted: updated.join(', ') }))
    }

    const selectedSubjects = form.subjectsWanted
        ? form.subjectsWanted.split(',').map(s => s.trim()).filter(Boolean)
        : []

    return (
        <div className="min-h-screen bg-[oklch(21%_0.006_285.885)] flex flex-col">
            <NavigationBarFull />

            <div className="flex-1 flex justify-center px-6 py-16">
                <div
                    className="w-full max-w-2xl"
                    style={{
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? 'translateY(0)' : 'translateY(40px)',
                        transition: 'opacity 500ms ease, transform 500ms ease',
                    }}
                >
                    <Card>
                        <CardHeader className="p-8">
                            <CardTitle className="text-3xl">Zostań korepetytorem</CardTitle>
                            <CardDescription className="text-base mt-2">
                                Wypełnij formularz — skontaktujemy się z Tobą w ciągu 48 godzin.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="px-8 pb-8">
                            {success ? (
                                <div className="text-center flex flex-col gap-4 py-6">
                                    <div className="text-5xl">✓</div>
                                    <p className="text-xl font-semibold text-white">Zgłoszenie wysłane!</p>
                                    <p className="text-muted-foreground">
                                        Skontaktujemy się z Tobą w ciągu 48 godzin.
                                    </p>
                                    <Button variant="outline" onClick={() => navigate('/')}>
                                        Wróć na stronę główną
                                    </Button>
                                </div>
                            ) : (
                                <form
                                    onSubmit={e => { e.preventDefault(); mutation.mutate() }}
                                    className="flex flex-col gap-6"
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Imię</Label>
                                            <Input
                                                id="name"
                                                placeholder="Jan"
                                                value={form.name}
                                                onChange={e => handleChange('name', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="surname">Nazwisko</Label>
                                            <Input
                                                id="surname"
                                                placeholder="Kowalski"
                                                value={form.surname}
                                                onChange={e => handleChange('surname', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Adres e-mail</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="jan@example.com"
                                            value={form.email}
                                            onChange={e => handleChange('email', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">Numer telefonu</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="+48 123 456 789"
                                            value={form.phone}
                                            onChange={e => {
                                                handleChange('phone', e.target.value)
                                                setPhoneError(validatePhone(e.target.value))
                                            }}
                                            required
                                        />
                                        {phoneError && (
                                            <p className="text-red-500 text-xs">{phoneError}</p>
                                        )}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Przedmioty, które chcesz uczyć</Label>
                                        <p className="text-xs text-muted-foreground -mt-1">Wybierz co najmniej jeden.</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                                            {subjects?.map(s => {
                                                const active = selectedSubjects.includes(s.name)
                                                return (
                                                    <button
                                                        key={s.name}
                                                        type="button"
                                                        onClick={() => toggleSubject(s.name)}
                                                        className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm text-left transition-colors ${
                                                            active
                                                                ? 'bg-white text-black border-zinc-300 font-medium'
                                                                : 'border-border text-muted-foreground hover:border-zinc-500 hover:text-foreground'
                                                        }`}
                                                    >
                                                        <span className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center ${
                                                            active ? 'bg-black border-black' : 'border-zinc-500'
                                                        }`}>
                                                            {active && (
                                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                                                                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                                </svg>
                                                            )}
                                                        </span>
                                                        {s.name}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {mutation.isError && (
                                        <p className="text-red-500 text-sm">{(mutation.error as Error).message}</p>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={mutation.isPending || selectedSubjects.length === 0}
                                    >
                                        {mutation.isPending ? 'Wysyłanie...' : 'Wyślij zgłoszenie'}
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Footer />
        </div>
    )
}

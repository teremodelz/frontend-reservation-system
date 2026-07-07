import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { NavigationBarFull } from '../mycomponents/NavBar'
import { Footer } from '../mycomponents/Footer'
import { getUser } from '../api/tokenService'
import { UserApi, TutorProfileApi } from '../api/userApi'
import { useToast } from '../context/ToastContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export function ProfilePage() {
    const navigate = useNavigate()
    const { toast } = useToast()
    const user = getUser()
    const isTutor = user?.roles.includes('ROLE_TUTOR') ?? false
    const isAdmin = user?.roles.includes('ROLE_ADMIN') ?? false
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const id = requestAnimationFrame(() => setMounted(true))
        return () => cancelAnimationFrame(id)
    }, [])

    const [form, setForm] = useState({
        name: user?.name ?? '',
        surname: user?.surname ?? '',
        email: '',
        password: '',
        confirmPassword: '',
        hourlyRate: '',
        description: '',
    })

    function set(field: keyof typeof form, value: string) {
        setForm(f => ({ ...f, [field]: value }))
    }

    const mutation = useMutation({
        mutationFn: () => {
            if (form.password && form.password !== form.confirmPassword)
                throw new Error('Hasła nie są identyczne.')

            const base = {
                name: form.name || undefined,
                surname: form.surname || undefined,
                email: form.email || undefined,
                password: form.password || undefined,
            }

            if (isTutor) {
                return TutorProfileApi.editMe({
                    ...base,
                    hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : undefined,
                    description: form.description || undefined,
                })
            }
            return UserApi.editMe(base)
        },
        onSuccess: () => {
            toast('Profil zaktualizowany. Zaloguj się ponownie aby odświeżyć dane.', 'success')
            setForm(f => ({ ...f, password: '', confirmPassword: '' }))
        },
        onError: (e: Error) => toast(e.message, 'error'),
    })

    if (!user) {
        navigate('/login')
        return null
    }

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
                            <CardTitle className="text-3xl">Edytuj profil</CardTitle>
                            <CardDescription className="text-base mt-1">
                                Pozostaw pola puste, jeśli nie chcesz ich zmieniać.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-8 pb-8">
                            <form
                                onSubmit={e => { e.preventDefault(); mutation.mutate() }}
                                className="flex flex-col gap-5"
                            >
                                {!isAdmin && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Imię</Label>
                                            <Input id="name" value={form.name}
                                                onChange={e => set('name', e.target.value)}
                                                placeholder={user.name} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="surname">Nazwisko</Label>
                                            <Input id="surname" value={form.surname}
                                                onChange={e => set('surname', e.target.value)}
                                                placeholder={user.surname} />
                                        </div>
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Adres e-mail</Label>
                                    <Input id="email" type="email" value={form.email}
                                        onChange={e => set('email', e.target.value)}
                                        placeholder="Nowy adres e-mail" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Nowe hasło</Label>
                                        <Input id="password" type="password" value={form.password}
                                            onChange={e => set('password', e.target.value)}
                                            placeholder="Min. 8 znaków" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
                                        <Input id="confirmPassword" type="password" value={form.confirmPassword}
                                            onChange={e => set('confirmPassword', e.target.value)}
                                            placeholder="Powtórz hasło" />
                                    </div>
                                </div>

                                {isTutor && (
                                    <>
                                        <div className="border-t border-border pt-4">
                                            <p className="text-sm font-medium text-muted-foreground mb-4">Dane korepetytora</p>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="hourlyRate">Stawka godzinowa (zł)</Label>
                                            <Input id="hourlyRate" type="number" min="1" value={form.hourlyRate}
                                                onChange={e => set('hourlyRate', e.target.value)}
                                                placeholder="np. 80" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="description">Opis profilu</Label>
                                            <textarea
                                                id="description"
                                                value={form.description}
                                                onChange={e => set('description', e.target.value)}
                                                placeholder="Opisz swoje doświadczenie i metodę nauczania..."
                                                rows={4}
                                                className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                                            />
                                        </div>
                                    </>
                                )}

                                <Button type="submit" className="w-full mt-2" disabled={mutation.isPending}>
                                    {mutation.isPending ? 'Zapisywanie...' : 'Zapisz zmiany'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Footer />
        </div>
    )
}

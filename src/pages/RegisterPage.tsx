import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { register } from '../api/authapi'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"





interface RegisterForm {
    username: string
    password: string
    email: string
    name: string
    surname: string
}

function RegisterPage() {
    const [form, setForm] = useState<RegisterForm>({
        username: '',
        password: '',
        email: '',
        name: '',
        surname: '',
    })
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    function handleChange(e: ChangeEvent<HTMLInputElement>): void {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            await register(form)
            window.location.href = '/login'
        } catch (err) {
            setError((err as Error).message)
        } finally {
            setLoading(false)
        }
    }

   return (
        <div className="min-h-screen flex items-center justify-center bg-[oklch(21%_0.006_285.885)]">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>TutoringWebAppProject</CardTitle>
                    <CardTitle>Zarejestruj się</CardTitle>
                    <CardDescription>
                        Wprowadź poniższe dane i dolącz do naszej spoleczności.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">

                            {error && <p className="text-red-500 text-sm">{error}</p>}

                            <div className="grid gap-2">
                                <Label htmlFor="username">Login</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="kosior1234"
                                    value={form.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Hasło</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="kosior.tomasz@przyklad.pl"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div className="grid gap-2">
                                <Label htmlFor="name">Imię</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="string"
                                    placeholder="Imię"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            

                            <div className="grid gap-2">
                                <Label htmlFor="surname">Nazwisko</Label>
                                <Input
                                    id="surname"
                                    name="surname"
                                    type="string"
                                    placeholder="Nazwisko"
                                    value={form.surname}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Rejestruje twoje konto..' : 'Zarejestruj się'}
                            </Button>

                            <p className="text-center text-sm">
                                Posiadasz już konto?{' '}
                                <a href="/login" className="underline underline-offset-4 hover:text-primary">
                                    Zaloguj się
                                </a>
                            </p>
                            <p className="text-center text-sm">
                                 <a href="/test" className="underline underline-offset-4 hover:text-primary">
                                    Powrót do strony glównej.
                                </a>
                            </p>


                             
                                
                               



                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default RegisterPage

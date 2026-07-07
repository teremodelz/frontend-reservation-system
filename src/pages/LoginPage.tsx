import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { login } from '../api/authapi'
import { saveToken } from '../api/tokenService'
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

interface LoginForm {
    username: string
    password: string
}

function LoginPage() {
    const [form, setForm] = useState<LoginForm>({ username: '', password: '' })
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
            const res = await login(form)
            if (res?.token) {
                saveToken(res.token)
                window.location.href = '/dashboard'
            }
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
                    <CardTitle>Zaloguj się do swojego konta</CardTitle>
                    <CardDescription>
                        Wprowadź login i hasło do swojego konta.
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
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Logowanie...' : 'Zaloguj się'}
                            </Button>

                            <p className="text-center text-sm">
                                Nie masz konta?{' '}
                                <a href="/register" className="underline underline-offset-4 hover:text-primary">
                                    Zarejestruj się
                                </a>
                            </p>
                             <p className="text-center text-sm">
                                 <a href="/" className="underline underline-offset-4 hover:text-primary">
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

export default LoginPage
import { useState, ChangeEvent, FormEvent } from 'react'
import { login } from '../api/authapi'
import { saveToken } from '../api/tokenService'

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
        <form onSubmit={handleSubmit}>
            <h1>Login testowy</h1>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <input
                name="username"
                type="text"
                placeholder="Login"
                value={form.username}
                onChange={handleChange}
                required
            />
            <input
                name="password"
                type="password"
                placeholder="Haslo"
                value={form.password}
                onChange={handleChange}
                required
            />

            <button type="submit" disabled={loading}>
                {loading ? 'Loguje...' : 'Zaloguj się'}
            </button>

            <a href="/register">Nie masz konta? Zarejestruj się</a>
        </form>
    )
}

export default LoginPage

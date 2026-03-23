import { useState, ChangeEvent, FormEvent } from 'react'
import { register } from '../api/authapi'

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
        <form onSubmit={handleSubmit}>
            <h1>Rejestracja testowa</h1>

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
                placeholder="Hasło"
                value={form.password}
                onChange={handleChange}
                required
            />
            <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
            />
            <input
                name="name"
                type="text"
                placeholder="Imie"
                value={form.name}
                onChange={handleChange}
                required
            />
            <input
                name="surname"
                type="text"
                placeholder="Nazwisko"
                value={form.surname}
                onChange={handleChange}
                required
            />

            <button type="submit" disabled={loading}>
                {loading ? 'Rejestruje...' : 'Zarejestruj się'}
            </button>

            <a href="/login">Masz konto? Zaloguj się</a>
        </form>
    )
}

export default RegisterPage

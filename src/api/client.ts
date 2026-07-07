const BACKEND = 'http://localhost:8080/'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

async function request<T = unknown>(method: HttpMethod, url: string, body?: unknown): Promise<T | null> {
    const token = localStorage.getItem('token')
    const res = await fetch(`${BACKEND}${url}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: body ? JSON.stringify(body) : undefined,
    })

    if (res.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
        return null
    }

    if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { message?: string }
        throw new Error(err.message ?? `HTTP ${res.status}`)
    }

    if (res.status === 204) return null
    const contentType = res.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) return res.json() as Promise<T>
    return res.text() as unknown as Promise<T>
}

export const client = {
    get:    <T = unknown>(url: string)                  => request<T>('GET', url),
    post:   <T = unknown>(url: string, body?: unknown)  => request<T>('POST', url, body),
    put:    <T = unknown>(url: string, body?: unknown)  => request<T>('PUT', url, body),
    delete: <T = unknown>(url: string)                  => request<T>('DELETE', url),
    patch:  <T = unknown>(url: string, body?: unknown)  => request<T>('PATCH', url, body),
}

export interface JwtPayload {
    sub: string
    roles: string[]
    name: string
    surname: string
    id: number
    exp : number
}

export interface User {
    login: string
    roles: string[]
    name: string
    surname: string
    userId: number
}

export function saveToken(token: string): void {
    localStorage.setItem('token', token)
}

export function getToken(): string | null {
    return localStorage.getItem('token')
}

export function removeItem(): void {
    localStorage.removeItem('token')
}

function decodeJwtPayload(token: string): JwtPayload {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0))
    return JSON.parse(new TextDecoder().decode(binary)) as JwtPayload
}

export function getUser(): User | null {
    const token = getToken()
    if (!token) return null
    const payload = decodeJwtPayload(token)
    return {
        login: payload.sub,
        roles: payload.roles,
        name : payload.name,
        surname : payload.surname,
        userId: payload.id,
    }
}

export function isLoggedIn(): boolean {
    const token = getToken()
    if (!token) return false
    try {
        const payload = decodeJwtPayload(token)
        return payload.exp * 1000 > Date.now()
    } catch {
        return false
    }
}
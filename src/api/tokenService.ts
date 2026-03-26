export interface JwtPayload {
    sub: string
    roles: string[]
    name: string
    surname: string
    exp : number
}

export interface User {
    login: string
    roles: string[]
    name: string
    surname: string
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

export function getUser(): User | null {
    const token = getToken()
    if (!token) return null
    const payload = JSON.parse(atob(token.split('.')[1])) as JwtPayload
    return {
        login: payload.sub,
        roles: payload.roles,
        name : payload.name,
        surname : payload.surname
    }
}

export function isLoggedIn(): boolean {
    const token = getToken()
    if (!token) return false
    try {
        const payload = JSON.parse(atob(token.split('.')[1])) as JwtPayload
        return payload.exp * 1000 > Date.now()
    } catch {
        return false
    }
}
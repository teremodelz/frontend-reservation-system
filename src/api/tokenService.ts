export interface JwtPayload {
    sub: string
    roles: string[]
}

export interface User {
    login: string
    roles: string[]
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
    }
}

export function isLoggedIn(): boolean {
    return !!getToken()
}

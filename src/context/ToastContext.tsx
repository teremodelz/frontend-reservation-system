import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
    id: number
    message: string
    type: ToastType
}

interface ToastContextType {
    toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} })

export function useToast() {
    return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const toast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Date.now()
        setToasts(prev => [...prev, { id, message, type }])
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
    }, [])

    const remove = (id: number) => setToasts(prev => prev.filter(t => t.id !== id))

    const styles: Record<ToastType, string> = {
        success: 'bg-zinc-900 border-green-500/50 text-green-400',
        error:   'bg-zinc-900 border-red-500/50 text-red-400',
        info:    'bg-zinc-900 border-blue-500/50 text-blue-400',
    }
    const icons = {
        success: <CheckCircle className="w-4 h-4 shrink-0" />,
        error:   <XCircle className="w-4 h-4 shrink-0" />,
        info:    <Info className="w-4 h-4 shrink-0" />,
    }

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-5 right-5 flex flex-col gap-2 z-[100]">
                {toasts.map(t => (
                    <div
                        key={t.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium shadow-xl min-w-64 max-w-sm animate-in slide-in-from-right-5 ${styles[t.type]}`}
                    >
                        {icons[t.type]}
                        <span className="flex-1 text-white">{t.message}</span>
                        <button onClick={() => remove(t.id)} className="text-muted-foreground hover:text-white ml-1">
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

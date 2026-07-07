import { useState, useMemo, useEffect } from "react"
import { useTutors } from "../hooks/useTutors"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

const PAGE_SIZE = 6

export const TutorGrid = () => {
    const { data: tutors, isLoading, error } = useTutors()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [activeSubject, setActiveSubject] = useState<string | null>(
        searchParams.get('subject')
    )
    const [page, setPage] = useState(0)
    useEffect(() => {
        setActiveSubject(searchParams.get('subject'))
        setPage(0)
    }, [searchParams])

    const subjects = useMemo(() => {
        if (!tutors) return []
        const all = tutors.flatMap(t => t.subjects.map(s => s.name))
        return [...new Set(all)].sort()
    }, [tutors])

    const filtered = useMemo(() => {
        if (!tutors) return []
        if (!activeSubject) return tutors
        return tutors.filter(t => t.subjects.some(s => s.name === activeSubject))
    }, [tutors, activeSubject])

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
    const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

    function handleSubjectClick(subject: string) {
        setActiveSubject(prev => prev === subject ? null : subject)
        setPage(0)
    }

    if (isLoading) return <p className="text-center text-muted-foreground p-8">Ładowanie tutorów...</p>
    if (error)     return <p className="text-center text-red-500 p-8">Błąd: {error.message}</p>

    return (
        <div className="px-4 pb-8">
            {/* Filtr przedmiotów */}
            {subjects.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                    <button
                        onClick={() => { setActiveSubject(null); setPage(0) }}
                        className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                            !activeSubject
                                ? 'bg-white text-black border-white'
                                : 'border-border text-white hover:border-white hover:text-white'
                        }`}
                    >
                        Wszyscy
                    </button>
                    {subjects.map(s => (
                        <button
                            key={s}
                            onClick={() => handleSubjectClick(s)}
                            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                                activeSubject === s
                                    ? 'bg-white text-black border-white'
                                    : 'border-border text-white hover:border-white hover:text-white'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}

            {/* Siatka kart */}
            {paginated.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                    Brak korepetytorów z przedmiotu „{activeSubject}".
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginated.map(tutor => (
                        <Card key={tutor.userId} size="sm">
                            <CardHeader>
                                <CardTitle>{tutor.name} {tutor.surname}</CardTitle>
                                <CardDescription>
                                    {tutor.subjects.map(s => s.name).join(', ')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {tutor.description || 'Brak opisu.'}
                                </p>
                                <p className="mt-2 text-sm font-medium">{tutor.hourlyRate} zł/h</p>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => navigate(`/tutors/${tutor.userId}`)}
                                >
                                    Zobacz profil
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* Paginacja */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setPage(p => p - 1)}
                        disabled={page === 0}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        {page + 1} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setPage(p => p + 1)}
                        disabled={page === totalPages - 1}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    )
}

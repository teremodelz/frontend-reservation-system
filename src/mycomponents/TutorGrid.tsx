import { useTutors } from "../hooks/useTutors"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const TutorGrid = () => {

    const {data : tutors, isLoading, error} = useTutors()
    const navigate = useNavigate()

    if (isLoading) return <p>Ładowanie tutorów...</p>
    if (error)     return <p>Błąd: {error.message}</p>

    return(
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {tutors?.map(tutor => (
            <Card key={tutor.userId} size="sm">
            <CardHeader>
                <CardTitle>{tutor.name} {tutor.surname}</CardTitle>
                <CardDescription>
                {tutor.subjects.map(s => s.name).join(', ')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>
                {tutor.description}
                </p>
            </CardContent>
            <CardFooter>
                <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate(`/tutors/${tutor.userId}`)}
                >
                Zobacz profil tutora
                </Button>
            </CardFooter>
            </Card>
        ))}
    </div>
    )
}
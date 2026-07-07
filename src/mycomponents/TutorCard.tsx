import { useState } from "react"
import { useTutor } from "../hooks/useTutors"
import { useParams } from "react-router"
import { useNavigate } from "react-router-dom"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ButtonGroup } from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"
import { AvailabilityCalendar } from "./AvailabilityCalendar"
import { BookingModal } from "./BookingModal"

export const TutorCard = () => {
        const {id} = useParams()
        const {data : tutor, isLoading, error} = useTutor(Number(id))
        const navigate = useNavigate()
        const [showBooking, setShowBooking] = useState(false)

        if(isLoading) return <p>Ladowanie profilu tutora...</p>
        if(error) return <p>Blad {error.message}</p>
        if(!tutor) return null

        return(
    <div className="min-h-screen p-8">
        <Card className="max-w-4xl mx-auto">

            <CardHeader className="items-center text-center p-8">
                <CardTitle className="text-5xl">{tutor.name} {tutor.surname}</CardTitle>
                <CardDescription className="text-xl mt-2">
                    Nauczyciel · {tutor.hourlyRate} zł/h
                </CardDescription>
                <CardAction>
                    <ButtonGroup className="hidden sm:flex">
                        <Button variant="outline" size="icon" onClick={() => navigate('/tutors')} aria-label="Go Back">
                            <ArrowLeftIcon />
                        </Button>
                    </ButtonGroup>
                </CardAction>
            </CardHeader>

            <div className='flex items-center justify-center p-12'>
                <Tabs defaultValue="omnie" className="w-full max-w-3xl">
                    <TabsList className="w-full h-14">
                        <TabsTrigger value="omnie" className="flex-1 h-full text-lg">O mnie</TabsTrigger>
                        <TabsTrigger value="moje-przedmioty" className="flex-1 h-full text-lg">Przedmioty</TabsTrigger>
                        <TabsTrigger value="moja-dostepnosc" className="flex-1 h-full text-lg">Dostępność</TabsTrigger>
                    </TabsList>

                    <TabsContent value="omnie">
                        <Card>
                            <CardHeader className="px-8 pt-8 pb-2">
                                <CardTitle className="text-2xl">O mnie</CardTitle>
                            </CardHeader>
                            <CardContent className="text-base text-muted-foreground px-8 pb-8 -mt-2">
                                {tutor.description || 'Brak opisu.'}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="moje-przedmioty">
                        <Card>
                            <CardHeader className="px-8 pt-8 pb-2">
                                <CardTitle className="text-2xl">Przedmioty</CardTitle>
                                <CardDescription className="text-base mt-2">
                                    {tutor.name} może Ci pomóc w następujących przedmiotach:
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-base text-muted-foreground px-8 pb-8 flex flex-wrap gap-2">
                                {tutor.subjects.length === 0
                                    ? <p className="text-sm">Brak przypisanych przedmiotów.</p>
                                    : tutor.subjects.map((subject) => (
                                        <Button key={subject.name} variant="outline" size="lg">
                                            {subject.name}
                                        </Button>
                                    ))
                                }
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="moja-dostepnosc">
                        <Card>
                            <CardHeader className="px-8 pt-8 pb-2">
                                <CardTitle className="text-2xl">Dostępność</CardTitle>
                                <CardDescription className="text-base mt-2">
                                    Terminy, w których {tutor.name} może prowadzić zajęcia:
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-8 pb-8">
                                <AvailabilityCalendar availability={tutor.availabilityList} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            <CardFooter className="p-6">
                <Button className="w-full" size="lg" onClick={() => setShowBooking(true)}>
                    Zarezerwuj lekcję u {tutor.name}
                </Button>
            </CardFooter>
        </Card>

        {showBooking && (
            <BookingModal tutor={tutor} onClose={() => setShowBooking(false)} />
        )}
    </div>
)
}

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

export function AboutUsCard() {
  const navigate = useNavigate()
  return (
    <div className="flex justify-center items-start pt-15 min-h-screen">
      <Card size="default" className="mx-auto w-full max-w-4xl">
        <CardHeader className="p-12">
          <CardTitle className="text-4xl">O nas</CardTitle>
          <CardDescription className="text-xl mt-2">
            Poznajmy się bliżej - dowiedz się z kim masz do czynienia. :)
          </CardDescription>
        </CardHeader>
        <CardContent className="px-12 pb-8">
          <p className="text-xl">
            Tutoring web project to perfekcyjna strona dla Ciebie. Wierzymy, że każdy uczeń potrzebuje indywidualnego podejścia. Na naszej stronie znajdziesz korepetytorów, z którymi nauka staje się przyjemnością, a nie przykrym obowiązkiem.
             Wybierz kogoś, kto mówi Twoim językiem, dostosuj godziny zajęć do swojego planu dnia i zacznij uczyć się na własnych zasadach. To jak? Zaczynamy?
          </p>
        </CardContent>
        <CardFooter className="px-12 pb-12">
          <Button
            variant="outline"
            size="lg"
            className="w-full text-lg py-6"
            onClick={() => navigate('/tutors')}
          >
            Rozpocznij szukanie korepetytora
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
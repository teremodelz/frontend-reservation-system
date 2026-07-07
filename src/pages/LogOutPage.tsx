import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import {Card} from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

function LogOutPage() {
  
  const navigate = useNavigate()
  const [seconds, setSeconds] = useState(3)

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(prev => prev - 1)
        }, 1000)

        const timer = setTimeout(() => {
            navigate('/tutors')
        }, 3000)

        return () => {
            clearInterval(interval)
            clearTimeout(timer)
        }
    }, [])
  
  
    return (
    <div className="min-h-screen flex items-center justify-center bg-[oklch(21%_0.006_285.885)]">
    <Card className="w-full max-w-lg">
    
    <Empty>
      <EmptyHeader>
        <EmptyTitle>Wylogowano pomyślnie</EmptyTitle>
        <EmptyDescription>
          Dziękujemy Ci za poświęcony czas na TutoringApp. Wylogowaliśmy cię pomyślnie.
          Poczekaj {seconds} sekundy - automatycznie przekierujemy Cię do strony glównej.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <EmptyDescription>
          <a href="/">Kliknij tutaj, żeby manualnie wrócić do strony glównej.</a>
        </EmptyDescription>
      </EmptyContent>
    </Empty>

    </Card>

    </div>
  )
}
export default LogOutPage

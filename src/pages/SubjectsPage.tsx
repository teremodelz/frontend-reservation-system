import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { NavigationBarFull } from "../mycomponents/NavBar"
import { Footer } from "../mycomponents/Footer"
import { SubjectApi } from "../api/subjectApi"
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"
import physicsImg from "../assets/subjects/physicsImg.jpg"
import spainImg from "../assets/subjects/spainImg.jpg"
import biologyImg from "../assets/subjects/biologyImg.jpg"
import chemistryImg from "../assets/subjects/chemistryImg.jpg"
import computerScienceImg from "../assets/subjects/computerScienceImg.jpg"
// Dodaj tutaj zdjęcia po kolei gdy je przyniesiesz.
// Klucz = nazwa przedmiotu (dokładnie jak w bazie), value = ścieżka do pliku w /src/assets/subjects/
const SUBJECT_IMAGES: Record<string, string> = {
  "Fizyka": physicsImg,
  "Język Hiszpański": spainImg,
  "Biologia": biologyImg,
  "Chemia" : chemistryImg,
  "Informatyka" : computerScienceImg
}

// Układ bento dla N kart — klasowy grid zależny od indeksu
function getBentoClass(index: number, total: number): string {
  // Wzorzec 5-kartkowy powtarza się
  const pos = index % 5
  if (pos === 0) return "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-4"
  if (pos === 1) return "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3"
  if (pos === 2) return "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4"
  if (pos === 3) return "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2"
  return                 "lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-4"
}

export function SubjectsPage() {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const { data: subjects, isLoading, error } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => SubjectApi.getAll(),
  })

  return (
    <div className="min-h-screen bg-[oklch(21%_0.006_285.885)] flex flex-col">
      <NavigationBarFull />

      <div
        className="flex-1"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 500ms ease, transform 500ms ease",
        }}
      >
        {/* Header */}
        <div className="text-center px-6 pt-16 pb-10">
          <h1 className="text-4xl font-bold text-white mb-3">Przedmioty</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Wybierz interesujący Cię przedmiot i znajdź korepetytora, który Ci pomoże.
          </p>
        </div>

        {/* Bento grid */}
        <div className="max-w-5xl mx-auto px-6 pb-16">
          {isLoading && (
            <p className="text-center text-muted-foreground">Ładowanie przedmiotów...</p>
          )}
          {error && (
            <p className="text-center text-red-500">Błąd: {error.message}</p>
          )}

          {subjects && subjects.length > 0 && (
            <BentoGrid className="lg:grid-rows-3">
              {subjects.map((subject, i) => {
                const imgSrc = SUBJECT_IMAGES[subject.name]
                return (
                  <BentoCard
                    key={subject.name}
                    name={subject.name}
                    description={`Znajdź korepetytora z przedmiotu ${subject.name} i zacznij się uczyć już dziś.`}
                    className={getBentoClass(i, subjects.length)}
                    cta="Znajdź korepetytora"
                    onClick={() => navigate(`/tutors?subject=${encodeURIComponent(subject.name)}`)}
                    background={
                      imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={subject.name}
                          className="absolute inset-0 w-full h-full object-cover opacity-40 transition-opacity duration-300 group-hover:opacity-50"
                        />
                      ) : undefined
                    }
                  />
                )
              })}
            </BentoGrid>
          )}

          {subjects && subjects.length === 0 && (
            <p className="text-center text-muted-foreground">Brak dostępnych przedmiotów.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

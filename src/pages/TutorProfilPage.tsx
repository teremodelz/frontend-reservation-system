import { NavigationBarFull } from "../mycomponents/NavBar"
import { useTutor } from "../hooks/useTutors"
import { TutorCard } from "../mycomponents/TutorCard"

export const TutorProfilPage = () => {
    
    return (
        <div className="min-h-screen bg-[oklch(21%_0.006_285.885)]">
            <NavigationBarFull />
            <TutorCard />
        </div>
    )
}

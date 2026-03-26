import {NavigationBarFull} from "../mycomponents/NavBar"
import {WelcomeTablesTutorPage} from "../mycomponents/TutorsIntroduction"
import {TutorGrid} from "../mycomponents/TutorGrid"

export const TutorListPage = () => {
    return (
        <div className="min-h-screen bg-[oklch(21%_0.006_285.885)]">
            <NavigationBarFull />
            <WelcomeTablesTutorPage />
            <TutorGrid />
        </div>
    )
}      
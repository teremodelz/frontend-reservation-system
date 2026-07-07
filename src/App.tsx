import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import { TutorListPage } from './pages/TutorListPage'
import { isLoggedIn, getUser } from './api/tokenService'
import { TutorProfilPage } from './pages/TutorProfilPage'
import LogOutPage from './pages/LogOutPage'
import { AboutUsPage } from './pages/AboutUsPage'
import { DashboardPage } from './pages/DashboardPage'
import { HomePage } from './pages/HomePage'
import { SubjectsPage } from './pages/SubjectsPage'
import { BecomeTutorPage } from './pages/BecomeTutorPage'
import { AdminPage } from './pages/AdminPage'
import { ProfilePage } from './pages/ProfilePage'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/"        element={<HomePage />} />
                <Route path="/login"   element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/dashboard"
                    element={
                        isLoggedIn()
                            ? <DashboardPage />
                            : <Navigate to="/login" />
                    }
                />
                <Route path="/tutors" element={<TutorListPage />} />
                <Route path="/tutors/:id" element={<TutorProfilPage />} />
                <Route path="/logout" element={<LogOutPage />} />
                <Route path="/about" element={<AboutUsPage />} />
                <Route path="/subjects" element={<SubjectsPage />} />
                <Route path="/become-tutor" element={<BecomeTutorPage />} />
                <Route
                    path="/admin"
                    element={
                        isLoggedIn() && getUser()?.roles.includes('ROLE_ADMIN')
                            ? <AdminPage />
                            : <NotFoundPage />
                    }
                />
                <Route
                    path="/profile"
                    element={
                        isLoggedIn()
                            ? <ProfilePage />
                            : <Navigate to="/login" />
                    }
                />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App

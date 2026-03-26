import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import { TutorListPage } from './pages/TutorListPage'
import { isLoggedIn } from './api/tokenService'
import { TutorProfilPage } from './pages/TutorProfilPage'
import LogOutPage from './pages/LogOutPage'
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login"    element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/dashboard"
                    element={
                        isLoggedIn()
                            ? <div>Dashboard (wkrótce)</div>
                            : <Navigate to="/login" />
                    }
                />
                <Route path="/test" element={<NotFoundPage />} />
                <Route path="/tutors" element={<TutorListPage />} />
                <Route path="/tutors/:id" element={<TutorProfilPage />} />
                <Route path="/logout" element={<LogOutPage />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App

import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

const SECTION_ROUTES = [
  'about', 'skills', 'projects', 'education', 'certifications', 'contact',
]

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        {SECTION_ROUTES.map((id) => (
          <Route
            key={id}
            path={`/${id}`}
            element={<Navigate to="/" replace state={{ scrollTo: id }} />}
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
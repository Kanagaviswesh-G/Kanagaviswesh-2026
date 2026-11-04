import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function MainLayout() {
  const { pathname, state } = useLocation()

  useEffect(() => {
    if (!state?.scrollTo) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
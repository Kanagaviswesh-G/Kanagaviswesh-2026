import { useEffect, useState } from 'react'

export default function useActiveSection(ids, dep) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    let ticking = false
    const LINE = 120 // navbar (80px) + buffer

    const update = () => {
      ticking = false
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= LINE) current = id
      }
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      if (atBottom) current = ids[ids.length - 1]
      setActive(current)
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ids.join(','), dep])

  return active
}
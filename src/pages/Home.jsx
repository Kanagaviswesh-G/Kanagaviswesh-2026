import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Hero from '../sections/Hero'
import AboutSection from '../sections/AboutSection'
import SkillsSection from '../sections/SkillsSection'
import Projects from './Projects'
import Education from './Education'
import Certifications from './Certifications'
import Contact from './Contact'
import { scrollToId } from '../utils/scroll'
import Guide from '../components/common/Guide'
function Block({ id, children, reveal = true }) {
  return (
    <div id={id} className="scroll-mt-24">
      {reveal ? (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.6 }}
        >
          {children}
        </motion.div>
      ) : (
        children
      )}
    </div>
  )
}

export default function Home() {
  const { state } = useLocation()

  useEffect(() => {
    if (state?.scrollTo) {
      const t = setTimeout(() => scrollToId(state.scrollTo), 80)
      return () => clearTimeout(t)
    }
  }, [state])

  return (
    <>
      <Block id="home" reveal={false}><Hero /></Block>
      <Block id="about"><AboutSection /></Block>
      <Block id="skills"><SkillsSection /></Block>
      <Block id="projects"><Projects /></Block>
      <Block id="education"><Education /></Block>
      <Block id="certifications"><Certifications /></Block>
      <Block id="contact"><Contact /></Block>
      <Guide />
    </>
  )
}
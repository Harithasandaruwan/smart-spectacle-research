import './index.css'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Research from './components/Research'
import LiteratureSurvey from './components/LiteratureSurvey'
import ResearchGap from './components/ResearchGap'
import { ResearchProblem, ResearchObjectives, TechnologiesUsed } from './components/DomainDetails'
import ResearchComponents from './components/ResearchComponents'
import Methodology from './components/Methodology'
import Milestones from './components/Milestones'
import Documents from './components/Documents'
import PresentationSlides from './components/PresentationSlides'
import Team from './components/Team'
import References from './components/References'
import Contact from './components/Contact'
import Footer from './components/Footer'
import SpectacleBackground from './components/three/SpectacleBackground'

function App() {
  return (
    <>
      <SpectacleBackground />
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Navbar />

      <main id="main">
        <Hero />
        <Research />
        <LiteratureSurvey />
        <ResearchGap />
        <ResearchProblem />
        <ResearchObjectives />
        <Methodology />
        <TechnologiesUsed />
        <ResearchComponents />
        <Milestones />
        <Documents />
        <PresentationSlides />
        <Team />
        <References />
        <Contact />
      </main>

      <Footer />
    </>
  )
}

export default App

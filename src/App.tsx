import './index.css'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Research from './components/Research'
import LiteratureSurvey from './components/LiteratureSurvey'
import ResearchGap from './components/ResearchGap'
import ResearchComponents from './components/ResearchComponents'
import Methodology from './components/Methodology'
import Downloads from './components/Downloads'
import Team from './components/Team'
import References from './components/References'
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
        <ResearchComponents />
        <Methodology />
        <Downloads />
        <Team />
        <References />
      </main>

      <Footer />
    </>
  )
}

export default App

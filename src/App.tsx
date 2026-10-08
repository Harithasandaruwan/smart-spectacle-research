import './index.css'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Research from './components/Research'
import LiteratureSurvey from './components/LiteratureSurvey'
import ResearchComponents from './components/ResearchComponents'
import Methodology from './components/Methodology'
import Downloads from './components/Downloads'
import Team from './components/Team'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Navbar />

      <main id="main">
        <Hero />
        <Research />
        <LiteratureSurvey />
        <ResearchComponents />
        <Methodology />
        <Downloads />
        <Team />
      </main>

      <Footer />
    </>
  )
}

export default App
import ProductStage from './three/ProductStage'

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="hero-layout">
          <div className="hero-copy">
        <p className="eyebrow">
          SLIIT · Research Project · R26-IT-134
        </p>

        <h1>
          IoT-Based Spectacle for Indoor Navigation and Safety of
          Visually Impaired
        </h1>

        <p className="hero-description">
          Exploring how wearable sensors, computer vision, and edge
          processing can support safer and more independent indoor
          navigation for visually impaired people.
        </p>

        <div className="button-group">
          <a className="button primary" href="#research">
            Explore our research
          </a>
          <a className="button secondary" href="#downloads">
            View proposals
          </a>
        </div>

          </div>
          <ProductStage name="home" />
        </div>
        <div className="hero-facts">
          <div>
            <strong>04</strong>
            <span>Research components</span>
          </div>
          <div>
            <strong>IoT + AI</strong>
            <span>Proposed approach</span>
          </div>
          <div>
            <strong>AIMS</strong>
            <span>Research group</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

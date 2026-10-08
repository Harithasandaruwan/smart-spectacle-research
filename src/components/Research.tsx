import ProductStage from './three/ProductStage'

function Research() {
  return (
    <section id="research" className="section">
      <div className="container">
        <div className="product-section-heading">
          <div>
        <p className="eyebrow">Research overview</p>
        <h2>Supporting safer indoor mobility</h2>

        <p className="section-intro">
          Our proposed system brings together wearable sensing, indoor
          positioning, hazard detection, and guardian support.
        </p>

          </div>
          <ProductStage name="research" />
        </div>
        <div className="grid three-columns">
          <article className="card">
            <h3>The problem</h3>
            <p>
              Indoor environments contain obstacles, stairs, and moving
              hazards. Visually impaired people need timely information
              about their surroundings and support for finding their way.
            </p>
          </article>

          <article className="card">
            <h3>The research focus</h3>
            <p>
              We investigate how multiple sensors and local processing
              can improve contextual awareness while reducing dependence
              on continuous internet connectivity for local assistance.
            </p>
          </article>

          <article className="card">
            <h3>The proposed solution</h3>
            <p>
              A smart spectacle platform that combines camera, distance,
              and motion information to support indoor guidance, audio
              warnings, and connected guardian monitoring.
            </p>
          </article>
        </div>

        <div className="notice">
          <strong>Main objective</strong>
          <p>
            Develop and evaluate an assistive smart spectacle system
            that supports safe and independent indoor navigation for
            visually impaired individuals.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Research

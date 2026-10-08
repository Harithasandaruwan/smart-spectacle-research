import { components } from '../data/project'
import ProductStage from './three/ProductStage'

function ResearchComponents() {
  return (
    <section id="components" className="section section-muted">
      <div className="container">
        <p className="eyebrow">Individual contributions</p>
        <h2>Four connected research components</h2>

        <p className="section-intro">
          Each member develops a component of the proposed integrated
          system.
        </p>

        <ProductStage name="components" />
        <div className="grid two-columns">
          {components.map((component) => (
            <article className="card" key={component.studentId}>
              <span className="component-number">
                {component.number}
              </span>

              <h3>{component.title}</h3>
              <p>{component.description}</p>

              <ul>
                {component.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>

              <div className="card-footer">
                <p>
                  <strong>{component.member}</strong>
                  <br />
                  {component.studentId}
                </p>

                <a href={component.document} download>
                  Download proposal
                  <span className="sr-only">
                    {' '}for {component.member}
                  </span>
                  <span aria-hidden="true"> →</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ResearchComponents

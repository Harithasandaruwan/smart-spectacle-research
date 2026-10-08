import ProductStage from './three/ProductStage'

const researchSteps = [
  {
    title: 'Understand the problem',
    description:
      'Review existing research and identify indoor navigation and safety requirements.',
  },
  {
    title: 'Develop the components',
    description:
      'Design the wearable hardware, hazard detection, positioning, and guardian modules.',
  },
  {
    title: 'Integrate the system',
    description:
      'Connect sensor inputs, local processing, audio guidance, and guardian communication.',
  },
  {
    title: 'Evaluate the prototype',
    description:
      'Measure detection performance, positioning error, response time, and usability in controlled conditions.',
  },
]

function Methodology() {
  return (
    <section id="methodology" className="section">
      <div className="container">
        <div className="product-section-heading">
          <div>
        <p className="eyebrow">Proposed methodology</p>
        <h2>From research to prototype evaluation</h2>

        <p className="section-intro">
          The project follows a design science approach with iterative
          development and experimental evaluation.
        </p>

          </div>
          <ProductStage name="methodology" />
        </div>
        <ol className="methodology-list">
          {researchSteps.map((step) => (
            <li className="card" key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>

        <div className="notice">
          <strong>Local assistance and remote communication</strong>
          <p>
            Core navigation and hazard processing are intended to run
            locally. Remote guardian updates and cloud synchronization
            require an available communication connection.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Methodology

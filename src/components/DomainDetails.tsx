import { components } from '../data/project'

export function ResearchProblem() {
  return (
    <section id="research-problem" className="section" aria-labelledby="research-problem-heading">
      <div className="container">
        <p className="eyebrow">Domain</p>
        <h2 id="research-problem-heading">Research problem</h2>
        <p className="section-intro">
          Indoor travel can involve obstacles, stairs, and moving hazards while
          familiar outdoor positioning methods may not give enough indoor
          context. The project investigates how a wearable device can identify
          relevant hazards, estimate position, and give timely guidance to a
          visually impaired user.
        </p>
        <div className="notice">
          <strong>Project question</strong>
          <p>
            How can sensing, vision, positioning, audio guidance, and connected
            guardian support be integrated into a practical smart spectacle for
            safer indoor navigation?
          </p>
        </div>
      </div>
    </section>
  )
}

export function ResearchObjectives() {
  return (
    <section id="research-objectives" className="section section-muted" aria-labelledby="research-objectives-heading">
      <div className="container">
        <p className="eyebrow">Domain</p>
        <h2 id="research-objectives-heading">Research objectives</h2>
        <p className="section-intro">
          Develop and evaluate an assistive smart spectacle system that supports
          safer, more independent indoor navigation for visually impaired people.
        </p>
        <div className="grid two-columns">
          {components.map((component) => (
            <article className="card" key={component.studentId}>
              <h3>{component.title}</h3>
              <p>{component.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function TechnologiesUsed() {
  return (
    <section id="technologies-used" className="section section-muted" aria-labelledby="technologies-heading">
      <div className="container">
        <p className="eyebrow">Domain</p>
        <h2 id="technologies-heading">Technologies used</h2>
        <p className="section-intro">
          The proposed prototype combines a spectacle-mounted camera, distance
          sensing, an inertial measurement unit (IMU), edge processing, and audio
          feedback. The positioning component investigates visual landmarks and
          motion tracking; a connected guardian application is planned for
          safety alerts.
        </p>
        <div className="notice">
          <strong>Implementation stage</strong>
          <p>
            These are the technologies in the current research plan. Prototype
            performance and final hardware choices still require evaluation.
          </p>
        </div>
      </div>
    </section>
  )
}

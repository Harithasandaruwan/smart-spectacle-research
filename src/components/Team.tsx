import { components } from '../data/project'

function Team() {
  return (
    <section id="team" className="section">
      <div className="container">
        <p className="eyebrow">Our team</p>
        <h2>The researchers behind the project</h2>

        <p className="section-intro">
          B.Sc. (Hons) in Information Technology, specializing in
          Information Technology · Sri Lanka Institute of Information
          Technology.
        </p>

        <div className="grid two-columns">
          {components.map((component) => (
            <article className="card" key={component.studentId}>
              <p className="eyebrow">{component.studentId}</p>
              <h3>{component.member}</h3>
              <p>{component.title}</p>
            </article>
          ))}
        </div>

        <div className="supervisors">
          <div>
            <p className="eyebrow">Supervisor</p>
            <h3>Mr. Ravi Supunya</h3>
          </div>

          <div>
            <p className="eyebrow">Co-supervisor</p>
            <h3>Prof. Anuradha Jayakody</h3>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Team
import { components } from '../data/project'

function Downloads() {
  return (
    <section id="downloads" className="section section-muted">
      <div className="container">
        <p className="eyebrow">Research documents</p>
        <h2>Proposals and project information</h2>

        <p className="section-intro">
          Download the topic assessment form and individual component
          proposals.
        </p>

        <div className="download-list">
          <a
            className="download-item"
            href="/documents/topic-assessment.pdf"
            download
          >
            <span>
              <strong>Topic Assessment Form</strong>
              <small>Project overview · R26-IT-134</small>
            </span>
            <span className="file-badge">PDF ↓</span>
          </a>

          {components.map((component) => (
            <a
              className="download-item"
              href={component.document}
              download
              key={component.studentId}
            >
              <span>
                <strong>{component.title}</strong>
                <small>
                  {component.member} · {component.studentId}
                </small>
              </span>
              <span className="file-badge">PDF ↓</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Downloads
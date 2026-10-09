import { components } from '../data/project'

const documentsToAdd = [
  'Project charter',
  'Single group proposal document',
  'Checklist documents',
  'Final group report',
  'Four individual final reports',
]

function Documents() {
  return (
    <section id="documents" className="section section-muted" aria-labelledby="documents-heading">
      <div className="container">
        <p className="eyebrow">Research documents</p>
        <h2 id="documents-heading">Documents</h2>

        <p className="section-intro">
          The topic assessment form and four individual component proposals are
          available below. Other guideline documents will be linked when files
          are provided.
        </p>

        <h3>Available files</h3>
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

        <h3 className="subsection-heading">Files to add</h3>
        <div className="grid two-columns">
          {documentsToAdd.map((title) => (
            <article className="card" key={title}>
              <h3>{title}</h3>
              <p className="placeholder-detail">File not uploaded yet.</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Documents

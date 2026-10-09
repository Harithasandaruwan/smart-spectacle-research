import { references } from '../data/references'

function References() {
  return (
    <section
      id="references"
      className="section section-muted"
      aria-labelledby="references-heading"
    >
      <div className="container">
        <p className="eyebrow">Sources</p>
        <h2 id="references-heading">References</h2>

        <p className="section-intro">
          The numbers below correspond to citations in the literature
          survey and research gap. Links open the original publication,
          publication record, or manufacturer documentation page.
        </p>

        <ol className="reference-list">
          {references.map((reference) => (
            <li
              id={`reference-${reference.id}`}
              className="reference-item"
              key={reference.id}
              value={reference.id}
            >
              <p>
                {reference.authors}, “{reference.title},”{' '}
                <em>{reference.publication}</em>
              </p>

              <a
                href={reference.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View source
                <span className="sr-only">
                  : {reference.title} (opens in a new tab)
                </span>
                <span aria-hidden="true"> ↗</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default References

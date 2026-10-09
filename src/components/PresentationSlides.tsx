const plannedPresentations = [
  'Proposal presentation',
  'Progress Presentation 1',
  'Progress Presentation 2',
  'Final presentation',
]

function PresentationSlides() {
  return (
    <section id="slides" className="section" aria-labelledby="slides-heading">
      <div className="container">
        <p className="eyebrow">Presentation archive</p>
        <h2 id="slides-heading">Slides of past presentations</h2>
        <p className="section-intro">
          No presentation slide files are currently available in this repository.
          Add each deck here after it has been presented and uploaded.
        </p>
        <div className="grid two-columns">
          {plannedPresentations.map((title) => (
            <article className="card" key={title}>
              <h3>{title}</h3>
              <p className="placeholder-detail">Pending — no slide file in the repository.</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PresentationSlides

function Citation({ id }: { id: number }) {
  return (
    <a href={`#reference-${id}`} aria-label={`Read reference ${id}`}>
      [{id}]
    </a>
  )
}

function ResearchGap() {
  return (
    <section
      id="research-gap"
      className="section section-muted"
      aria-labelledby="research-gap-heading"
    >
      <div className="container">
        <p className="eyebrow">Research opportunity</p>
        <h2 id="research-gap-heading">Research gap</h2>

        <p className="section-intro">
          The selected literature establishes useful approaches across
          indoor navigation, wearable perception, positioning, and user
          feedback. Our project investigates how those concerns can work
          together within one IoT-based smart spectacle and connected
          safety workflow.
        </p>

        <div className="grid two-columns">
          <article className="card">
            <h3>Evidence informing the investigation</h3>
            <p>
              Prior work describes indoor navigation technologies and
              user needs <Citation id={4} />, marker-supported indoor
              assistance <Citation id={8} />, wearable semantic visual
              localization <Citation id={11} />, and wearable obstacle
              perception with distance-aware feedback <Citation id={2} />.
              Research on IoT smart glasses <Citation id={6} /> and voice
              feedback <Citation id={10} /> also informs the proposed
              wearable and audio interaction design.
            </p>
          </article>

          <article className="card">
            <h3>Integration question</h3>
            <p>
              The project must determine how wearable sensing,
              vision-based hazard detection, indoor positioning, and
              timely audio guidance can be coordinated on the proposed
              hardware. Guardian support adds a connected safety pathway
              that must be evaluated alongside the user-facing navigation
              functions rather than assumed to work from subsystem results.
            </p>
          </article>
        </div>

        <div className="notice">
          <strong>Focus of this research</strong>
          <p>
            Design and evaluate the integrated prototype under controlled
            indoor conditions, measuring detection performance, positioning
            error, response time, reliability, and usability. This gap is
            framed as an integration and evaluation need; it does not claim
            that the cited studies omitted features they did not evaluate.
          </p>
        </div>
      </div>
    </section>
  )
}

export default ResearchGap

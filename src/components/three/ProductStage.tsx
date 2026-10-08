type StageName = 'home' | 'research' | 'components' | 'methodology'

// The fixed canvas follows real layout slots. The matching local studio
// render fills each slot while loading, on phones, or if rendering fails.
export default function ProductStage({ name }: { name: StageName }) {
  return (
    <figure className={`spectacle-stage spectacle-stage--${name}`} data-spectacle-stage={name} aria-hidden="true">
      <img className="spectacle-stage-image" src={`${import.meta.env.BASE_URL}images/smart-spectacle-concept.png`} alt="" width="1100" height="750" loading={name === 'home' ? 'eager' : 'lazy'} />
      {name === 'components' && (
        <div className="spectacle-part-key">
          <span>01 <b>Frame &amp; temples</b></span>
          <span>02 <b>Optical lenses</b></span>
          <span>03 <b>Camera</b></span>
          <span>04 <b>Distance sensing</b></span>
        </div>
      )}
      <figcaption>
        <span className="concept-dot" /> Concept illustration
        {name === 'components' && <span className="concept-detail">Illustrative assembly; hardware placement is conceptual.</span>}
      </figcaption>
    </figure>
  )
}

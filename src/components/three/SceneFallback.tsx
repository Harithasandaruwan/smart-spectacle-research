// Static renders live in ProductStage slots instead of overlaying text.
export default function SceneFallback() {
  return <div className="spectacle-fallback" aria-hidden="true" />
}

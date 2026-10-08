import { Component, Suspense, lazy, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import SceneFallback from './SceneFallback'
import '../../styles/spectacle-scene.css'

const ScrollSpectacleScene = lazy(() => import('./ScrollSpectacleScene'))

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <SceneFallback /> : this.props.children }
}

export default function SpectacleBackground() {
  const [enabled, setEnabled] = useState(false)
  const [atHome, setAtHome] = useState(true)

  useEffect(() => {
    const mobile = matchMedia('(max-width: 800px)')
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let supported: boolean | undefined
    const update = () => {
      if (!mobile.matches && !reduced.matches && supported === undefined) {
        const probe = document.createElement('canvas')
        try {
          const gl = probe.getContext('webgl2')
          supported = Boolean(gl)
          gl?.getExtension('WEBGL_lose_context')?.loseContext()
        } catch { supported = false }
      }
      setEnabled(!mobile.matches && !reduced.matches && Boolean(supported))
    }
    update()
    mobile.addEventListener('change', update)
    reduced.addEventListener('change', update)
    const home = document.getElementById('home')
    const observer = new IntersectionObserver(([entry]) => setAtHome(entry.isIntersecting))
    if (home) observer.observe(home)
    return () => {
      mobile.removeEventListener('change', update)
      reduced.removeEventListener('change', update)
      observer.disconnect()
    }
  }, [])

  return (
    <div className={`spectacle-scene${atHome ? ' spectacle-at-home' : ''}`} aria-hidden="true">
      <SceneBoundary>
        {enabled ? <Suspense fallback={<SceneFallback />}><ScrollSpectacleScene /></Suspense> : <SceneFallback />}
      </SceneBoundary>
      <span className="spectacle-caption">Concept illustration</span>
    </div>
  )
}

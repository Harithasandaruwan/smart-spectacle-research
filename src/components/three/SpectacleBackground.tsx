import { Component, Suspense, lazy, useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import SceneFallback from './SceneFallback'
import '../../styles/spectacle-scene.css'

const ScrollSpectacleScene = lazy(() => import('./ScrollSpectacleScene'))
type SceneStatus = { state: 'loading' | 'ready' | 'fallback' | 'static'; reason: string }

class SceneBoundary extends Component<{
  children: ReactNode; onFailure: (reason: string) => void
}, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error: Error) {
    const reason = error.name === 'WebGLInitializationError' ? 'webgl-unavailable'
      : /load|fetch|GLB|GLTF/i.test(error.message) ? 'asset-load-error' : 'render-error'
    console.warn(`[Spectacle scene: ${reason}]`, error)
    this.props.onFailure(reason)
  }
  render() { return this.state.failed ? <SceneFallback /> : this.props.children }
}

export default function SpectacleBackground() {
  const [mode, setMode] = useState({ desktop: false, motion: false })
  const [status, setStatus] = useState<SceneStatus>({ state: 'loading', reason: 'initializing' })
  const [revision, setRevision] = useState(0)
  const fail = useCallback((reason: string) => setStatus({ state: 'fallback', reason }), [])
  const ready = useCallback(() => setStatus({ state: 'ready', reason: 'none' }), [])

  useEffect(() => {
    const small = matchMedia('(max-width: 800px)')
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      setMode({ desktop: !small.matches, motion: !reduced.matches })
      setStatus(small.matches ? { state: 'static', reason: 'mobile-static' } : { state: 'loading', reason: 'initializing' })
      setRevision(value => value + 1)
    }
    update()
    small.addEventListener('change', update)
    reduced.addEventListener('change', update)
    return () => {
      small.removeEventListener('change', update)
      reduced.removeEventListener('change', update)
    }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.spectacleState = status.state
    return () => { delete document.documentElement.dataset.spectacleState }
  }, [status.state])

  // Focus/online events recover a lost context or failed asset request without
  // repeatedly creating contexts in a browser that lacks WebGL2.
  useEffect(() => {
    if (!mode.desktop || !['context-lost', 'asset-load-error'].includes(status.reason)) return
    const retry = () => {
      setStatus({ state: 'loading', reason: 'retrying' })
      setRevision(value => value + 1)
    }
    window.addEventListener('focus', retry)
    window.addEventListener('online', retry)
    return () => {
      window.removeEventListener('focus', retry)
      window.removeEventListener('online', retry)
    }
  }, [mode.desktop, status.reason])

  return (
    <div className="spectacle-scene" data-scene-status={status.state} data-scene-reason={status.reason} data-scene-motion={mode.motion ? 'animated' : 'reduced'} aria-hidden="true">
      <SceneBoundary key={revision} onFailure={fail}>
        {mode.desktop && status.state !== 'fallback'
          ? <Suspense fallback={<SceneFallback />}><ScrollSpectacleScene motion={mode.motion} onReady={ready} onFailure={fail} /></Suspense>
          : <SceneFallback />}
      </SceneBoundary>
    </div>
  )
}

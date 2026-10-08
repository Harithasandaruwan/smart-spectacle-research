import { useEffect, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { RefObject } from 'react'
import SmartSpectacleModel from './SmartSpectacleModel'
import SceneFallback from './SceneFallback'
import { HOME_POSE, SECTION_POSES } from './scenePoses'

gsap.registerPlugin(ScrollTrigger)

function Choreography({ surface }: { surface: RefObject<HTMLDivElement | null> }) {
  const pose = useRef({ ...HOME_POSE })
  const invalidate = useThree(state => state.invalidate)

  useEffect(() => {
    let context: gsap.Context | undefined
    let timer: ReturnType<typeof setTimeout>
    let disposed = false
    const paint = () => {
      if (surface.current) surface.current.style.opacity = String(pose.current.opacity)
      if (!document.hidden) invalidate()
    }
    const build = () => {
      if (disposed) return
      context?.revert()
      Object.assign(pose.current, HOME_POSE)
      context = gsap.context(() => {
        const total = Math.max(1, document.documentElement.scrollHeight - innerHeight)
        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          onUpdate: paint,
          scrollTrigger: { start: 0, end: total, scrub: .65, invalidateOnRefresh: true },
        })
        // Timeline units correspond to document pixels, with a final spacer
        // tween to maintain the same mapping through long sections.
        timeline.to({}, { duration: total }, 0)
        SECTION_POSES.slice(1).forEach(({ id, pose: next }) => {
          const section = document.getElementById(id)
          if (!section) return
          const top = section.getBoundingClientRect().top + scrollY
          const start = Math.max(0, top - innerHeight * .85)
          const end = Math.min(total, Math.max(start + 1, top - innerHeight * .3))
          timeline.to(pose.current, { ...next, duration: end - start }, start)
        })
        timeline.scrollTrigger?.refresh()
        timeline.progress(timeline.scrollTrigger?.progress ?? 0)
        paint()
      })
    }
    const refresh = () => {
      clearTimeout(timer)
      timer = setTimeout(build, 140)
    }
    const visibility = () => {
      if (!document.hidden) { ScrollTrigger.update(); paint() }
    }
    build()
    window.addEventListener('resize', refresh)
    window.addEventListener('hashchange', refresh)
    window.addEventListener('pageshow', refresh)
    document.addEventListener('load', refresh, true)
    document.addEventListener('visibilitychange', visibility)
    const observer = new ResizeObserver(refresh)
    const main = document.querySelector('main')
    if (main) observer.observe(main)
    void document.fonts.ready.then(() => { if (!disposed) refresh() })
    return () => {
      disposed = true
      clearTimeout(timer)
      context?.revert()
      observer.disconnect()
      window.removeEventListener('resize', refresh)
      window.removeEventListener('hashchange', refresh)
      window.removeEventListener('pageshow', refresh)
      document.removeEventListener('load', refresh, true)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [invalidate, surface])

  return <SmartSpectacleModel pose={pose} />
}

export default function ScrollSpectacleScene() {
  const surface = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!canvas) return
    const lost = (event: Event) => { event.preventDefault(); setFailed(true) }
    canvas.addEventListener('webglcontextlost', lost)
    return () => canvas.removeEventListener('webglcontextlost', lost)
  }, [canvas])

  if (failed) return <SceneFallback />
  return (
    <div className="spectacle-canvas" ref={surface}>
      <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 9], fov: 38, near: .1, far: 40 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
        onCreated={({ gl }) => setCanvas(gl.domElement)}
        fallback={<SceneFallback />}
      >
        <ambientLight intensity={1.6} />
        <directionalLight position={[3, 5, 6]} intensity={3} color="#f1fffe" />
        <directionalLight position={[-4, 1, -2]} intensity={2.2} color="#65babe" />
        <Choreography surface={surface} />
      </Canvas>
    </div>
  )
}

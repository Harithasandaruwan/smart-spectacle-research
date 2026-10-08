import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { ACESFilmicToneMapping, WebGLRenderer } from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SmartSpectacleModel from './SmartSpectacleModel'
import { HOME_POSE, SECTION_POSES } from './scenePoses'
import type { SceneAnchor } from './scenePoses'

gsap.registerPlugin(ScrollTrigger)

function Choreography({ surface, motion, onReady }: {
  surface: RefObject<HTMLDivElement | null>; motion: boolean; onReady: () => void
}) {
  const pose = useRef({ ...HOME_POSE })
  const anchors = useRef<SceneAnchor[]>([])
  const invalidate = useThree(state => state.invalidate)

  useEffect(() => {
    let context: gsap.Context | undefined
    let timer: ReturnType<typeof setTimeout>
    let disposed = false
    let reducedUpdate = () => {}
    const paint = () => { if (!document.hidden) invalidate() }
    const build = () => {
      if (disposed) return
      context?.revert()
      Object.assign(pose.current, HOME_POSE)
      const ordered = SECTION_POSES.map(entry => ({ ...entry, section: document.getElementById(entry.id) }))
        .filter(entry => entry.section)
        .sort((a, b) => a.section!.offsetTop - b.section!.offsetTop)
      const tops = ordered.map(({ section }) => section!.getBoundingClientRect().top + scrollY)
      anchors.current = ordered.map(({ id, section }) => {
        const slot = section!.querySelector<HTMLElement>(`[data-spectacle-stage="${id}"]`)
        if (slot) {
          const rect = slot.getBoundingClientRect()
          return { x: rect.left + rect.width / 2, y: rect.top + scrollY + rect.height / 2 - 12, width: rect.width, height: rect.height - 52, staged: true }
        }
        return { x: innerWidth * .94, y: section!.getBoundingClientRect().top + scrollY + 230, width: 270, height: 220, staged: false }
      })
      if (!motion) {
        reducedUpdate = () => {
          let index = 0
          tops.forEach((top, candidate) => { if (top <= scrollY + innerHeight * .45) index = candidate })
          Object.assign(pose.current, HOME_POSE, { anchor: index, opacity: anchors.current[index].staged ? 1 : 0, pulse: 0, explode: 0 })
          paint()
        }
        reducedUpdate()
        return
      }
      context = gsap.context(() => {
        const total = Math.max(1, document.documentElement.scrollHeight - innerHeight)
        const timeline = gsap.timeline({
          defaults: { ease: 'sine.inOut' }, onUpdate: paint,
          scrollTrigger: { start: 0, end: total, scrub: .5, invalidateOnRefresh: true },
        })
        // Timeline units correspond to document pixels. No pinning or scroll spacers.
        timeline.to({}, { duration: total }, 0)
        ordered.slice(1).forEach(({ pose: next }, offset) => {
          const index = offset + 1
          const start = Math.max(0, tops[index] - innerHeight * .9)
          const end = Math.min(total, Math.max(start + 1, tops[index] - innerHeight * .22))
          timeline.to(pose.current, { ...next, anchor: index, duration: end - start }, start)
        })
        timeline.scrollTrigger?.refresh()
        timeline.progress(timeline.scrollTrigger?.progress ?? 0)
        paint()
      })
    }
    const refresh = () => { clearTimeout(timer); timer = setTimeout(build, 120) }
    const scroll = () => { if (!motion) reducedUpdate(); paint() }
    const visibility = () => { if (!document.hidden) { ScrollTrigger.update(); scroll() } }
    build()
    window.addEventListener('scroll', scroll, { passive: true })
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
      window.removeEventListener('scroll', scroll)
      window.removeEventListener('resize', refresh)
      window.removeEventListener('hashchange', refresh)
      window.removeEventListener('pageshow', refresh)
      document.removeEventListener('load', refresh, true)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [invalidate, motion])

  return <SmartSpectacleModel pose={pose} anchors={anchors} surface={surface} motion={motion} onReady={onReady} />
}

export default function ScrollSpectacleScene({ motion, onReady, onFailure }: {
  motion: boolean; onReady: () => void; onFailure: (reason: string) => void
}) {
  const surface = useRef<HTMLDivElement>(null)
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
  useEffect(() => {
    if (!canvas) return
    const lost = (event: Event) => { event.preventDefault(); onFailure('context-lost') }
    canvas.addEventListener('webglcontextlost', lost)
    return () => canvas.removeEventListener('webglcontextlost', lost)
  }, [canvas, onFailure])

  return (
    <div className="spectacle-canvas" ref={surface}>
      <Canvas
        frameloop="demand" dpr={[1, 1.5]}
        camera={{ position: [0, 0, 10], fov: 35, near: .1, far: 40 }}
        gl={props => {
          try {
            const renderer = new WebGLRenderer({ ...props, alpha: true, antialias: true, powerPreference: 'default' })
            renderer.toneMapping = ACESFilmicToneMapping
            renderer.toneMappingExposure = 1.05
            return renderer
          } catch (cause) {
            const error = new Error('WebGL2 renderer initialization failed', { cause })
            error.name = 'WebGLInitializationError'
            throw error
          }
        }}
        onCreated={({ gl }) => setCanvas(gl.domElement)}
      >
        <ambientLight intensity={.7} />
        <directionalLight position={[2, 5, 7]} intensity={2.3} />
        <directionalLight position={[-4, 2, -4]} intensity={1.5} color="#d9f4f1" />
        {/* One local procedural studio capture, no HDR downloads or CDN assets. */}
        <Environment resolution={256} frames={1} environmentIntensity={.8}>
          <Lightformer intensity={3} position={[0, 5, 2]} rotation={[Math.PI / 2, 0, 0]} scale={[8, 3, 1]} />
          <Lightformer intensity={2.5} position={[-5, 1, 3]} rotation={[0, Math.PI / 2, 0]} scale={[3, 5, 1]} />
          <Lightformer intensity={2} position={[5, 2, -2]} rotation={[0, -Math.PI / 2, 0]} scale={[3, 5, 1]} />
        </Environment>
        <Choreography surface={surface} motion={motion} onReady={onReady} />
      </Canvas>
    </div>
  )
}

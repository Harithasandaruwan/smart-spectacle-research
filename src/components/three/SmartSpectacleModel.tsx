import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { Group, MeshStandardMaterial, Shape, Path } from 'three'
import type { MutableRefObject } from 'react'
import type { SpectaclePose } from './scenePoses'

function roundedOutline(width: number, height: number, radius: number) {
  const path = new Path()
  const x = -width / 2, y = -height / 2
  path.moveTo(x + radius, y)
  path.lineTo(x + width - radius, y)
  path.quadraticCurveTo(x + width, y, x + width, y + radius)
  path.lineTo(x + width, y + height - radius)
  path.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  path.lineTo(x + radius, y + height)
  path.quadraticCurveTo(x, y + height, x, y + height - radius)
  path.lineTo(x, y + radius)
  path.quadraticCurveTo(x, y, x + radius, y)
  return path
}

// Shapes are CPU-side outlines; Fiber owns and disposes the declarative GPU geometry.
const lensShape = new Shape(roundedOutline(1.65, 1.08, .3).getPoints(12))
const frameShape = new Shape(roundedOutline(1.9, 1.33, .4).getPoints(12))
frameShape.holes.push(roundedOutline(1.65, 1.08, .3))
const frameOptions = { depth: .12, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: .035, bevelThickness: .035, curveSegments: 12 }

function Housing({ size, position, color = '#172b3a' }: {
  size: [number, number, number]; position: [number, number, number]; color?: string
}) {
  return (
    <RoundedBox args={size} position={position} radius={.045} smoothness={2}>
      <meshStandardMaterial color={color} roughness={.38} metalness={.35} />
    </RoundedBox>
  )
}

export default function SmartSpectacleModel({ pose }: { pose: MutableRefObject<SpectaclePose> }) {
  const root = useRef<Group>(null)
  const lenses = useRef<Group>(null)
  const camera = useRef<Group>(null)
  const sensors = useRef<Group>(null)
  const glow = useRef<MeshStandardMaterial>(null)
  const cameraRing = useRef<MeshStandardMaterial>(null)
  const sensorFaces = useRef<(MeshStandardMaterial | null)[]>([])
  const viewport = useThree(state => state.viewport)

  useFrame(({ clock, invalidate }) => {
    if (!root.current || document.hidden) return
    const p = pose.current
    const time = clock.elapsedTime
    root.current.visible = p.opacity > .004
    root.current.position.set(p.x * viewport.width, p.y * viewport.height + Math.sin(time * .7) * .035, 0)
    root.current.rotation.set(p.rx + Math.sin(time * .45) * .015, p.ry, p.rz)
    root.current.scale.setScalar(viewport.width * .075 * p.scale)
    if (lenses.current) lenses.current.position.set(0, -p.explode * .22, .09 + p.explode * .72)
    if (camera.current) camera.current.position.set(-p.explode * .28, p.explode * .42, p.explode * .35)
    if (sensors.current) sensors.current.position.set(p.explode * .3, p.explode * .38, p.explode * .4)
    if (glow.current) glow.current.emissiveIntensity = .25 + p.accent * .7 + p.pulse * (.5 + Math.sin(time * 2.5) * .5)
    const intensity = .12 + p.accent * .65 + p.pulse * (.25 + Math.sin(time * 2.5) * .25)
    if (cameraRing.current) cameraRing.current.emissiveIntensity = intensity
    sensorFaces.current.forEach(material => { if (material) material.emissiveIntensity = intensity })
    // Demand rendering stops when invisible or when the tab is hidden. GSAP
    // invalidates on scroll so the model wakes when scrolling back upward.
    if (root.current.visible) invalidate()
  })

  return (
    <group ref={root}>
      {[-1.08, 1.08].map(x => (
        <mesh key={x} position={[x, 0, 0]}>
          <extrudeGeometry args={[frameShape, frameOptions]} />
          <meshStandardMaterial color="#172b3a" roughness={.3} metalness={.55} />
        </mesh>
      ))}
      <Housing size={[.46, .12, .16]} position={[0, .18, .055]} />
      <group ref={lenses} position={[0, 0, .09]}>
        {[-1.08, 1.08].map(x => (
          <mesh key={x} position={[x, 0, 0]}>
            <shapeGeometry args={[lensShape, 16]} />
            <meshPhysicalMaterial color="#8bc9d0" transparent opacity={.24} roughness={.14} metalness={.15} side={2} depthWrite={false} />
          </mesh>
        ))}
      </group>
      {[-1, 1].map(side => (
        <group key={side}>
          <Housing size={[.17, .22, 2.35]} position={[side * 2.01, .37, -1.08]} />
          <Housing size={[.2, .32, .6]} position={[side * 1.96, .2, -2.45]} />
          <Housing size={[.09, .12, .42]} position={[side * 2.11, .37, -.4]} color="#096b78" />
          <Housing size={[.22, .15, .19]} position={[side * .29, -.02, -.05]} color="#b5cbd0" />
        </group>
      ))}
      <group ref={camera}>
        <Housing size={[.48, .36, .32]} position={[-1.75, .6, .13]} />
        <mesh position={[-1.75, .6, .32]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[.125, .125, .1, 24]} />
          <meshStandardMaterial ref={cameraRing} color="#096b78" emissive="#096b78" metalness={.6} roughness={.2} />
        </mesh>
        <mesh position={[-1.75, .6, .38]}>
          <sphereGeometry args={[.084, 20, 12]} />
          <meshStandardMaterial color="#071c2b" metalness={.65} roughness={.13} />
        </mesh>
      </group>
      <group ref={sensors}>
        <Housing size={[.67, .34, .34]} position={[1.62, .61, .14]} />
        <Housing size={[.29, .28, .78]} position={[2.04, .38, -.64]} />
        {[1.45, 1.76].map((x, index) => (
          <mesh key={x} position={[x, .61, .325]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[.095, .095, .045, 20]} />
            <meshStandardMaterial ref={material => { sensorFaces.current[index] = material }} color="#0a4452" emissive="#096b78" emissiveIntensity={.6} roughness={.23} />
          </mesh>
        ))}
        <mesh position={[2.2, .45, -.4]}>
          <sphereGeometry args={[.04, 12, 8]} />
          <meshStandardMaterial ref={glow} color="#9ce8df" emissive="#2ac5b8" />
        </mesh>
      </group>
    </group>
  )
}

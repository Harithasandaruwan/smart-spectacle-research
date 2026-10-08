import { useEffect, useMemo, useRef } from 'react'
import type { RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Box3, Group, MathUtils, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, Vector3 } from 'three'
import type { SceneAnchor, SpectaclePose } from './scenePoses'

export const MODEL_URL = `${import.meta.env.BASE_URL}models/smart-spectacle.glb`

export default function SmartSpectacleModel({ pose, anchors, surface, motion, onReady }: {
  pose: RefObject<SpectaclePose>; anchors: RefObject<SceneAnchor[]>;
  surface: RefObject<HTMLDivElement | null>; motion: boolean; onReady: () => void
}) {
  const { scene } = useGLTF(MODEL_URL)
  const root = useRef<Group>(null)
  const born = useRef<number | null>(null)
  const product = useMemo(() => {
    const model = scene.clone(true)
    const ownedMaterials = new Set<MeshStandardMaterial>()
    const highlights: MeshStandardMaterial[] = []
    const materialCopies = new Map<MeshStandardMaterial, MeshStandardMaterial>()
    model.traverse(object => {
      if (!(object instanceof Mesh)) return
      const copy = (source: MeshStandardMaterial) => {
        if (materialCopies.has(source)) return materialCopies.get(source)!
        const material = source.clone()
        materialCopies.set(source, material)
        ownedMaterials.add(material)
        if (material.name === 'Clear curved lenses' && material instanceof MeshPhysicalMaterial) {
          // An alpha canvas has no opaque background to refract. A transparent
          // physical glass shell keeps lenses clear without a costly opaque
          // transmission pass (which otherwise appears white over page CSS).
          material.transmission = 0
          material.transparent = true
          material.opacity = .14
          material.depthWrite = false
          material.roughness = .06
          material.envMapIntensity = .32
          material.color.set('#cee9ed')
        }
        if (material.name === 'Camera optical glass' && material instanceof MeshPhysicalMaterial) {
          material.transmission = .18
          material.roughness = .055
          material.envMapIntensity = .7
        }
        if (material.name === 'Translucent silicone nose pads' && material instanceof MeshPhysicalMaterial) {
          material.transmission = 0
          material.transparent = true
          material.opacity = .45
          material.depthWrite = false
        }
        if (material.name === 'Restrained teal accent') {
          material.emissive.set('#096b78')
          highlights.push(material)
        }
        return material
      }
      object.material = Array.isArray(object.material) ? object.material.map(copy) : copy(object.material as MeshStandardMaterial)
    })
    const center = new Box3().setFromObject(model).getCenter(new Vector3())
    model.position.sub(center)
    return {
      model, ownedMaterials, highlights,
      lenses: model.getObjectByName('LensAssembly'),
      camera: model.getObjectByName('CameraAssembly'),
      sensors: model.getObjectByName('SensorAssembly'),
    }
  }, [scene])

  useEffect(() => {
    onReady()
    return () => { product.ownedMaterials.forEach(material => material.dispose()) }
  }, [onReady, product])

  useFrame(({ clock, viewport, size, invalidate }) => {
    if (!root.current || document.hidden || !anchors.current.length) return
    const p = pose.current
    const lower = Math.min(anchors.current.length - 1, Math.floor(p.anchor))
    const a = anchors.current[lower]
    const b = anchors.current[Math.min(lower + 1, anchors.current.length - 1)]
    const blend = p.anchor - lower
    const x = MathUtils.lerp(a.x, b.x, blend)
    const y = MathUtils.lerp(a.y, b.y, blend) - scrollY
    const width = MathUtils.lerp(a.width, b.width, blend)
    const height = MathUtils.lerp(a.height, b.height, blend)
    const visible = y + height / 2 > 0 && y - height / 2 < size.height && p.opacity > .004
    root.current.visible = visible
    const time = clock.elapsedTime
    born.current ??= time
    const entrance = motion ? MathUtils.smoothstep(time - born.current, 0, 1.2) : 1
    const idle = motion && visible ? Math.sin(time * .65) * .025 : 0
    const worldPerPixel = viewport.width / size.width
    root.current.position.set((x - size.width / 2) * worldPerPixel, (size.height / 2 - y) * worldPerPixel + idle, 0)
    root.current.rotation.set(p.rx + (motion ? Math.sin(time * .4) * .008 : 0), p.ry, p.rz)
    const fitWidth = Math.min(width * .96, height * 2.15)
    root.current.scale.setScalar(fitWidth * worldPerPixel / 5.5 * p.scale * (.97 + .03 * entrance))
    product.lenses?.position.set(0, -p.explode * .23, p.explode * .64)
    product.camera?.position.set(p.explode * .32, p.explode * .38, p.explode * .2)
    product.sensors?.position.set(-p.explode * .32, p.explode * .38, p.explode * .2)
    const pulse = motion ? p.pulse * (.1 + Math.sin(time * 2) * .1) : 0
    product.highlights.forEach(material => { material.emissiveIntensity = .025 + p.accent * .12 + pulse })
    if (surface.current) {
      // A quiet fade during handoffs prevents the illustration sweeping over
      // paragraphs while its next real layout slot enters the viewport.
      const handoff = 1 - Math.sin(blend * Math.PI) ** 2 * .8
      surface.current.style.opacity = String(visible ? p.opacity * handoff * entrance : 0)
    }
    if (visible && motion) invalidate()
  })

  // Geometry belongs to useGLTF's small shared cache. Only cloned materials
  // belong to this instance; disposing cached geometry would break remounts.
  return <group ref={root}><primitive object={product.model} dispose={null} /></group>
}

export type SpectaclePose = {
  anchor: number; rx: number; ry: number; rz: number
  scale: number; opacity: number; explode: number; accent: number; pulse: number
}
export type SceneAnchor = { x: number; y: number; width: number; height: number; staged: boolean }

// Camera looks along -Z. Angles are radians; scale controls fit within a slot.
export const HOME_POSE: SpectaclePose = {
  anchor: 0, rx: .24, ry: .52, rz: -.06,
  scale: 1, opacity: 1, explode: 0, accent: .2, pulse: 0,
}
export const SECTION_POSES = [
  { id: 'home', pose: HOME_POSE },
  { id: 'research', pose: { ...HOME_POSE, anchor: 1, rx: .2, ry: 1.06, rz: 0, scale: 1, accent: .65 } },
  { id: 'literature', pose: { ...HOME_POSE, anchor: 2, ry: .8, scale: .65, opacity: .06 } },
  { id: 'research-gap', pose: { ...HOME_POSE, anchor: 3, ry: .7, scale: .62, opacity: .045 } },
  { id: 'research-problem', pose: { ...HOME_POSE, anchor: 4, scale: .6, opacity: 0 } },
  { id: 'research-objectives', pose: { ...HOME_POSE, anchor: 5, scale: .6, opacity: 0 } },
  { id: 'methodology', pose: { ...HOME_POSE, anchor: 6, rx: .22, ry: .65, rz: 0, scale: 1, accent: .6, pulse: 1 } },
  { id: 'technologies-used', pose: { ...HOME_POSE, anchor: 7, scale: .6, opacity: 0 } },
  { id: 'components', pose: { ...HOME_POSE, anchor: 8, rx: .3, ry: .4, rz: 0, scale: 1, explode: 1, accent: .35 } },
  { id: 'milestones', pose: { ...HOME_POSE, anchor: 9, scale: .6, opacity: 0 } },
  { id: 'documents', pose: { ...HOME_POSE, anchor: 10, scale: .6, opacity: 0 } },
  { id: 'slides', pose: { ...HOME_POSE, anchor: 11, scale: .6, opacity: 0 } },
  { id: 'about-us', pose: { ...HOME_POSE, anchor: 12, scale: .6, opacity: 0 } },
  { id: 'references', pose: { ...HOME_POSE, anchor: 13, ry: .6, scale: .6, opacity: .025 } },
  { id: 'contact-us', pose: { ...HOME_POSE, anchor: 14, scale: .6, opacity: 0 } },
]

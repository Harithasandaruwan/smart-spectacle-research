export type SpectaclePose = {
  x: number; y: number; rx: number; ry: number; rz: number
  scale: number; opacity: number; explode: number; accent: number; pulse: number
}

// x/y are fractions of the visible world width/height. Scale is relative to
// the viewport width, so the illustration remains beside the content.
export const HOME_POSE: SpectaclePose = {
  x: .28, y: .02, rx: .35, ry: .5, rz: -.12,
  scale: 1, opacity: 1, explode: 0, accent: .15, pulse: 0,
}

export const SECTION_POSES: { id: string; pose: SpectaclePose }[] = [
  { id: 'home', pose: HOME_POSE },
  { id: 'research', pose: { ...HOME_POSE, x: .34, y: .19, ry: -1.02, rz: .05, scale: .8, opacity: .42, accent: 1 } },
  { id: 'literature', pose: { ...HOME_POSE, x: .43, y: .22, ry: -.65, scale: .65, opacity: .12 } },
  { id: 'references', pose: { ...HOME_POSE, x: .43, y: .22, scale: .6, opacity: .06 } },
  { id: 'components', pose: { ...HOME_POSE, x: .31, y: .23, ry: -.35, scale: .74, opacity: .5, explode: 1, accent: .65 } },
  { id: 'methodology', pose: { ...HOME_POSE, x: .34, y: .2, ry: -.55, scale: .78, opacity: .4, accent: .6, pulse: 1 } },
  { id: 'downloads', pose: { ...HOME_POSE, x: .43, y: .22, scale: .6, opacity: .07 } },
  { id: 'team', pose: { ...HOME_POSE, x: .43, y: .22, scale: .6, opacity: 0 } },
]

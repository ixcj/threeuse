import { ColorRepresentation } from 'three'

export interface CreateAppOptions {
  clearColor?: ColorRepresentation

  cameraPosition?: [number, number, number]
  targetPosition?: [number, number, number]

  fov?: number
  aspect?: number
  near?: number
  far?: number
}

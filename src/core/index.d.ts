import type { ThreeUse } from '../ThreeUse'
import type { ColorRepresentation } from 'three'

export declare function createApp(
  options?: CreateAppOptions
): CreateAppReturnValue

export type ObjType = { [key: string | symbol]: any }

export interface CreateAppOptions {
  clearColor?: ColorRepresentation

  cameraPosition?: [number, number, number]
  targetPosition?: [number, number, number]

  fov?: number
  aspect?: number
  near?: number
  far?: number
}

export interface CreateAppReturnValue extends ThreeUse {
  [prop: string]: any
}

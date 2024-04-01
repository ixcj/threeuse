import type { ThreeUse } from './ThreeUse'
import type * as THREE from 'three'

export declare function createApp(
  options?: CreateAppOptions
): CreateAppReturnValue

export type GlobalPropertiesType = { [key: string | symbol]: any }

export interface CreateAppOptions {
  /**
   * 画布颜色
   * @defaultValue #181818
   */
  clearColor?: THREE.ColorRepresentation
  /**
   * 相机初始位置
   * @defaultValue [0, 0, 0]
   */
  cameraPosition?: [number, number, number]
  /**
   * 色彩空间
   * @defaultValue THREE.LinearSRGBColorSpace
   */
  outputColorSpace?: THREE.ColorSpace
}

export interface CreateAppReturnValue extends ThreeUse {
  [prop: string]: any
}

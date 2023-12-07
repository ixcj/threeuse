import type { ThreeUse } from './ThreeUse'
import type { ColorRepresentation } from 'three'

export declare function createApp(
  options?: CreateAppOptions
): CreateAppReturnValue

export type ObjType = { [key: string | symbol]: any }

export interface CreateAppOptions {
  /**
   * 画布颜色
   * @defaultValue #181818
   */
  clearColor?: ColorRepresentation

  /**
   * 相机初始位置
   * @defaultValue [0, 0, 0]
   */
  cameraPosition?: [number, number, number]
  
  /**
   * 相机fov参数
   * @defaultValue 75
   */
  fov?: number
  /**
   * 相机aspect参数
   * @defaultValue 16/9
   */
  aspect?: number
  /**
   * 相机near参数
   * @defaultValue 0.1
   */
  near?: number
  /**
   * 相机far参数
   * @defaultValue 1000
   */
  far?: number
}

export interface CreateAppReturnValue extends ThreeUse {
  [prop: string]: any
}

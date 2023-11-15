import type { Ref } from 'vue'
import type { Scene } from 'three'

export declare function useSkyBox(
  scene: Scene,
  options?: UseSkyBoxOptions
): UseSkyBoxReturnValue

export interface UseSkyBoxOptions {
  /**
   * 天空盒大小
   * @defaultValue 4000
   */
  skyBoxSize?: number
  /**
   * 平行光的名称
   * @defaultValue '_sky_.light'
   */
  directionalLightName?: string
  /**
   * 需要创建阴影的名称列表
   * @defaultValue []
   */
  castShadowList?: Array<string>
  /**
   * 过渡速度，为0时表示不使用过渡
   * @defaultValue 3
   */
  transitionSpeed?: number
  /**
   * 更新天空后的回调
   * @defaultValue undefined
   */
  updateCallback?: () => {} | undefined
}

export interface UseSkyBoxReturnValue {
  /**
   * 天空盒当前时间
   */
  skyBoxTime: Ref<number>
  /**
   * 控制器
   */
  control: UseSkyBoxControl
}

export interface UseSkyBoxControl {
  /**
   * 福瑞散射 主要影响天空颜色
   */
  rayleigh?: number,
  /**
   * 浊度
   */
  turbidity?: number,
  /**
   * 米氏散射 主要影响光晕
   */
  mieCoefficient?: number,
  /**
   * 米氏散射方向
   */
  mieDirectionalG?: number,
  /**
   * 太阳高度
   */
  elevation?: number,
  /**
   * 方位角度
   */
  azimuth?: number,
}

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
   * 环境光动态过渡效果
   * @defaultValue true
   */
  dynamicEnvironment?: boolean
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

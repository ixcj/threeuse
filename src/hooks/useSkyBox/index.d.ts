import type { Ref } from 'vue'
import type { Scene } from 'three'

export declare function useSkyBox(
  scene: Scene,
  options?: UseSkyBoxOptions
): UseSkyBoxReturnValue

export interface UseSkyBoxOptions {
  /**
   * 默认值
   * @defaultValue 0
   */
  defaultValue?: number
  /**
   * 天空盒大小
   * @defaultValue 4000
   */
  size?: number
  /**
   * 天空盒位置
   * @defaultValue [0, 0, 0]
   */
  position?: [number, number, number]
  /**
   * 阳光（平行光对象）的名称
   * @defaultValue '_sky_.sunLight'
   */
  sunLightName?: string
  /**
   * 显示阳光
   * @defaultValue true
   */
  showSunLight?: boolean
  /**
   * 需要创建阴影的名称列表，要开启阴影投射必须要将showSunLight设置为true
   * @defaultValue []
   */
  castShadowList?: Array<string>
  /**
   * 投射阴影查找上层递归次数
   * @defaultValue 2
   */
  castShadowNumber?: number
  /**
   * 过渡时间倍率，为0时表示不使用过渡。值越大，过渡越慢
   * @defaultValue 3
   */
  durationMultiple?: number
  /**
   * 更新天空后的回调
   * @defaultValue undefined
   */
  updateCallback?: Function | undefined
}

export interface UseSkyBoxReturnValue {
  /**
   * 天空盒当前时间
   */
  value: Ref<number>
  /**
   * 控制器
   */
  control: Ref<UseSkyBoxControl>
}

export interface UseSkyBoxControl {
  /**
   * 福瑞散射 主要影响天空颜色
   */
  rayleigh: number,
  /**
   * 浊度
   */
  turbidity: number,
  /**
   * 米氏散射 主要影响光晕
   */
  mieCoefficient: number,
  /**
   * 米氏散射方向
   */
  mieDirectionalG: number,
  /**
   * 太阳高度
   */
  elevation: number,
  /**
   * 方位角度
   */
  azimuth: number,
}

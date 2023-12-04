import { T as ThreeUse } from './ThreeUse-803bba21.js';
export { T as default } from './ThreeUse-803bba21.js';
import { ColorRepresentation, Scene } from 'three';
import { Ref } from 'vue';
import 'three/examples/jsm/controls/OrbitControls.js';

declare function createApp(
  options?: CreateAppOptions
): CreateAppReturnValue

type ObjType = { [key: string | symbol]: any }

interface CreateAppOptions {
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
   * 控制器target初始位置
   * @defaultValue [0, 0, 0]
   */
  targetPosition?: [number, number, number]
  
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

interface CreateAppReturnValue extends ThreeUse {
  [prop: string]: any
}

declare function useRollingData<T = any>(
  list: Array<T>,
  options?: UseRollingDataOptions
): UseRollingDataReturnValue

interface UseRollingDataOptions {
  /**
   * 返回数据的长度
   * @defaultValue 10
   */
  length?: number
  /**
   * 滚动间隔
   * @defaultValue 1000
   */
  interval?: number
  /**
   * 初始下标
   * @defaultValue 0
   */
  initialIndex?: number
  /**
   * 激活状态（是否直接开始滚动）
   * @defaultValue false
   */
  activate?: boolean
  /**
   * 填充模式分为两种：直接填充和缓慢填充
   * @defaultValue 'DirectFill'
   */
  mode?: 'DirectFill' | 'SlowFill'
}

interface UseRollingDataReturnValue<T = any> {
  /**
   * 用于显示的数据
   */
  displayData: Ref<Array<T>>
  /**
   * 当前数据在原始数据的开始索引
   */
  index: Ref<number>
  /**
   * 当前数据在原始数据的结束索引
   */
  endIdex: Ref<number>
  /**
   * 是否开始滚动
   */
  start: Ref<boolean>
  /**
   * Symbol类型的key
   */
  key: symbol | string
}

type Key = symbol | string
type Fn = (timeDifference: number) => void

declare function useRender(
  fn: Fn,
  options?: UseRenderClockOptions
): UseRenderReturnValue

interface UseRenderClockOptions {
  /**
   * key
   * @defaultValue Symbol()
   */
  key?: symbol | string,
  /**
   * 是否激活
   * @defaultValue true
   */
  activate?: boolean,
}

interface UseRenderReturnValue {
  /**
   * 是否开始渲染
   */
  start: Ref<boolean>
  /**
   * key
   */
  key: symbol | string
}

declare function useSkyBox(
  scene: Scene,
  options?: UseSkyBoxOptions
): UseSkyBoxReturnValue

interface UseSkyBoxOptions {
  /**
   * 天空盒大小
   * @defaultValue [4000, 4000, 4000]
   */
  size?: [number, number, number]
  /**
   * 天空盒位置
   * @defaultValue [0, 0, 0]
   */
  position?: [number, number, number]
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

interface UseSkyBoxReturnValue {
  /**
   * 天空盒当前时间
   */
  skyBoxTime: Ref<number>
  /**
   * 控制器
   */
  control: UseSkyBoxControl
}

interface UseSkyBoxControl {
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

export { CreateAppOptions, CreateAppReturnValue, Fn, Key, ObjType, UseRenderClockOptions, UseRenderReturnValue, UseRollingDataOptions, UseRollingDataReturnValue, UseSkyBoxControl, UseSkyBoxOptions, UseSkyBoxReturnValue, createApp, useRender, useRollingData, useSkyBox };

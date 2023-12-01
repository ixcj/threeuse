import { ColorRepresentation, Scene, PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Ref } from 'vue';

interface CreateAppOptions$1 {
  clearColor?: ColorRepresentation

  cameraPosition?: [number, number, number]
  targetPosition?: [number, number, number]

  fov?: number
  aspect?: number
  near?: number
  far?: number
}

interface InstallFunction {
    (app: ThreeUse, ...options: any[]): void;
}
type Plugin = {
    install: InstallFunction;
} | InstallFunction;
declare class ThreeUse {
    private _container;
    private _renderer;
    private _scene;
    private _camera;
    private _controls;
    private _resizeObserver;
    private _size;
    private _customRender;
    private _setSize;
    private _setCamera;
    private _resize;
    private _render;
    globalProperties: Record<string | symbol, any>;
    constructor(options?: CreateAppOptions$1);
    getDom(): Element;
    getControls(): OrbitControls;
    getScene(): Scene;
    getCamera(): PerspectiveCamera;
    use(plugin: Plugin, ...options: any[]): this;
    mount(rootContainer: Element | string): this;
    unmount(): this;
}

declare function createApp(
  options?: CreateAppOptions
): CreateAppReturnValue

type ObjType = { [key: string | symbol]: any }

interface CreateAppOptions {
  clearColor?: ColorRepresentation

  cameraPosition?: [number, number, number]
  targetPosition?: [number, number, number]

  fov?: number
  aspect?: number
  near?: number
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

export { CreateAppOptions, CreateAppReturnValue, Fn, Key, ObjType, UseRenderClockOptions, UseRenderReturnValue, UseRollingDataOptions, UseRollingDataReturnValue, UseSkyBoxControl, UseSkyBoxOptions, UseSkyBoxReturnValue, createApp, ThreeUse as default, useRender, useRollingData, useSkyBox };

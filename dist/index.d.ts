import { Ref } from 'vue';

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
  index: Ref<Number>
  /**
   * 当前数据在原始数据的结束索引
   */
  endIdex: Ref<Number>
  /**
   * 是否开始滚动
   */
  start: Ref<Boolean>
  /**
   * Symbol类型的key
   */
  key: Symbol
}

/**
 * 最后一次更新的时间戳
 */
declare let lastUpdatedTimestamp: number;
/**
 * 所有注册的函数，每次渲染屏幕时执行
 */
declare const registeredRenderFunctionMap: Map<Symbol, Function>;

declare const render_lastUpdatedTimestamp: typeof lastUpdatedTimestamp;
declare const render_registeredRenderFunctionMap: typeof registeredRenderFunctionMap;
declare namespace render {
  export {
    render_lastUpdatedTimestamp as lastUpdatedTimestamp,
    render_registeredRenderFunctionMap as registeredRenderFunctionMap,
  };
}

export { UseRollingDataOptions, UseRollingDataReturnValue, render };

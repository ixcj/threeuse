import type { Ref } from 'vue'

export interface UseRollingDataOptions {
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

export interface UseRollingDataReturnValue<T = any> {
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

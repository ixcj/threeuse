import type { Ref } from 'vue'

export type Key = symbol | string
export type Fn = (timeDifference: number) => void

export declare function useRender(
  fn: Fn,
  options?: UseRenderClockOptions
): UseRenderReturnValue

export interface UseRenderClockOptions {
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

export interface UseRenderReturnValue {
  /**
   * 是否开始渲染
   */
  start: Ref<boolean>
  /**
   * key
   */
  key: symbol | string
  /**
   * 卸载
   */
  unload: Function
}

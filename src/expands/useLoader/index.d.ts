import type { Ref } from 'vue'
import type {

} from 'three'

export declare function useLoader(
  resource: ResourceItem | ResourceItem[] | undefined,
  options?: UseLoaderOptions
): UseLoaderReturnValue

export type ResoureType = 'gltf'
  | 'obj'
  | 'fbx'
  | 'texture'
  | 'cube'
  | 'hdr'

export interface ResourceItem {
  /**
   * 资源名称
   */
  name: string
  /**
   * 资源类型
   */
  type: ResoureType
  /**
   * 资源路径
   */
  path: string
}

export interface UseLoaderOptions {
  /**
   * 立即加载的模型
   * @defaultValue undefined
   */
  loadImmediately?: 'all' | string[] | undefined
  /**
   * 是否启用draco压缩
   * @defaultValue false
   */
  enableDracoLoader?: boolean
  /**
   * draco的路径
   * @defaultValue https://cdn.jsdelivr.net/npm/draco-web-decoder@1.0.0/dist/index.min.js
   */
  dracoDecoderPath?: string
  /**
   * 自动获取资源大小的模式。 fetch: 使用额外的fetch请求获取资源大小。file: 加载时获取资源大小，不发送额外请求
   * @defaultValue 'fetch'
   */
  getContentLengthMode?: 'fetch' | 'file'
}

export interface UseLoaderReturnValue {
  /**
   * 是否加载
   */
  loading: Ref<boolean>
  /**
   * 加载数量
   */
  loadQuantity: Ref<number>
  /**
   * 加载器
   */
  loader: Loader
}

export interface Loader {
  /**
   * 资源Map
   */
  resourceMap: Map<string, ReturnResourceItem>
  /**
   * 资源列表
   */
  resourceList: readonly Ref<ReturnResourceItem[]>
  /**
   * 加载进度
   */
  loadProgress: LoadingProgress
  /**
   * 加载资源
   */
  load: (resource: string | string[]) => Promise
  /**
   * 添加资源
   */
  add: (resource: ResourceItem | ResourceItem[]) => void
  /**
   * 移除资源
   */
  remove: (names: string | string[]) => void
  /**
   * 获取资源是否加载完成
   */
  has: (name: string) => boolean
  /**
   * 获取资源
   */
  get(name: string): ReturnResourceItem | undefined
  get(names: string[]): ReturnResourceItem[] | undefined
}

export interface ReturnResourceItem {
  /**
   * 资源名称
   */
  name: string
  /**
   * 资源类型
   */
  type: ResoureType
  /**
   * 资源路径
   */
  path: string
  /**
   * 资源
   */
  resource: any
  /**
   * 是否加载完成
   * @defaultValue false
   */
  isLoad: boolean
  /**
   * 资源大小
   * @defaultValue 0
   */
  contentLength: number
}

export interface LoadingProgress {
  [name: string]: {
    total: number,
    progress: number,
  }
}

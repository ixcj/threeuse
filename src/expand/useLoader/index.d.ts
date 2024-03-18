import type { Ref } from 'vue'
import type {

} from 'three'

export declare function useLoader(
  resource: ResourceItem | ResourceItem[],
  options?: UseLoaderOptions
): UseLoaderReturnValue

export type ResoureType = 'gltfModel'
  | 'fbxModel'
  | 'objModel'
  | 'texture'
  | 'video'
  | 'audio'
  | 'cubeTexture'
  | 'hdrTexture'

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
   * 资源大小。为0时，自动获取
   * @defaultValue 0
   */
  contentLength?: number
  /**
   * 自动获取资源大小的模式。 fetch: 使用额外的fetch请求获取资源大小。file: 加载时获取资源大小，不发送额外请求
   * @defaultValue 'fetch'
   */
  getContentLengthMode?: 'fetch' | 'file'
}

export interface UseLoaderReturnValue {
  /**
   * 资源列表
   */
  resourceList: ReturnResourceItem[]
  /**
   * 是否加载
   */
  isLoading: Ref<boolean>
  /**
   * 加载进度
   */
  loadProgress: LoadingProgress
  /**
   * 已经加载完成的数量
   */
  quantityCompleted: Ref<number>
  /**
   * 加载资源
   */
  onLoad: (resource: string | string[]) => void
  /**
   * 获取资源是否加载完成
   */
  has: (name: string) => boolean
  /**
   * 获取资源
   */
  get: <T = any>(name: string) => T
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

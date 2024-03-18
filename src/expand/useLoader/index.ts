import {
  ResourceItem,
  ReturnResourceItem,
  UseLoaderOptions,
  UseLoaderReturnValue
} from './index.d'
import {
  ref,
  reactive,
  computed
} from 'vue'

const isLoading = ref(false)
const resourceList = reactive<ReturnResourceItem[]>([])
const loadProgress = reactive({})
const loadCompleteMap = reactive(new Map<string, any>())

const quantityCompleted = computed(() => loadCompleteMap.size)

const loadItem = async (name: string) => {

}

const onLoad = (resource: string | string[]) => {
  if (!resource || resource?.length) return

  isLoading.value = true
  if (Array.isArray(resource)) {
    resource.forEach((item) => {
      loadCompleteMap.set(item, undefined)
    })
  } else {
    loadCompleteMap.set(resource, undefined)
  }
}

const has = (name: string) => loadCompleteMap.has(name)
const get = <T = any>(name: string): T => loadCompleteMap.get(name)

export function useLoader(resource: ResourceItem | ResourceItem[], options: UseLoaderOptions = {}): UseLoaderReturnValue {
  const {
    loadImmediately = undefined,
    enableDracoLoader = false,
    contentLength = 0,
    getContentLengthMode = 'fetch',
  } = options

  resourceList.push()

  return {
    resourceList,
    isLoading,
    loadProgress,
    quantityCompleted,
    onLoad,
    has,
    get
  }
}

import {
  ResourceItem,
  ResoureType,
  ReturnResourceItem,
  UseLoaderOptions,
  UseLoaderReturnValue,
} from './index.d'
import { ref, reactive, computed, watchEffect } from 'vue'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

const isLoading = ref(false)
const resourceMap = reactive(new Map<string, ReturnResourceItem>())
const resourceList = computed(() => Array.from(resourceMap.values()))
const loadProgress = reactive({})

const loaders = new Map()
loaders.set('gltf', new GLTFLoader())
loaders.set('gltfDraco', new GLTFLoader())

watchEffect(() => {
  const types = [...new Set(resourceList.value.map((item) => item.type))]
  types.forEach((type) => {
    if (!loaders.has(type)) {
      switch (type) {
        case 'fbx':
          break
        case 'obj':
          break
        case 'texture':
          break
        case 'video':
          break
        case 'audio':
          break
        case 'cube':
          break
        case 'hdr':
          break
      }
    }
  })
})

const loadItem = async (name: string, enableDracoLoader: boolean = false) => {
  const resourceItem = resourceMap.get(name)
  if (!resourceItem?.isLoad) {
    console.log(`加载资源${name}`)
  }
}

const addItem = (name: string, type: ResoureType) => {
  if (has(name)) {
    console.error(`资源添加失败，${name}已存在`)
    return
  }

  resourceMap.set(name, {
    name,
    type,
    resource: undefined,
    isLoad: false,
    contentLength: 0,
  })
}

const _load = (names: string | string[], options: UseLoaderOptions) => {
  if (!names || names?.length) return

  const {
    enableDracoLoader = false,
    // getContentLengthMode = 'fetch',
  } = options

  isLoading.value = true

  const taskList: Promise<any>[] = []

  if (Array.isArray(names)) {
    names.forEach((name) => {
      taskList.push(loadItem(name, enableDracoLoader))
    })
  } else {
    taskList.push(loadItem(names, enableDracoLoader))
  }

  return new Promise((resolve, reject) => {
    Promise.all(taskList)
      .then(() => {
        resolve(resourceList.value)
      })
      .catch((err) => {
        reject(err)
      })
      .finally(() => {
        isLoading.value = false
      })
  })
}

const add = (resource: ResourceItem | ResourceItem[]) => {
  if (!resource) return

  if (Array.isArray(resource)) {
    resource.forEach((item) => {
      const { name, type } = item
      addItem(name, type)
    })
  } else {
    const { name, type } = resource
    addItem(name, type)
  }
}

const remove = (names: string | string[]) => {
  if (!names || names?.length) return

  if (Array.isArray(names)) {
    names.forEach((name) => {
      resourceMap.delete(name)
    })
  } else {
    resourceMap.delete(names)
  }
}

const has = (name: string) => resourceMap.has(name)

function get(name: string): ReturnResourceItem | undefined
function get(names: string[]): ReturnResourceItem[] | undefined
function get(names: string | string[]): ReturnResourceItem | ReturnResourceItem[] | undefined {
  if (!names) return undefined

  if (Array.isArray(names)) {
    const result = names.map(name => resourceMap.get(name))
    return result.filter(Boolean) as ReturnResourceItem[]
  } else {
    return resourceMap.get(names)
  }
}

function setDracoLoader(path: string) {
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath(path)
  loaders.get('gltfDraco')?.setDRACOLoader(dracoLoader)
}

export function useLoader(
  resource: ResourceItem | ResourceItem[] | undefined,
  options: UseLoaderOptions = {}
): UseLoaderReturnValue {
  const {
    loadImmediately = undefined,
    enableDracoLoader = false,
    dracoDecoderPath = 'https://cdn.jsdelivr.net/npm/draco-web-decoder@1.0.0/dist/index.min.js'
  } = options

  enableDracoLoader && setDracoLoader(dracoDecoderPath)

  resource && add(resource)

  const load = (names: string | string[]) => _load(names, options)

  if (resource && loadImmediately) {
    if (loadImmediately === 'all') {
      const loadNmaes = Array.isArray(resource) ? resource.map(item => item.name) : resource.name
      load(loadNmaes)
    }
  }

  return {
    resourceMap,
    resourceList,
    isLoading,
    loadProgress,
    load,
    add,
    remove,
    has,
    get,
  }
}

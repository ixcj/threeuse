import {
  ResourceItem,
  ReturnResourceItem,
  UseLoaderOptions,
  UseLoaderReturnValue,
} from './index.d'
import {
  type Ref,
  ref,
  reactive,
  computed,
  watchEffect
} from 'vue'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

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
        case 'obj':
          break
        case 'fbx':
          break
        case 'texture':
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

  if (!resourceItem) {
    console.error(`资源加载失败，${name} 不存在`)
    return
  }

  if (resourceItem.isLoad) {
    return resourceItem
  } else {
    const { type, path } = resourceItem

    const gltfDraco = type === 'gltf' && enableDracoLoader
    const loader = gltfDraco
      ? loaders.get('gltfDraco')
      : loaders.get(type)

    return new Promise((resolve, reject) => {
      loader.load(
        path,
        (file: any) => {
          file.scene.name = name
          resourceItem.resource = file
          resolve(file)
        }
      )
    })
  }
}

const addItem = (resource: ResourceItem) => {
  const { name, type, path } = resource
  if (has(name)) {
    console.warn(`资源 ${name} 已存在，请勿重复添加`)
    return
  }

  resourceMap.set(name, {
    name,
    type,
    path,
    resource: undefined,
    isLoad: false,
    contentLength: 0,
  })
}

const _load = (
  names: string | string[],
  loading: Ref<boolean>,
  options: UseLoaderOptions,
) => {
  if (!names) return

  const {
    enableDracoLoader = false,
    // getContentLengthMode = 'fetch',
  } = options

  loading.value = true

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
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
      .finally(() => {
        loading.value = false
      })
  })
}

const add = (resource: ResourceItem | ResourceItem[]) => {
  if (!resource) return

  if (Array.isArray(resource)) {
    resource.forEach((item) => addItem(item))
  } else {
    addItem(resource)
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
  loaders.get('gltfDraco').setDRACOLoader(dracoLoader)
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

  const loading = ref(false)
  const loadQuantity = ref(0)

  enableDracoLoader && setDracoLoader(dracoDecoderPath)
  resource && add(resource)

  const load = (names: string | string[]) => _load(names, loading, options)

  if (resource && loadImmediately) {
    let loadNmaes
    if (loadImmediately === 'all') {
      loadNmaes = Array.isArray(resource)
        ? resource.map(item => item.name)
        : resource.name
    } else {
      loadNmaes = loadImmediately
    }

    load(loadNmaes)
  }

  return {
    loading,
    loadQuantity,
    loader: {
      resourceMap,
      resourceList,
      loadProgress,
      load,
      add,
      remove,
      has,
      get,
    }
  }
}

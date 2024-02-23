import type { CreateAppOptions } from "../core/index.d"
import { isString, isFunction } from "@/utils/type"
import {
  ref,
  type Ref
} from "vue"
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  Vector3,
  LinearSRGBColorSpace,
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { debounce } from "@/utils/handle"

// interface
interface InstallFunction {
  (app: ThreeUse, ...options: any[]): void
}

// type
export type Listener = (...args: any[]) => void
export type Behavior = Record<string, Listener>
export type Plugin = { install: InstallFunction } | InstallFunction

export class ThreeUse {
  // 需要初始化的私有属性
  private _renderer: WebGLRenderer
  private _scene: Scene
  private _camera: Ref<PerspectiveCamera>

  constructor(options: CreateAppOptions = {}) {
    const {
      clearColor = "#181818",
      cameraPosition = [0, 0, 0],
      outputColorSpace = LinearSRGBColorSpace,
    } = options

    this._scene = new Scene()
    this._camera = ref<PerspectiveCamera>(new PerspectiveCamera(35, 16 / 9, 0.1, 10000))
    this._camera.value.position.set(...cameraPosition)

    this._renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      failIfMajorPerformanceCaveat: true,
    })
    this._renderer.shadowMap.enabled = true
    this._renderer.outputColorSpace = outputColorSpace
    this._renderer.setClearColor(new Color(clearColor))
  }

  // 私有属性
  private _container: Element
  private _controls: Ref<any> = ref(null)
  private _events: Record<string, Listener[]> = {}
  private _resizeObserver = new ResizeObserver(() => this._resize())
  private _size = { width: 0, height: 0, devicePixelRatio: 1 }

  // 公共属性
  public mounted: boolean = false
  public enableCustomRender: boolean = false
  public globalProperties: Record<string | symbol, any> = {}

  // 私有方法
  private _customRender:
    | null
    | undefined
    | ((scene: Scene, camera: PerspectiveCamera, app: ThreeUse) => void) =
    undefined

  private _setSize(): void {
    this._size.width = this._container?.clientWidth || 0
    this._size.height = this._container?.clientHeight || 0
    this._size.devicePixelRatio = devicePixelRatio || 1

    this._camera.value.aspect = this._size.width / this._size.height
    this._camera.value.updateProjectionMatrix()
    this._renderer.setSize(this._size.width, this._size.height)
    this._renderer.setPixelRatio(this._size.devicePixelRatio)
  }

  private _render(): void {
    requestAnimationFrame(this._render.bind(this))

    if (this.enableCustomRender && isFunction(this._customRender)) {
      this._customRender(this._scene, this._camera.value, this)
    } else {
      this._renderer.render(this._scene, this._camera.value)
    }
  }

  private _resize = debounce(
    () => {
      if (this.mounted) {
        this._setSize()

        this.send("resize")
      }
    },
    16,
    true
  )

  // 公共方法
  getRenderer(): WebGLRenderer {
    return this._renderer
  }

  getDom(): HTMLCanvasElement {
    return this._renderer.domElement
  }

  getContainer(): Element {
    return this._container
  }

  getControls<T = any>(): T {
    return createRefProxy<T>(this._controls)
  }

  getScene(): Scene {
    return this._scene
  }

  getCamera(): PerspectiveCamera {
    return createRefProxy<PerspectiveCamera>(this._camera)
  }

  setControls<T>(controls: T): void {
    this._controls.value = controls
  }

  use(plugin: Plugin, ...options: any[]): this {
    if (isFunction(plugin)) {
      plugin(this, options)
    } else if (plugin && isFunction(plugin.install)) {
      plugin.install(this, options)
    }

    return this
  }

  mount(rootContainer: Element | string): this {
    const container = normalizeContainer(rootContainer)

    if (container) {
      this._container = container
      this._resizeObserver.observe(this._container)
      container.appendChild(this._renderer.domElement)
      this.mounted = true

      this._resize()
      this._render()

      if (!this._controls.value) {
        this.setControls(new OrbitControls(this._camera.value, this._renderer.domElement))
        this._controls.value.target = new Vector3(0, 0, 0)
      }

      this.send("mount")
    }

    return this
  }

  unmount(): this {
    const domElement = this._renderer.domElement
    if (domElement) {
      domElement.remove()
      this.mounted = true

      this.send("unmount")
    }

    return this
  }

  on(eventName: string, listener: Listener): void {
    if (!this._events[eventName]) {
      this._events[eventName] = []
    }

    this._events[eventName].push(listener)
  }

  off(eventName: string, listenerToRemove: Listener): void {
    if (!this._events[eventName]) return

    this._events[eventName] = this._events[eventName].filter(
      (listener: Listener) => listener !== listenerToRemove
    )
  }
  
  send(eventName: string, ...args: any[]): void {
    if (this._events[eventName]) {
      this._events[eventName].forEach((listener) => {
        listener(...args)
      })
    }
  }

  subscribe(behavior: Behavior): void {
    Object.entries(behavior).forEach(([eventName, listener]) => {
      this.on(eventName, listener)
    })
  }

  unsubscribe(behavior: Behavior): void {
    Object.entries(behavior).forEach(([eventName, listener]) => {
      this.off(eventName, listener)
    })
  }
}

function normalizeContainer(container: Element | string): Element | null {
  if (isString(container)) {
    return document.querySelector(container)
  }

  return container
}

function createRefProxy<T = any>(target: Ref<T>): T {
  return new Proxy(target, {
    get(target) {
      return target.value
    }
  }) as T
}

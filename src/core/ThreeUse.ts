import type { CreateAppOptions } from "../core/index.d"
import { isString, isFunction } from "@/utils/type"
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
export type ObserverTyep = "mount" | "unmount" | "resize"
export type ObserverBehavior = { [type in ObserverTyep]?: Function }
export type Plugin = { install: InstallFunction } | InstallFunction

export class ThreeUse {
  // 需要初始化的私有属性
  private _renderer: WebGLRenderer
  private _scene: Scene
  private _camera: PerspectiveCamera

  constructor(options: CreateAppOptions = {}) {
    const {
      clearColor = "#181818",

      cameraPosition = [0, 0, 0],

      fov = 35,
      aspect = 16 / 9,
      near = 0.5,
      far = 10000,

      outputColorSpace = LinearSRGBColorSpace,
    } = options

    this._scene = new Scene()
    this._camera = new PerspectiveCamera(fov, aspect, near, far)
    this._camera.position.set(...cameraPosition)

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
  private _controls: any
  private _container: Element
  private _resizeObserver = new ResizeObserver(() => this._resize())
  private _subscribe: Map<symbol | string, ObserverBehavior> = new Map()
  private _size: { width: number; height: number } = {
    width: 0,
    height: 0,
  }

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
  }

  private _setCamera(): void {
    this._camera.aspect = this._size.width / this._size.height
    this._camera.updateProjectionMatrix()
    this._renderer.setSize(this._size.width, this._size.height)
  }

  private _render(): void {
    requestAnimationFrame(this._render.bind(this))

    if (this.enableCustomRender && isFunction(this._customRender)) {
      this._customRender(this._scene, this._camera, this)
    } else {
      this._renderer.render(this._scene, this._camera)
    }
  }

  private _notify(notifyType: ObserverTyep, data?: unknown) {
    this._subscribe.forEach((behavior) => {
      const fn = behavior[notifyType]

      if (isFunction(fn)) {
        try {
          data ? fn(data) : fn()
        } catch (err) {
          console.error(err)
        }
      }
    })
  }

  private _resize = debounce(
    () => {
      this._setSize()
      this._setCamera()
      this._renderer.setPixelRatio(devicePixelRatio || 1)

      this._notify("resize")
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

  getControls(): any {
    return this._controls
  }

  getScene(): Scene {
    return this._scene
  }

  getCamera(): PerspectiveCamera {
    return this._camera
  }

  setControls(controls: unknown): this {
    this._controls = controls

    return this
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
      container.appendChild(this.getDom())
      this.mounted = true

      this._resize()
      this._render()

      if (!this._controls) {
        this._controls = new OrbitControls(this._camera, this.getDom())
        this._controls.target = new Vector3(0, 0, 0)
      }

      this._notify("mount")
    }

    return this
  }

  unmount(): this {
    const domElement = this.getDom()
    if (domElement) {
      domElement.remove()
      this.mounted = true

      this._notify("unmount")
    }

    return this
  }

  subscribe(
    behavior: ObserverBehavior,
    key: symbol | string = Symbol()
  ): symbol | string {
    this._subscribe.set(key, behavior)

    return key
  }

  unSubscribe(key: symbol | string): void {
    this._subscribe.delete(key)
  }
}

function normalizeContainer(container: Element | string): Element | null {
  if (isString(container)) {
    return document.querySelector(container)
  }

  return container
}

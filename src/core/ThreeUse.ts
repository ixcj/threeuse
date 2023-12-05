import type { CreateAppOptions } from '../core/index.d'
import { isString, isFunction } from '@/utils/type'
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  Vector3,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { debounce } from '@/utils/handle'

interface InstallFunction {
  (app: ThreeUse, ...options: any[]): void
}

type ObserverTyep = 'mount' | 'unmount'
type ObserverBehavior = { [type in ObserverTyep ]?: Function }
type GlobalPropertiesKey = string | symbol
type Plugin = { install: InstallFunction } | InstallFunction

export class ThreeUse {
  private _renderer: WebGLRenderer
  private _scene: Scene
  private _camera: PerspectiveCamera
  private _controls: OrbitControls

  constructor(options: CreateAppOptions = {}) {
    const {
      clearColor = '#181818',

      cameraPosition = [0, 0, 0],
      targetPosition = [0, 0, 0],

      fov =  75,
      aspect =  16/9,
      near =  0.1,
      far =  1000,
    } = options

    this._scene = new Scene()
    this._camera = new PerspectiveCamera(fov, aspect, near, far)
    this._camera.position.set(...cameraPosition)

    this._renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      failIfMajorPerformanceCaveat: true,
    })
    this._renderer.setClearColor(new Color(clearColor))

    this._controls = new OrbitControls(this._camera, this._renderer.domElement)
    this._controls.target = new Vector3(...targetPosition)
  }

  private _container: Element
  private _resizeObserver = new ResizeObserver(() => this._resize())
  private _eventList: ObserverBehavior[] = []
  private _subscribe: WeakMap<Object, ObserverBehavior> = new WeakMap()
  private _size: { width: number, height: number } = {
    width: 0,
    height: 0
  }

  public globalProperties: Record<GlobalPropertiesKey, any> = {}

  private _customRender: null | undefined | ((scene: Scene, camera: PerspectiveCamera, app: ThreeUse) => void) = undefined

  private _setSize(): void {    
    this._size.width = this._container?.clientWidth || 0
    this._size.height = this._container?.clientHeight || 0
  }

  private _setCamera(): void {
    this._camera.aspect = this._size.width / this._size.height
    this._camera.updateProjectionMatrix()
    this._renderer.setSize(this._size.width, this._size.height)
  }

  private _resize = debounce(() => {
    this._setSize()
    this._setCamera()
  }, 50, true)

  private _render(): void {
    requestAnimationFrame(this._render.bind(this))

    if (this._customRender instanceof Function) {
      this._customRender(this._scene, this._camera, this)
    } else {
      this._renderer.render(this._scene, this._camera)
    }
  }

  private _notify(notifyType: ObserverTyep) {
    this._eventList.forEach(behavior => {
      const fn = behavior[notifyType]
      if (isFunction(fn)) {
        try {
          fn()
        } catch(err) {
          console.error(err)
        }
      }
    })
  }

  getDom(): Element {
    return this._renderer.domElement
  }

  getContainer(): Element {
    return this._container
  }

  getControls(): OrbitControls {
    return this._controls
  }

  getScene(): Scene {
    return this._scene
  }

  getCamera(): PerspectiveCamera {
    return this._camera
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
      this._render()
      this._resize()

      this._notify('mount')
    }

    return this
  }

  unmount(): this {
    const domElement = this.getDom()
    if (domElement) {
      domElement.remove()

      this._notify('unmount')
    }

    return this
  }

  subscribe(behavior: ObserverBehavior): ObserverBehavior {
    this._eventList.push(behavior)
    this._subscribe.set(behavior, behavior)

    return behavior
  }

  unSubscribe(behavior: ObserverBehavior) {
    const index = this._eventList.findIndex(item => item === behavior)
    index >=0 && this._eventList.splice(index, 1)
  }
}

function normalizeContainer(
  container: Element | string
): Element | null {
  if (isString(container)) {
    return document.querySelector(container)
  }
  
  return container
}
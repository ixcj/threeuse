import type { CreateAppOptions } from '../core/index.d'
import { isString } from '@/utils/type'
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  Vector3,
} from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { debounce } from '@/utils/handle'

export class ThreeUse {
  private _container: Element
  private _renderer: WebGLRenderer
  private _scene: Scene
  private _camera: PerspectiveCamera
  private _controls: OrbitControls
  private _resizeObserver = new ResizeObserver(() => this._resize())
  private _size: { width: number, height: number } = {
    width: 0,
    height: 0
  }

  private _customRender: null | undefined | ((this: ThreeUse) => void) = undefined

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
      this._customRender()
    } else {
      this._renderer.render(this._scene, this._camera)
    }
  }

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

  getDom(): Element {
    return this._renderer.domElement
  }

  getControls(): Element {
    return this._container
  }

  getScene(): Scene {
    return this._scene
  }

  getCamera(): PerspectiveCamera {
    return this._camera
  }
  
  use(plugin: Plugin, ...options: any[]) {
    return this
  }

  mount(rootContainer: Element | string) {
    const container = normalizeContainer(rootContainer)

    if (container) {
      this._container = container
      this._resizeObserver.observe(this._container)
      container.appendChild(this.getDom())
      this._render()
      this._resize()
    }
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

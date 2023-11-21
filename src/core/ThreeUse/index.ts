import { isString } from '@/utils/type'
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
} from 'three'

export class ThreeUse {
  private _renderer: WebGLRenderer
  private _scene: Scene
  private _camera: PerspectiveCamera
  private _size: { width: number, height: number }

  private _setSize() {
    this._size.width = window.innerWidth
    this._size.height = window.innerHeight
  }

  constructor() {
    this._scene = new Scene()
    this._renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      failIfMajorPerformanceCaveat: true,
    })

    this._setSize()
  }

  getDom() {
    return this._renderer.domElement
  }

  getScene() {
    return this._scene
  }

  getCamera() {
    return this._camera
  }

  use(plugin: Plugin, ...options: any[]) {
    return this
  }

  mount(rootContainer: Element | string) {
    const container = normalizeContainer(rootContainer)

    if (container) {
      container.appendChild(this.getDom())
    }
  }
}

function normalizeContainer(
  container: Element | string
): Element | null {
  if (isString(container)) {
    return document.querySelector(container)
  }
  
  return null
}

import {
  Scene
} from 'three'

export class ThreeUse {
  private _dom: Element
  private _scene: Scene

  constructor() {

  }

  getDom() {
    return this._dom
  }

  getScene() {
    return this._scene
  }

  use(plugin: Plugin, ...options: any[]) {
    return this
  }

  mount(rootContainer: Element | string) {
  }
}

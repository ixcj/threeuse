import type ThreeUse from '@/index'
import {
  CubeCamera,
  WebGLCubeRenderTarget,
  Vector3,
  LinearMipmapLinearFilter
} from 'three'

export interface CubeEnvMapOptions {
  position?: [number, number, number],
  size?: number,
  near?: number,
  far?: number,
}

export const cubeEnvMap = {
  install: (
    app: ThreeUse,
    options: CubeEnvMapOptions = {}
  ) => {
    const {
      position = [0, 100, 0],
      size = 128,
      near = 1,
      far = 100000
    } = options

    const cubeRenderTarget = new WebGLCubeRenderTarget(size, {
      generateMipmaps: true,
      minFilter: LinearMipmapLinearFilter
    })
    const cubeCamera = new CubeCamera(near, far, cubeRenderTarget)

    cubeCamera.position.copy(new Vector3(...position))

    function updateEnvMap() {
      cubeCamera.update(app.getRenderer(), app.getScene())
    }

    function setEnvMap() {
      app.getScene().environment = cubeRenderTarget.texture
    }

    function update() {
      updateEnvMap()
      setEnvMap()
    }

    app.globalProperties.$cubeEnvMap = {
      cubeCamera,
      cubeRenderTarget,
      updateEnvMap,
      setEnvMap,
      update
    }
  }
}

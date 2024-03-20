import type ThreeUse from '@/index'
import {
  CubeCamera,
  WebGLCubeRenderTarget,
  Vector3,
  LinearMipmapLinearFilter
} from 'three'

export const cubeEnvMap = {
  install: (app: ThreeUse, options: [[number, number, number]]) => {
    const [
      position = [0, 30, 0]
    ] = options

    const cubeRenderTarget = new WebGLCubeRenderTarget(128, { generateMipmaps: true, minFilter: LinearMipmapLinearFilter })
    const cubeCamera = new CubeCamera(1, 100000, cubeRenderTarget)

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

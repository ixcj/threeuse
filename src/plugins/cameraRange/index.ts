import type ThreeUse from '@/index'
import { useRenderClock } from '@/expands/useRenderClock'

export type RangeItem = { min: number, max: number };
export interface CameraRange {
  x: RangeItem,
  y: RangeItem,
  z: RangeItem,
}
export interface CameraRangeOptions {
  cameraRange?: CameraRange
}

export const cameraRange = {
  install: (app: ThreeUse, options: CameraRangeOptions = {}) => {
    const {
      cameraRange = {
        x: { min: -1950, max: 1950 },
        y: { min: 1, max: 1950 },
        z: { min: -1950, max: 1950 },
      },
    } = options

    const camera = app.getCamera()

    const { start } = useRenderClock(() => {
      Object.keys(cameraRange).forEach((key: keyof CameraRange) => {
        const { min, max } = cameraRange[key];
  
        (camera.position[key] < min) && (camera.position[key] = min);
        (camera.position[key] > max) && (camera.position[key] = max);
      })
    }, { activate: app.mounted })

    app.subscribe({
      mount: () => {
        start.value = true
      },
      unmount: () => {
        start.value = false
      }
    })

    app.globalProperties.$cameraRange = cameraRange
  }
}

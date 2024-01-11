import type ThreeUse from '@/index'
import { useRenderClock } from '@/hooks/other/useRenderClock'

export type RangeItem = { min: number, max: number };
export interface CameraRange {
  x: RangeItem,
  y: RangeItem,
  z: RangeItem,
}

export const cameraRange = {
  install: (app: ThreeUse, options: [CameraRange?]) => {
    const [
      range = {
        x: { min: -1950, max: 1950 },
        y: { min: 1, max: 1950 },
        z: { min: -1950, max: 1950 },
      },
    ] = options

    const camera = app.getCamera()

    useRenderClock(() => {
      Object.keys(range).forEach((key: keyof CameraRange) => {
        const { min, max } = range[key];
  
        (camera.position[key] < min) && (camera.position[key] = min);
        (camera.position[key] > max) && (camera.position[key] = max);
      })
    })
  }
}

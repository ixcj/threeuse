import type {
  UseSkyBoxOptions,
  UseSkyBoxReturnValue,
  UseSkyBoxControl,
} from './index.d'
import { ref, watch } from 'vue'
import {
  Scene,
  Vector3,
  DirectionalLight,
  Mesh,
  Object3D,
  FrontSide,
  MathUtils,
  Color
} from 'three'
import { Sky } from 'three/examples/jsm/objects/Sky.js'
import { useRenderClock } from '@/expands/useRenderClock'
import { isFunction } from '@/utils/type'
import { formattedDecimal } from '@/utils/math'
import TWEEN from '@tweenjs/tween.js'

export const TIME_MIN = 0
export const TIME_MAX = 720
export const TIME_RANGE = TIME_MAX - TIME_MIN
export const TIME_RANGE_MEDIAN = TIME_RANGE / 2

export function useSkyBox(scene: Scene, options: UseSkyBoxOptions = {}): UseSkyBoxReturnValue {
  const {
    defaultValue = 0,
    size = 4000,
    position = [0, 0, 0],
    sunLightName = '_sky_.sunLight',
    showSunLight = true,
    castShadowList = [],
    castShadowNumber = 2,
    durationMultiple = 3,
    updateCallback = undefined,
  } = options

  // 动画控制
  let tween: any = null
  const { start } = useRenderClock(() => {
    tween?.update()
  }, { activate: false })

  // 天空盒
  const sky = new Sky()
  sky.name = '_sky_.box'
  sky.scale.setScalar(size)

  // 值
  const value = ref<number>(defaultValue)
  // 老的值
  let oldVal = defaultValue
  // 控制器
  const control = ref<UseSkyBoxControl>({
    turbidity: 0,
    rayleigh: 0.223,
    mieCoefficient: 0,
    mieDirectionalG: 0,
    elevation: 12.2,
    azimuth: 180,
  })

  // 太阳位置
  let sun = new Vector3(0, 0, 0)
  // 太阳平行光对象
  let sunLight: DirectionalLight

  if (showSunLight) {
    // 设置太阳平行光
    sunLight = scene.getObjectByName(sunLightName) as DirectionalLight
    // 如果没有找到太阳平行光，创建它
    !sunLight && (sunLight = createSunLight(sunLightName, size))
  }

  if (showSunLight && castShadowList && castShadowList.length) {
    scene.traverse(node => {
      if (node instanceof Mesh) {
        // 所有的模型接收阴影
        node.receiveShadow = true

        if (isChildren(castShadowList, node, castShadowNumber)) {
          node.castShadow = true
          node.material.side = FrontSide
        }
      }
    })
  }

  // 将天空盒添加进场景
  sky.position.set(...position)
  scene.add(sky)

  watch(
    value,
    (newValue, oldValue) => {
      oldVal = oldValue || defaultValue

      control.value = getControlOptions(newValue)
    },
    { immediate: true }
  )

  watch(
    control,
    (val) => {
      tween?.stop()

      const elevationRatio = val.elevation / 65

      const oldSun = sun.clone()
      const newSun = sun.clone()

      const phi = MathUtils.degToRad(90 - val.elevation)
      const theta = MathUtils.degToRad(val.azimuth)
      newSun.setFromSphericalCoords(size / 2, phi, theta)

      const before = {
        rayleigh: sky.material.uniforms['rayleigh'].value,
        turbidity: sky.material.uniforms['turbidity'].value,
        mieCoefficient: sky.material.uniforms['mieCoefficient'].value,
        mieDirectionalG: sky.material.uniforms['mieDirectionalG'].value,
        sunX: oldSun.x,
        sunY: oldSun.y,
        sunZ: oldSun.z,
        intensity: sunLight.intensity,
        percent: Math.abs(TIME_RANGE - oldVal) / TIME_RANGE,
      }
      const after = {
        rayleigh: val.rayleigh,
        turbidity: val.turbidity,
        mieCoefficient: val.mieCoefficient,
        mieDirectionalG: val.mieDirectionalG,
        sunX: newSun.x,
        sunY: newSun.y,
        sunZ: newSun.z,
        intensity: value.value >= 0 ? (1 - (0.8 * (1 - elevationRatio))) * (elevationRatio > 0.2 ? 1.1 : 1) : 0.25,
        percent: Math.abs(TIME_RANGE - value.value) / TIME_RANGE,
      }

      if (durationMultiple) {
        start.value = true
        tween = new TWEEN.Tween(before)
          .to(after)
          .duration(Math.abs(value.value - oldVal) * durationMultiple)
          .easing(TWEEN.Easing.Linear.None)
          .onUpdate((params) => onUpdate(params, updateCallback))
          .onComplete(() => {
            start.value = false
            onUpdate(after, updateCallback)
          })
          .start()
      } else {
        onUpdate(after, updateCallback)
      }
    },
    { immediate: true }
  )

  function onUpdate(params: any, fn?: Function | undefined) {
    sky.material.uniforms['rayleigh'].value = params.rayleigh
    sky.material.uniforms['turbidity'].value = params.turbidity
    sky.material.uniforms['mieCoefficient'].value = params.mieCoefficient
    sky.material.uniforms['mieDirectionalG'].value = params.mieDirectionalG
  
    sun = new Vector3(params.sunX, params.sunY, params.sunZ)
    sky.material.uniforms['sunPosition'].value.copy(sun)
    sunLight.position.set(sun.x, sun.y, sun.z)
    sunLight.intensity = params.intensity
  
    var color1 = new Color(0xe8834d)
    var color2 = new Color(0xe1e8e4)
    sunLight.color.set(new Color().lerpColors(color1, color2, params.percent))
  
    if (isFunction(fn)) {
      try {
        fn()
      } catch(err) {
        console.error(err)
      }
    } 
  }

  return {
    value,
    control,
  }
}

// 创建阳光对象
function createSunLight(name: string, size: number = 4000) {
  const sunLight = new DirectionalLight(0xffffff, 1)

  sunLight.castShadow = true
  sunLight.shadow.mapSize.width = size
  sunLight.shadow.mapSize.height = size
  sunLight.shadow.camera.left = -size / 2
  sunLight.shadow.camera.bottom = -size / 2
  sunLight.shadow.camera.right = size
  sunLight.shadow.camera.top = size
  sunLight.shadow.camera.near = 0.5
  sunLight.shadow.camera.far = size
  sunLight.shadow.bias = 0.0001
  sunLight.position.set(0, 0, 0)
  sunLight.name = name

  return sunLight
}

// 是否是子元素
function isChildren(
  castShadowList: string[],
  node: Object3D,
  level: number = 2
): boolean {
  if (castShadowList.includes(node.name)) {
    return true
  } else {
    return level >= 1
      ? isChildren(castShadowList, node, level - 1)
      : false
  }
}

// 使用时间获取控制器配置
function getControlOptions(time: number): UseSkyBoxControl {
  if (time === TIME_MIN) time = TIME_MIN + 1
  if (time === TIME_MAX) time = TIME_MAX - 1

  const value = time / TIME_RANGE
  const medianValue = time / TIME_RANGE_MEDIAN

  const medianRatio = 1 - ((time - TIME_RANGE_MEDIAN) / TIME_RANGE_MEDIAN)
  const absMedianRatio = 1 - (Math.abs(time - TIME_RANGE_MEDIAN) / TIME_RANGE_MEDIAN)

  if (time >= 0) {
    return {
      turbidity: formattedDecimal(value * 10),
      rayleigh: formattedDecimal(0.233 + value * 3 * medianValue),
      mieCoefficient: formattedDecimal(value * medianRatio * 0.3),
      mieDirectionalG: formattedDecimal(value * (200 * medianRatio)),
      elevation: formattedDecimal(absMedianRatio * 65),
      azimuth: formattedDecimal(200 - medianRatio * 90)
    }
  } else {
    return {
      turbidity: 1,
      rayleigh: .223,
      mieCoefficient: 0.2,
      mieDirectionalG: 100,
      elevation: 30,
      azimuth: 75
    }
  }
}

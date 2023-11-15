import type { UseRollingDataOptions, UseRollingDataReturnValue } from './index.d'
import { ref, computed, watch, watchEffect } from 'vue'
import { registeredRenderFunctionMap } from '@/utils/render'
import { formattedDecimal } from '@/utils/math'

export function useRollingData<T = any>(
  data: Array<T>,
  options: UseRollingDataOptions = {}
): UseRollingDataReturnValue<T> {
  const {
    length = 10,
    interval = 1000,
    initialIndex = 0,
    activate = false,
    mode = 'DirectFill',
  } = options

  // 渲染函数里的key
  const key = Symbol()
  
  // 数据副本，在末尾添加length个数据用来首尾相连
  const dataCopy = [...data, ...data.slice(0, length)]

  // 当前数据所在的index
  const index = ref(initialIndex)

  // 截断数据的index
  const endIdex = ref(mode === 'SlowFill' ? index.value : index.value + length)

  // 当前显示数据的长度
  let displayDataLength = 0

  // 显示的数据
  const displayData = computed<T[]>(() => {
    const _displayData = dataCopy.slice(index.value, endIdex.value)
    displayDataLength = _displayData.length

    return _displayData
  })

  // 更新index时自动更新endIndex
  watchEffect(() => {
    let newEndIdex = index.value + length
    if (mode === 'SlowFill' && displayDataLength < length) {
      newEndIdex = displayDataLength + 1
    }

    endIdex.value = newEndIdex
  })

  // 是否开始滚动
  const start = ref(activate)

  // 上次更新的余数
  let remainderOfLastUpdate: number = 0

  watch(
    start,
    (val) => {
      if (val) {
        registeredRenderFunctionMap.set(key, (d: number) => {
          // 最新的个数数据，带小数，保留4位小数
          const newNumber_float = formattedDecimal((d / interval) + remainderOfLastUpdate, 4)

          // 设置余数，个数小于1时不更新，保留到下次计算，保留4位小数
          remainderOfLastUpdate = formattedDecimal(newNumber_float % 1, 4)

          // 本次更新的个数
          const newNumber = Math.floor(newNumber_float)

          if (newNumber) {
            if (index.value + length < dataCopy.length) { // 判断是否跑完全程
              if (mode === 'SlowFill' && displayData.value.length < length) { // 如果是缓慢填充模式并且没填充满
                endIdex.value = index.value + displayData.value.length + newNumber
              } else {
                index.value += newNumber
              }
            } else {
              // 跑完全程，重置下标位置
              index.value = 0
  
              // 跑完全程后强制修改endIndex，防止SlowFill模式重新填充
              endIdex.value = index.value + length
            }
          }
        })
      } else {
        registeredRenderFunctionMap.delete(key)
      }
    },
    { immediate: true }
  )

  return {
    displayData,
    index,
    endIdex,
    start,
    key,
  }
}

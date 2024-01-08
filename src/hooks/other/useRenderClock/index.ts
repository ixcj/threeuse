import type { Key, Fn, UseRenderClockOptions, UseRenderReturnValue } from './index.d'
import { ref, watchEffect, reactive } from 'vue'
import { isFunction } from '@/utils/type'

let lastUpdatedTimestamp: number

let requestId: null | number = null

export const renderFunctionMap = reactive(new Map<Key, Fn>())

function render() {
  const newLastUpdatedTimestamp = new Date().getTime()
  const timeDifference = newLastUpdatedTimestamp - lastUpdatedTimestamp

  lastUpdatedTimestamp = newLastUpdatedTimestamp

  if (renderFunctionMap.size) {
    if (typeof window !== "undefined") {
      requestId = window.requestAnimationFrame(render)
    }
    
    if (timeDifference !== 0) {
      renderFunctionMap.forEach(fn => {
        if (isFunction(fn)) {
          try {
            fn(timeDifference)
          } catch(err) {
            console.error(err)
          }
        }
      })
    }
  }
}

watchEffect(() => {
  if (renderFunctionMap.size) {
    if (requestId === null) {
      lastUpdatedTimestamp = new Date().getTime()
      render()
    }
  } else {
    if (typeof window !== "undefined" && requestId !== null) {
      window.cancelAnimationFrame(requestId)
      requestId = null
    }
  }
})

export function useRenderClock(fn: Fn, options: UseRenderClockOptions = {}): UseRenderReturnValue {
  const {
    key = Symbol(),
    activate = true,
  } = options

  const start = ref(activate)

  watchEffect(() => {
    if (start.value) {
      renderFunctionMap.set(key, fn)
    } else {
      renderFunctionMap.delete(key)
    }
  })

  return {
    start,
    key,
  }
}

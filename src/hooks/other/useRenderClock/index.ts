import type { Key, Fn, UseRenderClockOptions, UseRenderReturnValue } from './index.d'
import { ref, watchEffect } from 'vue'

let lastUpdatedTimestamp = new Date().getTime()

export const renderFunctionMap = new Map<Key, Fn>()

function render() {
  const newLastUpdatedTimestamp = new Date().getTime()
  const timeDifference = newLastUpdatedTimestamp - lastUpdatedTimestamp

  lastUpdatedTimestamp = newLastUpdatedTimestamp

  if (renderFunctionMap.size) {
    renderFunctionMap.forEach(fn => fn(timeDifference))
  }

  if (typeof window !== "undefined") {
    window.requestAnimationFrame(render)
  }
}

render()

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
      unload()
    }
  })

  function unload() {
    renderFunctionMap.delete(key)
  }

  return {
    start,
    key,
    unload,
  }
}

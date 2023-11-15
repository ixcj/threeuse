/**
 * 最后一次更新的时间戳
 */
export let lastUpdatedTimestamp = new Date().getTime()

/**
 * 所有注册的函数，每次渲染屏幕时执行
 */
export const registeredRenderFunctionMap = new Map<Symbol, Function>()

/**
 * 渲染函数
 */
function render() {
  const newLastUpdatedTimestamp = new Date().getTime()
  const differenceValue = newLastUpdatedTimestamp - lastUpdatedTimestamp

  lastUpdatedTimestamp = newLastUpdatedTimestamp

  if (registeredRenderFunctionMap.size) {
    registeredRenderFunctionMap.forEach(fn => fn(differenceValue))
  }

  if (typeof window !== "undefined") {
    window.requestAnimationFrame(render)
  }
}

render()

/**
 * 防抖函数
 * @param func 执行函数
 * @param delay 延迟时间 ms
 * @param immediate 是否立即执行
 */
export function debounce(
  func: Function,
  delay: number,
  immediate: boolean = false
): Function {
  let timer: NodeJS.Timeout

  return function (this: unknown, ...args: any[]) {
    let that = this
    if (immediate) {
      func.apply(that, args)
      immediate = false
      return
    }
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(that, args)
    }, delay)
  }
}

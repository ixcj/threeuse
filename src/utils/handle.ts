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

export function throttle(
  func: (...args: any[]) => void,
  limit: number,
  immediate: boolean = false
) {
  let timeout: NodeJS.Timeout | null;
  let initialCall = true;

  return function(this: any, ...args: any[]) {
    const callFunc = () => {
      timeout = null;
      if(!immediate) func.apply(this, args);
    };

    if(immediate) {
      if(initialCall){
        func.apply(this, args);
        initialCall = false;
      }
    } else {
        if(!timeout) func.apply(this, args);
    }

    clearTimeout(timeout as NodeJS.Timeout);
    timeout = setTimeout(callFunc, limit);
  }
}

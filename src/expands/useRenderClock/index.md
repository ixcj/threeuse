---

map:
  path: /expands/render-clock/

---

# 渲染时钟

渲染时钟

### 说明

获取每次渲染时与上一次渲染的时间差并执行回调函数

## 示例

<demo src="./__demo__/BasicUse.vue" title="基本使用" desc="获取屏幕渲染两帧之间的时间差"></demo>

## 类型

```js
function useRenderClock(
  fn: (timeDifference: number) => void,
  options?: UseRenderClockOptions
): UseRenderReturnValue
```

## 参数

<API src="./index.d.ts" lang="zh"></API>

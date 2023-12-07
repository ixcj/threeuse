---

map:
  path: /hooks/rain/

---

# 雨

为场景添加下雨效果

## 示例

<demo src="./__demo__/BasicUse.vue" title="基本使用" desc="下雨效果"></demo>

## 类型

```js
function useRain(
  scene: Scene,
  options?: UseRainOptions
): UseRainReturnValue
```

### 说明

第一个参数是Three.js的scene。第二个参数可选，它是传入函数的配置项。

## 参数

<API src="./index.d.ts" lang="zh"></API>

---

map:
  path: /hooks/sky-box/

---

# 天空盒

创建一个带有时间控制、阴影控制的天空盒

## 示例

<demo src="./__demo__/BasicUse.vue" title="基本使用" desc="可控制开始暂停、跳转到指定位置"></demo>

## 类型

```js
function useSkyBox(
  scene: Scene,
  options?: UseSkyBoxOptions
): UseSkyBoxReturnValue
```

### 说明

第一个参数是Three.js的scene。第二个参数可选，它是传入函数的配置项。

## 参数

<API src="./index.d.ts" lang="zh"></API>

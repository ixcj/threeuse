---

map:
  path: /expands/loader/

---

# 加载器

创建一个加载器

## 示例

<demo src="./__demo__/BasicUse.vue" title="基本使用" desc="使用加载器加载资源"></demo>

## 类型

```js
function useLoader(
  resource: ResourceItem | ResourceItem[],
  options?: UseLoaderOptions
): UseLoaderReturnValue
```

### 说明

第一个参数是要加载的资源。第二个参数可选，它是传入函数的配置项。

## 参数

<API src="./index.d.ts" lang="zh"></API>

### LoadingProgress

| 参数名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| [name: string] | 资源的名称 | `LoadingProgressItem` | `-` |

### LoadingProgressItem

| 参数名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| total | 资源大小 | `number` | `0` |
| progress | 加载进度 | `number` | `0` |

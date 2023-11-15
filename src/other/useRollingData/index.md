---

map:
  path: /other/rolling-data/

---

# 滚动数据

动态截取列表的一部分

## 类型

```js
function useRollingData<T = any>(
  list: Array<T>,
  options?: UseRollingDataOptions
): UseRollingDataReturnValue
```

### 说明

第一个参数是要截取的源数据。第二个参数可选，它是传入函数的配置项。

## 示例

<demo src="./__demo__/BasicUse.vue" title="基本使用" desc="可控制开始暂停、跳转到指定位置"></demo>

## 参数

<API src="./index.d.ts" lang="zh"></API>

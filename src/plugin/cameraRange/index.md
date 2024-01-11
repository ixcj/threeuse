---

map:
  path: /plugin/cameraRange/

---

# 相机位置范围

将相机的位置限制在一个范围内

## 示例

<demo src="./__demo__/BasicUse.vue" title="基本使用" desc="限制相机位置范围"></demo>

```js
import { createApp } from 'threeuse'
import { cameraRange } from 'threeuse/plugin'
const app = createApp()
app.use(cameraRange, range)
```

### 说明

通过调用 `createApp` 创建的实例对象上的 `use` 方法安装插件

## 参数

| 参数 | 说明 | 默认值 |
| ---- | ---- | ---- |
| range | 限制的范围 | `Range` |

### Range

| 参数 | 说明 | 默认值 |
| ---- | ---- | ---- |
| x | x轴限制的范围 | `{ min: -1950, max: 1950 }` |
| y | y轴限制的范围 | `{ min: 1, max: 1950 },` |
| z | z轴限制的范围 | `{ min: -1950, max: 1950 }` |

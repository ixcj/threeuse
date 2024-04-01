---

map:
  path: /plugins/stats/

---

# 性能检测

使用stats.js创建一个性能检测器

## 示例

<demo src="./__demo__/BasicUse.vue" title="基本使用" desc="创建一个性能检测器"></demo>

```js
import { createThreeUseApp } from 'threeuse'
import { stats } from 'threeuse/plugin'
const app = createApp()
app.use(stats, show, followContainer)
```

### 说明

通过调用 `createApp` 创建的实例对象上的 `use` 方法安装插件

## 参数

| 参数 | 说明 | 默认值 |
| ---- | ---- | ---- |
| show | 是否显示 | `true` |
| followContainer | 绑定到容器上，若为 `false` 则挂载到 `<body>` 元素上 | `true` |

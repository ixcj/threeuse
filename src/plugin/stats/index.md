---

map:
  path: /plugin/stats/

---

# 性能检测

使用stats.js创建一个性能检测器

## 示例

<demo src="./__demo__/BasicUse.vue" title="基本使用" desc="创建一个性能检测器"></demo>

## 说明

```js
import { stats } from 'threeuse/plugin'
app.use(stats, show, followContainer)
```

| 参数 | 说明 | 默认值 |
| ---- | ---- | ---- |
| show | 是否显示 | `true` |
| followContainer | 绑定到容器上，若为 `false` 则挂载到`<body>`元素上 | `true` |

<script setup lang="ts">
import { computed } from 'vue'
import { useRollingData } from 'threeuse'

import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent } from 'echarts/components'

use([
  CanvasRenderer,
  LineChart,
  GridComponent
])

const sourceData = [...new Array(100).keys()].map(key => {
  return {
    name: `数据${key}`,
    value: Math.floor(Math.random() * 100)
  }
})

const { displayData, start } = useRollingData(sourceData)

const option = computed(() => {
  const xAxisData = displayData.value.map(item => item.name)
  const seriesData = displayData.value.map(item => item.value)

  return {
    xAxis: {
      type: 'category',
      data: xAxisData
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: seriesData,
        type: 'line'
      }
    ]
  }
})
</script>

<template>
  <VChart class="chart" :option="option" autoresize />
  <div class="btn-box">
    <button @click="start = !start">{{ start ? '暂停' : '开始' }}</button>
  </div>
</template>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 300px;
}
</style>

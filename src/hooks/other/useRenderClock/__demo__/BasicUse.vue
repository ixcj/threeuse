<script setup lang="ts">
import { ref } from 'vue'
import { useRenderClock } from 'threeuse'

const REFRESH_COUNT = 1000

const fps = ref(0)
const refreshIntervalList: number[] = []

const { start } = useRenderClock((d) => {
  refreshIntervalList.push(d)
  
  const duration = refreshIntervalList.reduce((s, n) => s + n)
  if (duration >= REFRESH_COUNT) {
    const meanInterval = duration / refreshIntervalList.length
    fps.value = Math.round(1000 / meanInterval)
    refreshIntervalList.length = 0
  }
}, { activate: false })

function handleStart() {
  start.value = !start.value

  if (!start.value) {
    fps.value = 0
    refreshIntervalList.length = 0
  }
}
</script>

<template>
  <div>
    页面刷新率：<span>{{ start ? fps : '未开始' }}</span>
    <div class="btn-box">
      <button @click="handleStart">{{ start ? '暂停' : '开始' }}</button>
    </div>
  </div>
</template>

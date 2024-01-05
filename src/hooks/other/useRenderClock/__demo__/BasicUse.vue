<script setup lang="ts">
import { ref } from 'vue'
import { useRenderClock } from 'threeuse'

const REFRESH_COUNT = 10

const fps = ref(0)
const refreshIntervalList: number[] = []

const { start } = useRenderClock((d) => {
  refreshIntervalList.push(d)

  if (refreshIntervalList.length >= REFRESH_COUNT) {
    const duration = refreshIntervalList.reduce((s, n) => s + n)
    const meanInterval = duration / refreshIntervalList.length
    fps.value = Math.round(1000 / meanInterval)
    refreshIntervalList.length = 0
  }
})
</script>

<template>
  <div>
    屏幕帧率：<span>{{ fps }}</span>
    <div class="btn-box">
      <button @click="start = !start">{{ start ? '暂停' : '开始' }}</button>
    </div>
  </div>
</template>

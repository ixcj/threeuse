<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRenderClock } from 'threeuse'

const REFRESH_COUNT = 1000

const fps = ref(0)

let ticks
let lastTime

const { start } = useRenderClock(() => {
  ticks += 1

  const currentTime = new Date().getTime()
  const timeDifference = currentTime - lastTime

  if (timeDifference >= REFRESH_COUNT) {
    fps.value = Math.round(1000 / (timeDifference / ticks))
    ticks = 0
    lastTime = currentTime
  }
}, { activate: false })

function handleStart() {
  start.value = !start.value
}

watchEffect(() => {
  if (start.value) {
    fps.value = ticks = 0
    lastTime = new Date().getTime()
  }
})
</script>

<template>
  <div>
    页面刷新率：<span>{{ start ? fps : '未开始' }}</span>
    <div class="btn-box">
      <button @click="handleStart">{{ start ? '暂停' : '开始' }}</button>
    </div>
  </div>
</template>
